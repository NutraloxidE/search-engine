const { default: mongoose } = require('mongoose');
const Crawler = require('./singlecrawler');
const connectDB = require('../src/utils/db');
const Data = require('../src/utils/Data').default;

connectDB();

async function updateData(url, expandDB) {
  const crawler = new Crawler();

  // Check if the URL was fetched within the last minute
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
  const existingData = await Data.findOne({ url: url });

  if (existingData && existingData.fetchedAt > oneMinuteAgo) {
    console.log(`Skipping ${url}, fetched within the last minute.`);
    return;
  }

  // Start time for measuring the duration
  const startTime = Date.now();

  // Crawl the page and update the database
  const urls = await crawler.crawlPage(url);

  // Optionally, update related URLs if --expanddb flag is provided
  if (expandDB) {
    for (let i = 0; i < urls.length; i++) {
      const crawlerForLoop = new Crawler();
      await crawlerForLoop.crawlPage(urls[i]);
    }
  }

  // End time and duration calculation
  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000; // duration in seconds
  console.log(`Updated ${url} in ${duration} seconds.`);
}

async function updateAllData(expandDB) {
  try {
    const dataEntries = await Data.find({});
    for (let i = 0; i < dataEntries.length; i++) {
      const url = dataEntries[i].url;
      await updateData(url, expandDB);
    }
  } catch (error) {
    console.error('Error updating data:', error);
  } finally {
    mongoose.connection.close();
  }
}

// If the script is run directly from the command line, execute the function
if (require.main === module) {
  const expandDB = process.argv.includes('--expanddb');
  (async () => {
    try {
      await updateAllData(expandDB);
    } catch (error) {
      console.error(error);
    }
  })();
}

module.exports = updateData;
