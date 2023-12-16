import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";



const CategoryComponentWithGST = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [gstRate, setGstRate] = useState('');
  const [categoriesWithGST, setCategoriesWithGST] = useState([]);
  const [allCategories, setAllCategories] = useState([]);


  useEffect(() => {
    axios.get('http://localhost:3000/api/category')
      .then(response => {
        const fetchedCategories = response.data.categories;
        setCategoriesWithGST(fetchedCategories.map(category => ({
          category: category.name,
          gst: category.tax,
        })));
        setAllCategories(fetchedCategories.map(category => category.name))
      })
      .catch(error => {
        console.error('Error fetching categories:', error.message);
      });
  }, []);

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

  const handleSaveData = async () => {
    try {
      const response = await axios.put('http://localhost:3000/api/category', {
        cNames: selectedCategory,
        cTax: gstRate,
      });

      if (response.data.status) {
        const updatedCategoriesWithGST = categoriesWithGST.map(category => {
          if (category.category === selectedCategory) {
            return { category: selectedCategory, gst: gstRate };
          }
          return category;
        });

        setCategoriesWithGST(updatedCategoriesWithGST);
      } else {
        console.error('Error updating category GST rates:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating category GST rates:', error.message);
    }
  };

  return (
    <div>
      <h1>Screen 2</h1>
      <div>
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
        <label>
          GST Rate :{' '}
          <input
            type="text"
            value={gstRate}
            onChange={(e) => setGstRate(e.target.value)}
          />
        </label>
        <button onClick={handleSaveData}>Update</button>
      </div>
      <div>
        <h2>Categories with GST Rate:</h2>
        <ul>
          {categoriesWithGST.map((category, index) => (
            <li key={index}>
              {category.category} - GST Rate: {category.gst}%
            </li>
          ))}
        </ul>
      </div>
      <Link to="/"><button>Previous Screen</button></Link>
      <Link to="/product"><button style={{marginLeft:"20px"}}>Next Screen</button></Link>
    </div>
  );
};

export default CategoryComponentWithGST;
