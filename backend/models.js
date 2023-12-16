const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
        type: String,
        unique: true
    },
    tax: Number
});

const productSchema = new Schema({
    name:  {
        type: String,
        unique: true
    },
    rate: Number,
    productCategory: {
        type: Schema.Types.ObjectId, ref: 'Category'
    }
});

module.exports = { 
    Category: mongoose.model('Category', categorySchema),
    Product: mongoose.model('Product', productSchema),
 }
 