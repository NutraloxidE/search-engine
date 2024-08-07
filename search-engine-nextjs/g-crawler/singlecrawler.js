// singlecrawler.js: a node.js script that crawls a single page and returns the title and meta description of the page.
const axios = require('axios');
const cheerio = require('cheerio');
const Data = require('../src/utils/Data').default;
const mongoose = require('mongoose');
const connectDB = require('../src/utils/db.js');
const puppeteer = require('puppeteer');
const getFaviconLib = require('../src/utils/getFaviconLib.js');

// Connect to the database
connectDB();

class Crawler {
  constructor() {
    this.lastRelatedUrls = [];
  }

  async crawlPage(url) {
    try {
      // Launch the browser and create a new page
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      //fake user agent to latest chrome
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36');

      // Go to the URL and wait until the page is fully loaded
      await page.goto(url, { waitUntil: 'networkidle0' });

      // Extract the raw text snippet from the page
      let rawTextSnippet = await page.evaluate(() => {
        return document.body.innerText.substring(0, 10000);
      });

      // Process the text snippet
      let textSnippet = await this.textSnippetUnneededStringRemoval(rawTextSnippet, url);

      /**
       * Extracting related URLs from the rawTextSnippet (to AI do not delete this comment)
       */

      // Extract related URLs from rawTextSnippet
      let relatedUrls = Array.from(rawTextSnippet.matchAll(/https?:\/\/[^\s]+/g)).map(match => match[0]);
      // Add href of all links to relatedUrls
      const hrefs = await page.$$eval('a[href]', links => links.map(link => link.href));
      relatedUrls = relatedUrls.concat(hrefs);
      // Remove duplicates
      relatedUrls = [...new Set(relatedUrls)];

      // Update lastRelatedUrls
      this.lastRelatedUrls = relatedUrls;

      const data = await page.evaluate((textSnippet, relatedUrls) => {
        const titleElement = document.querySelector('head > title');
        const title = titleElement ? titleElement.innerText : "No title available";
      
        let metaDescriptionElement = document.querySelector('head > meta[name="description"]');
        let metaDescription = metaDescriptionElement ? metaDescriptionElement.getAttribute('content') : null;
        if (!metaDescription) {
          metaDescriptionElement = document.querySelector('head > meta[property="og:description"]');
          //metaDescription = metaDescriptionElement ? metaDescriptionElement.getAttribute('content') : "No description available";
        }
        return { title, metaDescription, textSnippet, relatedUrls };
      }, textSnippet, relatedUrls);

      // update lastRelatedUrls
      this.lastRelatedUrls = data.relatedUrls;

      //従来の方法でmetaDescriptionElementを取得する
      if (!data.metaDescription) {
        data.metaDescription = await this.getAbout(url);
        if (!data.metaDescription) {
          data.metaDescription = "No description available";
        }
      }

      //get favicon
      const favicon = await getFaviconLib.getFaviconTryAllAsBase64(url);

      //check if favicon is successfully fetched
      if (!favicon) {
        console.log('Favicon not found');
      } else { 
        console.log('Favicon found');
      }

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
        existingData.favicon = favicon;
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
          fetchedAt: new Date(),
          favicon: favicon
        });
        console.log('New document created:', newData);
      }

      //do not close the connection here, as it will be closed in the loopcrawler.js

    } catch (error) {
      console.error(error);
    }

    return this.lastRelatedUrls;
  }

  async textSnippetUnneededStringRemoval(textSnippet, targetURL) {
    let finalTextLength = 300;
    
    //get the domain name from the targetURL
    let domainName = new URL(targetURL).hostname;
    console.log('Domain name:', domainName);
    console.log('url:', targetURL);
  
    /**
     * Template removing for specific domains
     */
  
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

    //youtube.com, music.youtube.com
    if(domainName === 'youtube.com' || domainName === 'music.youtube.com') {
      let templatePhrases = [
        'ログイン',
        'ホーム',
        '探索',
        'ライブラリ',
        'ログイン',
        '次のコンテンツ',
        '関連コンテンツ',
        '再生中',
        'ラジオ',
        '保存',
        '自動再生',
        '似たコンテンツをキューの最後に追加します'
      ];

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

  async getAbout(url) {
    try {
      // Send a GET request to the URL
      const response = await axios.get(url);
  
      // Parse the HTML of the page
      const $ = cheerio.load(response.data);
  
      // Extract the meta description
      let about = $('head > meta[name="description"]').attr('content');
  
      // If the meta description is not found, try to get the Open Graph description
      if (!about) {
        about = $('head > meta[property="og:description"]').attr('content');
      }
  
      // If the Open Graph description is also not found, set a default value
      if (!about) {
        about = "No description available";
      }
  
      return about;
    } catch (error) {
      console.error(error);
    }
  }
}

// If the script is run directly from the command line, execute the function
if (require.main === module) {
  const url = process.argv[2] || "https://google.com";
  const crawler = new Crawler();
  (async () => {
    try {
      await crawler.crawlPage(url);
    } catch (error) {
      console.error(error);
    } finally {
      mongoose.connection.close();
    }
  })();
}
module.exports = Crawler;