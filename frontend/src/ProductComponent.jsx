import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

const ProductComponent = () => {
  // State variables to manage category name, product name, product rate,
  // categories, and products
  const [categoryName, setCategoryName] = useState('');
  const [productName, setProductName] = useState('');
  const [productRate, setProductRate] = useState('');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  // useEffect to fetch categories and set the default category when the component mounts
  useEffect(() => {
    fetchCategories();
    if (categories.length > 0) {
      setCategoryName(categories[0].name);
      fetchProductsByCategory();
    } else {
      setCategoryName("none");
    }
  }, []);

  // useEffect to fetch products when the selected category changes
  useEffect(() => {
    fetchProductsByCategory();
  }, [categoryName]);

  // Function to fetch categories from the server
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/category');

      if (response.data.status) {
        console.log('Successfully fetched categories');
        const fetchedCategories = response.data.categories;
        setCategories(fetchedCategories);
      } else {
        console.error('Error fetching categories:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching categories:', error.message);
    }
  };

  // Function to handle adding a new product
  const handleAddProduct = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/product', {
        cName: categoryName,
        pName: productName,
        rate: productRate,
      });

      if (response.data.status) {
        console.log('Successfully created product');
        // Assuming the server sends back the new product ID, you may want to use it in your application
        const productId = response.data.productId;
        // You can use productId for further actions if needed

        // Fetch the updated list of products after adding a new one
        await fetchProductsByCategory();
      } else {
        console.error('Error creating product:', response.data.message);
      }
    } catch (error) {
      console.error('Error creating product:', error.message);
    }
  };

  // Function to fetch products based on the selected category
  const fetchProductsByCategory = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/productCat', {
        categoryName: categoryName
      });

      if (response.data.status) {
        console.log('Successfully fetched products');
        const fetchedProducts = response.data.products;
        setProducts(fetchedProducts);
      } else {
        console.error('Error fetching products:', response.data.message);
      }
    } catch (error) {
      console.log(error);
      console.error('Error fetching products:', error.message);
    }
  };

  // JSX for rendering the component
  return (
    <div>
      <h1>Screen 3</h1>
      <div>
        {/* Dropdown to select a category */}
        <label>
          Category Name :{' '}
          <select
            value={categoryName}
            onChange={(e) => {
              setCategoryName(e.target.value);
              fetchProductsByCategory();
            }}
          >
            {categories.map((category, index) => (
              <option key={index} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        {/* Input field for product name */}
        <label>
          Product Name :{' '}
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </label>
      </div>
      <div>
        {/* Input field for product rate */}
        <label>
          Rate of Product :{' '}
          <input
            type="text"
            value={productRate}
            onChange={(e) => setProductRate(e.target.value)}
          />
        </label>
      </div>
      {/* Button to add a new product */}
      <button onClick={handleAddProduct}>Add Product</button>

      <div>
        {/* Display the list of added products */}
        <h2>Added Products:</h2>
        {products.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Rate</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index}>
                  <td>{product.name}</td>
                  <td>{product.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* Links to navigate to the previous and next screens */}
      <Link to="/gst"><button>Previous Screen</button></Link>
      <Link to="/sale"><button style={{ marginLeft: "20px" }}>Next Screen</button></Link>
    </div>
  );
};

// Export the ProductComponent as the default export
export default ProductComponent;
