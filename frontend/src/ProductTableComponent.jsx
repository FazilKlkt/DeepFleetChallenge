import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

const ProductTableComponent = () => {
  // State variables to manage category name, product name, product rate, product tax,
  // visibility of the bill element, product data, table data, categories, and category products
  const [categoryName, setCategoryName] = useState('Sandal');
  const [productName, setProductName] = useState('');
  const [productRate, setProductRate] = useState('');
  const [productTax, setProductTax] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState([]);

  // useEffect to fetch categories and set the default category when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/category');

        if (response.data.status) {
          setCategories(response.data.categories);
        } else {
          console.error('Error fetching categories:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching categories:', error.message);
      }
    };

    fetchCategories();

    if (categories.length > 0) {
      setCategoryName(categories[0].name);
    } else {
      setCategoryName("none");
    }
  }, []);

  // useEffect to fetch products when the selected category changes
  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        const response = await axios.post('http://localhost:3000/api/productCat', {
          categoryName: categoryName,
        });

        if (response.data.status) {
          setCategoryProducts(response.data.products);
        } else {
          console.error('Error fetching products:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching products:', error.message);
      }
    };

    fetchProductsByCategory();
  }, [categoryName]);

  // Function to fetch product details based on the selected product name
  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/product/${productName}`);

      if (response.data.status) {
        const productDetails = response.data.product;
        const newProduct = { category: productDetails.category, name: productName, rate: productDetails.rate, tax: productDetails.gstTax };
        setProducts([...products, newProduct]);
        setTableData([...tableData, newProduct]);
      } else {
        console.error('Error fetching product details:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching product details:', error.message);
    }
  };

  // Function to handle adding a new product to the list
  const handleAddProduct = () => {
    if (categoryName.trim() !== '' && productName.trim() !== '') {
      fetchProductDetails();
    }
  };

  // Function to handle submitting the form and generating the bill
  const handleSubmit = () => {
    console.log('Table Content:', tableData);
    setIsVisible(true);
  };

  // JSX for rendering the component
  return (
    <div>
      <h1>Screen 4</h1>
      <div>
        {/* Dropdown to select a category */}
        <label>
          Category Name :{' '}
          <select
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
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
        {/* Dropdown to select a product */}
        <label>
          Product Name :{' '}
          <select
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          >
            {categoryProducts.map((product, index) => (
              <option key={index} value={product.name}>
                {product.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Links to navigate to the previous and next screens */}
      <Link to="/product"><button>Previous Screen</button></Link>
      <button style={{ marginLeft: "20px" }} onClick={handleAddProduct}>Add to List</button>

      {/* Display the product table if there are products added */}
      {tableData.length > 0 && (
        <div>
          <h2>Product Table:</h2>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Rate</th>
                <th>Tax</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((product, index) => (
                <tr key={index}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.rate}</td>
                  <td>{product.tax}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleSubmit}>Generate Bill</button>

          {/* Display the bill element if isVisible is true */}
          {isVisible && <BillElement tableData={tableData} />}
        </div>
      )}
    </div>
  );
};

// BillElement component to display the bill details
const BillElement = ({ tableData }) => {
  // Function to calculate totals for rate, tax, and sum total
  const calculateTotals = () => {
    let totalRate = 0;
    let totalTax = 0;

    tableData.forEach((product) => {
      totalRate += parseFloat(product.rate);
      totalTax += parseFloat(product.tax);
    });

    const sumTotal = totalRate + totalTax;
    return { totalRate, totalTax, sumTotal };
  };

  // Calculate totals
  const { totalRate, totalTax, sumTotal } = calculateTotals();

  // JSX for rendering the bill details
  return (
    <div>
      <h2>Bill Details:</h2>
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Total Rate</td>
            <td>{totalRate}</td>
          </tr>
          <tr>
            <td>Total Tax</td>
            <td>{totalTax}</td>
          </tr>
          <
