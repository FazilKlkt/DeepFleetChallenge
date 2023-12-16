import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

const CategoryComponent = () => {
    // State variables to manage category name input and the list of categories
    const [categoryName, setCategoryName] = useState('');
    const [categories, setCategories] = useState([]);

    // Function to handle the addition of a new category
    const handleAddCategory = async () => {
        try {
            // Check if the category name is not empty
            if (categoryName.trim() !== '') {
                // Send a POST request to create a new category
                const response = await axios.post('http://localhost:3000/api/category', {
                    name: categoryName.trim(),
                });

                // If the category creation is successful, update the state with the new category
                if (response.data.status) {
                    const newCategory = {
                        name: categoryName.trim(),
                        _id: response.data.categoryId,
                    };

                    setCategories([...categories, newCategory]);
                    setCategoryName('');
                } else {
                    // Log an error if the category creation fails
                    console.error('Error creating category:', response.data.message);
                }
            }
        } catch (error) {
            // Log an error if there is an exception during category creation
            console.error('Error creating category:', error.message);
        }
    };

    // useEffect to fetch categories from the server when the component mounts
    useEffect(() => {
        axios.get('http://localhost:3000/api/category')
            .then(response => {
                // Update the state with the fetched categories
                const fetchedCategories = response.data.categories;
                setCategories(fetchedCategories);
            })
            .catch(error => {
                // Log an error if there is an issue fetching categories
                console.error('Error fetching categories:', error.message);
            });
    }, []);

    // JSX for rendering the component
    return (
        <div>
            <h1>Screen 1</h1>
            <div>
                {/* Input field for category name */}
                <label>
                    Product Category Name:{' '}
                    <input
                        type="text"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                    />
                </label>
                {/* Button to add a new category */}
                <button onClick={handleAddCategory}>Add</button>
            </div>
            <div>
                {/* Display the list of categories */}
                <h2>Categories:</h2>
                <ul>
                    {categories.map((category, index) => (
                        <li key={index}>{category.name}</li>
                    ))}
                </ul>
            </div>
            {/* Link to navigate to the next screen */}
            <Link to="/gst"><button>Next Screen</button></Link>
        </div>
    );
};

// Export the CategoryComponent as the default export
export default CategoryComponent;
