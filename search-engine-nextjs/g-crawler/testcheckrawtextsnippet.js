const puppeteer = require('puppeteer');

(async () => {
  const url = process.argv[2] || 'https://example.com'; // コマンドライン引数でURLを指定できるようにします

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url); // 引数で指定したURLを読み込みます

  const rawTextSnippet = await page.evaluate(() => document.body.innerText.substring(0, 3000));
  console.log(rawTextSnippet);

  await browser.close();
})();