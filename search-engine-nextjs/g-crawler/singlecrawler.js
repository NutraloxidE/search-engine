//singlecrawler.js: a node.js script that crawls a single page and returns the title and meta description of the page.
const axios = require('axios');
const cheerio = require('cheerio');
const Data = require('../src/utils/Data').default;
const mongoose = require('mongoose');
const connectDB = require('../src/utils/db.js');
const puppeteer = require('puppeteer');

//static data
let lastRelatedUrls = [];

// Connect to the database
connectDB();

async function crawlPage(url) {
  try {
    // Launch the browser and create a new page
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Go to the URL and wait until the page is fully loaded
    await page.goto(url, { waitUntil: 'networkidle0' });

    // Extract the raw text snippet from the page
    let rawTextSnippet = await page.evaluate(() => {
      return document.body.innerText.substring(0, 700);
    });

    // Process the text snippet
    let textSnippet = await textSnippetUnneededStringRemoval(rawTextSnippet, url);

    // Extract related URLs from rawTextSnippet
    let relatedUrls = Array.from(rawTextSnippet.matchAll(/https?:\/\/[^\s]+/g)).map(match => match[0]);


    const data = await page.evaluate((textSnippet, relatedUrls) => {
      const titleElement = document.querySelector('head > title');
      const title = titleElement ? titleElement.innerText : "No title available";
    
      let metaDescriptionElement = document.querySelector('head > meta[name="description"]');
      let metaDescription = metaDescriptionElement ? metaDescriptionElement.getAttribute('content') : null;
      if (!metaDescription) {
        metaDescriptionElement = document.querySelector('head > meta[property="og:description"]');
        metaDescription = metaDescriptionElement ? metaDescriptionElement.getAttribute('content') : "No description available";
      }
      return { title, metaDescription, textSnippet, relatedUrls };
    }, textSnippet, relatedUrls);

    // Close the browser
    await browser.close();

    // Check if the URL already exists in the database
    let existingData = await Data.findOne({ url: url });

    if (existingData) {
      // If the URL exists, update the existing data
      existingData.title = data.title;
      existingData.about = data.metaDescription;
      existingData.textSnippet = data.textSnippet;
      existingData.relatedUrls = relatedUrls; // Update related URLs
      existingData.fetchedAt = new Date();
      await existingData.save();
      console.log('Existing document updated:', existingData);
    } else {
      // If the URL does not exist, create new data
      const newData = await Data.create({
        id: 1,
        title: data.title,
        url: url,
        about: data.metaDescription,
        textSnippet: data.textSnippet,
        relatedUrls: relatedUrls, // Save related URLs
        fetchedAt: new Date()
      });
      console.log('New document created:', newData);
    }

    mongoose.connection.close();

  } catch (error) {
    console.error(error);
    mongoose.connection.close();
  }
}

async function textSnippetUnneededStringRemoval(textSnippet, targetURL) {
  let finalTextLength = 300;
  
  //get the domain name from the targetURL
  let domainName = new URL(targetURL).hostname;
  console.log('Domain name:', domainName);

  /**
   * Template removing for specific domains
   */

  //remove spaces, and fullwidth spaces, newlines, and carriage returns
  //textSnippet = textSnippet.replace(/[\s\u3000\n\r]+/g, '').trim();


  //x.com or twitter.com
  if(domainName === 'x.com' || domainName === 'twitter.com') {
    //list of template phrases to remove
    let templatePhrases = [
      '「いま」起きていることを見つけよう',
      '「いま」起きていることをいち早くチェックできます。',
      'ログイン',
      'アカウント作成',
      'x.comへようこそ',
      'XのURLが変更される予定です。',
      'ただし、プライバシーとデータ保護の設定は変わりません。',
      '詳細は、プライバシーポリシー',
      'をご覧ください',
      '（https://x.',
      'com/en/privacy）',
      ' https://x.com/en/privacy',
      '（）を',
      'Xなら、',
    ];

    //remove template phrases
    for (let phrase of templatePhrases) {
      textSnippet = textSnippet.replace(new RegExp(phrase, 'g'), '');
    }
  }

  /**
   * Finalize the textSnippet
   */

  //remove new lines and carriage returns
  textSnippet = textSnippet.replace(/[\n\r]+/g, ' ');

  //remove replace double spaces with single spaces
  textSnippet = textSnippet.replace(/  +/g, ' ');

  //make it smaller then finaltextlength
  textSnippet = textSnippet.substring(0, finalTextLength);

  return textSnippet;
}

// If the script is run directly from the command line, execute the function
if (require.main === module) {
  const url = process.argv[2] || "https://x.com/r1cefarm";
  crawlPage(url);
}

module.exports = crawlPage;