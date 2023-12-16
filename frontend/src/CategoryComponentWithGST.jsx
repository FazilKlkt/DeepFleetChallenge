import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

const CategoryComponentWithGST = () => {
  // State variables to manage selected category, category name, GST rate,
  // categories with GST, and all categories
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [gstRate, setGstRate] = useState('');
  const [categoriesWithGST, setCategoriesWithGST] = useState([]);
  const [allCategories, setAllCategories] = useState([]);

  // useEffect to fetch categories from the server when the component mounts
  useEffect(() => {
    axios.get('http://localhost:3000/api/category')
      .then(response => {
        // Extract categories and their GST rates from the response
        const fetchedCategories = response.data.categories;
        const categoriesWithGSTData = fetchedCategories.map(category => ({
          category: category.name,
          gst: category.tax,
        }));

        // Update state variables with fetched data
        setCategoriesWithGST(categoriesWithGSTData);
        setAllCategories(fetchedCategories.map(category => category.name));
      })
      .catch(error => {
        // Log an error if there is an issue fetching categories
        console.error('Error fetching categories:', error.message);
      });
  }, []);

  // useEffect to update GST rate when the selected category changes
  useEffect(() => {
    if (selectedCategory !== '') {
      const existingCategory = categoriesWithGST.find(category => category.category === selectedCategory);
      if (existingCategory) {
        setGstRate(existingCategory.gst);
      } else {
        setGstRate('');
      }
    }
  }, [selectedCategory, categoriesWithGST]);

  // Function to handle saving data (updating GST rate)
  const handleSaveData = async () => {
    try {
      // Send a PUT request to update category GST rate
      const response = await axios.put('http://localhost:3000/api/category', {
        cNames: selectedCategory,
        cTax: gstRate,
      });

      // If the update is successful, update the state with the new GST rate
      if (response.data.status) {
        const updatedCategoriesWithGST = categoriesWithGST.map(category => {
          if (category.category === selectedCategory) {
            return { category: selectedCategory, gst: gstRate };
          }
          return category;
        });

        setCategoriesWithGST(updatedCategoriesWithGST);
      } else {
        // Log an error if the update fails
        console.error('Error updating category GST rates:', response.data.message);
      }
    } catch (error) {
      // Log an error if there is an exception during the update
      console.error('Error updating category GST rates:', error.message);
    }
  };

  // JSX for rendering the component
  return (
    <div>
      <h1>Screen 2</h1>
      <div>
        {/* Dropdown to select a category */}
        <label>
          Select Category :{' '}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Select...</option>
            {allCategories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        {/* Input field for GST rate */}
        <label>
          GST Rate :{' '}
          <input
            type="text"
            value={gstRate}
            onChange={(e) => setGstRate(e.target.value)}
          />
        </label>
        {/* Button to update GST rate */}
        <button onClick={handleSaveData}>Update</button>
      </div>
      <div>
        {/* Display the list of categories with GST rates */}
        <h2>Categories with GST Rate:</h2>
        <ul>
          {categoriesWithGST.map((category, index) => (
            <li key={index}>
              {category.category} - GST Rate: {category.gst}%
            </li>
          ))}
        </ul>
      </div>
      {/* Links to navigate to the previous and next screens */}
      <Link to="/"><button>Previous Screen</button></Link>
      <Link to="/product"><button style={{ marginLeft: "20px" }}>Next Screen</button></Link>
    </div>
  );
};

// Export the CategoryComponentWithGST as the default export
export default CategoryComponentWithGST;
