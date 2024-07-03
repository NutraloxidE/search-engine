const singlecrawler = require('./singlecrawler');

async function crawlFarther(url, depth) {
  if (depth === 0) {
    return;
  }
  const urls = await singlecrawler(url);
  for (let i = 0; i < urls.length; i++) {
    await crawlFarther(urls[i], depth - 1);
  }
}

// If the script is run directly from the command line, execute the function
if (require.main === module) {
  const url = process.argv[2] || "https://x.com/r1cefarm";
  const depth = process.argv[3] || 2;
  crawlFarther(url, depth);
}