import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

const CategoryComponent = () => {
    const [categoryName, setCategoryName] = useState('');
    const [categories, setCategories] = useState([]);

    const handleAddCategory = async () => {
        try {
            if (categoryName.trim() !== '') {
                const response = await axios.post('http://localhost:3000/api/category', {
                    name: categoryName.trim(),
                });

                if (response.data.status) {
                    const newCategory = {
                        name: categoryName.trim(),
                        _id: response.data.categoryId,
                    };

                    setCategories([...categories, newCategory]);
                    setCategoryName('');
                } else {
                    console.error('Error creating category:', response.data.message);
                }
            }
        } catch (error) {
            console.error('Error creating category:', error.message);
        }
    };

    useEffect(() => {
        axios.get('http://localhost:3000/api/category')
            .then(response => {
                const fetchedCategories = response.data.categories;
                setCategories(fetchedCategories);
            })
            .catch(error => {
                console.error('Error fetching categories:', error.message);
            });
    }, []);

    return (
        <div>
            <h1>Screen 1</h1>
            <div>
                <label>
                    Product Category Name :{' '}
                    <input
                        type="text"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                    />
                </label>
                <button onClick={handleAddCategory}>Add</button>
            </div>
            <div>
                <h2>Categories:</h2>
                <ul>
                    {categories.map((category, index) => (
                        <li key={index}>{category.name}</li>
                    ))}
                </ul>
            </div>
            <Link to="/gst"><button>Next Screen</button></Link>
        </div>
    );
};

export default CategoryComponent;
