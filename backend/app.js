const express = require('express');
const cors = require('cors');

const { Category, Product } = require('./models');
const connectDB = require('./db');
const PORT = 3000;

connectDB();
const app = express();
app.use(cors());
app.use(express.json());


// Category
// get all categories
app.get('/api/category', async (req, res) => {
    try {
        // fetch all categories
        const category = await Category.find();
        // return success response with categories
        return res.status(200).json({
            status: true,
            message: "Sucessfully retreived categories",
            categories: category
        });
    } catch (e) {
        // handle error and return failure response
        return res.status(400).json({
            status: false,
            message: e.message,
            categories: []
        });
    }
});

// add a new category
app.post('/api/category', async (req, res) => {
    try {
        // get category name from request body
        const { name } = req.body;
        // create new category with trimmed name and default tax
        const category = new Category({
            name: name.trim(),
            tax: 0
        });
        // save new category to database
        await category.save();
        // return success response with category ID
        return res.status(200).json({
            status: true,
            message: "Sucessfully created category",
            categoryId: category._id
        });
    } catch (e) {
        // handle error and return failure response
        return res.status(400).json({
            status: false,
            message: e.message,
            categoryId: "-1"
        });
    }
});

// update category tax rates
app.put('/api/category', async (req, res) => {
    try {
        // get category names and corresponding tax rates from request body
        const { cNames, cTax } = req.body;
        // find the category by name
        const category = await Category.findOne({ name: cNames });
        // update the category's tax rate
        category.tax = cTax;
        // save the updated category
        await category.save();

        // return success response
        return res.status(200).json({
            status: true,
            message: "Sucessfully updated category GST rate"
        });
    } catch (e) {
        // handle error and return failure response
        return res.status(400).json({
            status: false,
            message: e.message
        });
    }
});


// Product
// get product by name
app.get('/api/product/:productName', async (req, res) => {
    try {
        // get the product name from the request parameters
        const { productName } = req.params;
        // find the product by name
        const product = await Product.findOne({ name: productName });
        if (!product) {
            return res.status(404).json({
                status: false,
                message: 'Product not found',
                product: null
            });
        }
        // find the category of the product
        const category = await Category.findById(product.productCategory);
        // calculate GST tax on the rate 
        const gstTax = (product.rate * category.tax) / 100;
        // return success response with product details
        return res.status(200).json({
            status: true,
            message: 'Successfully retrieved product details',
            product: {
                category: category.name,
                rate: product.rate,
                gstTax: gstTax
            }
        });
    } catch (e) {
        // handle error and return failure response
        return res.status(400).json({
            status: false,
            message: e.message,
            product: null
        });
    }
});


// get products by category
app.post('/api/productCat', async (req, res) => {
    try {
        // get category name from request body
        const { categoryName } = req.body;
        if (categoryName === undefined) {
            return res.status(400).json({
                status: false,
                message: "categoryName not provided",
                products: []
            });
        }

        // find the category by name
        const category = await Category.findOne({ name: categoryName });
        console.log(`category : `, category);
        if(category===null){
            return res.status(200).json({
                status: true,
                message: "Sucessfully retreived products",
                products: []
            });
        }
        // find all products belonging to the category
        const products = await Product.find({ productCategory: category._id });
        // extract product names from the product objects
        const productNames = products.map((product) => ({
            name: product.name,
            rate: product.rate,
        }));

        // return success response with product names
        return res.status(200).json({
            status: true,
            message: "Sucessfully retreived products",
            products: productNames
        });
    } catch (e) {
        // handle error and return failure response
        return res.status(400).json({
            status: false,
            message: e.message,
            products: []
        });
    }
});

// add a new product
app.post('/api/product', async (req, res) => {
    try {
        // get required data from request body
        const { cName, pName, rate } = req.body;
        // validate required fields
        if (!cName || !pName || !rate) {
            return res.status(400).json({
                status: false,
                message: 'Missing required fields: cName, pName, rate',
            });
        }

        // find the associated category
        const category = await Category.findOne({ name: cName });
        // create and save new product
        const product = new Product({
            name: pName.trim(),
            rate: rate,
            productCategory: category._id
        });
        await product.save();

        // return success response with product ID
        return res.status(200).json({
            status: true,
            message: "Sucessfully created product",
            productId: product._id
        });
    } catch (e) {
        // handle errors and return failure response
        return res.status(400).json({
            status: false,
            message: e.message,
            product: "-1"
        });
    }
});


app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`);
});
