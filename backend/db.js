const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/deepfleet", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            family: 4
        });
        console.log('mongodb connection success!');
    } catch (err) {
        console.log('mongodb connection failed!', err.message);
    }
};

module.exports = connectDB;