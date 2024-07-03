const { default: mongoose } = require('mongoose');
const Crawler = require('./singlecrawler');

async function crawlFarther(url, depth) {
  if (depth === 0) {
    return;
  }
  const crawler = new Crawler();
  const urls = await crawler.crawlPage(url);
  for (let i = 0; i < urls.length; i++) {
    const crawlerForLoop = new Crawler();
    await crawlerForLoop.crawlPage(urls[i]);
  }
}

// If the script is run directly from the command line, execute the function
if (require.main === module) {
  const url = process.argv[2] || "https://x.com/r1cefarm";
  const depth = process.argv[3] || 2;

  (async () => {
    try {
      await crawlFarther(url, depth);
    } catch (error) {
      console.error(error);
    } finally {
      mongoose.connection.close();
    }
  })();
}