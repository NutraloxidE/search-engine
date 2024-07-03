require('dotenv').config({ path: '../.env.local' });
const mongoose = require('mongoose');

function connectDB() {
  mongoose.connect(process.env.MONGODB_URI,{dbName: process.env.DB_NAME_FOR_WEB_INDEX})
    .then(() => console.log('db.js:MongoDB connected...'))
    .catch(err => console.log('db.js:MongoDB connection error:', err));
}

module.exports = connectDB;