//singlecrawler.js: a node.js script that crawls a single page and returns the title and meta description of the page.
require('dotenv').config({ path: '../env.local' });

const Data = require('../src/utils/Data').default;
const { default: mongoose, mongo } = require('mongoose');
const connectDB = require('../src/utils/db.js');

//connect to the database
connectDB();

console.log('Crawler started');

//add data to the database
Data.create({
  id: 1,
  title: "Example Title",
  url: "https://example.com",
  about: "example about text",
  textSnippet: "example text snippet",
  fetchedAt: "2021-08-01T00:00:00.000Z"
})
.then(newData => {
  //close the connection if the data is added successfully
  console.log('New document created:', newData);
  mongoose.connection.close();
})
.catch(error => {
  // handle error
  mongoose.connection.close();
});