import axios from 'axios';
import cheerio from 'cheerio';
import * as Jimp from 'jimp';

export async function resizeImage(buffer: Buffer): Promise<Buffer> {
  const image = await Jimp.read(buffer);
  image.resize(32, 32);
  return await image.getBufferAsync(Jimp.MIME_PNG);
}

export function toBase64(buffer: Buffer): string {
  return buffer.toString('base64');
}

async function fetchAndResizeFavicon(url: string): Promise<string | null> {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const resizedBuffer = await resizeImage(Buffer.from(response.data, 'binary'));
    return `data:image/png;base64,${toBase64(resizedBuffer)}`;
  } catch (error) {
    console.error('Error fetching favicon:', error);
    return null;
  }
}

export async function getFaviconFromHtml(url: string, html: string): Promise<string | null> {
  const $ = cheerio.load(html);
  const selectors = [
    'link[rel="icon"]',
    'link[rel="shortcut icon"]',
    'link[rel="apple-touch-icon"]',
    'link[rel="apple-touch-icon-precomposed"]',
    'meta[property="og:image"]'
  ];

  for (const selector of selectors) {
    let faviconUrl = $(selector).attr('href') || $(selector).attr('content');
    if (faviconUrl) {
      if (!faviconUrl.startsWith('http')) {
        faviconUrl = new URL(faviconUrl, url).href;
      }
      const favicon = await fetchAndResizeFavicon(faviconUrl);
      if (favicon) {
        return favicon;
      }
    }
  }

  return null;
}

export async function getFaviconAltAsBase64(url: string): Promise<string | null> {
  try {
    const response = await axios.get(url);
    return await getFaviconFromHtml(url, response.data);
  } catch (error) {
    console.error('Error fetching HTML for favicon:', error);
    return null;
  }
}

export async function getFaviconAsBase64(url: string): Promise<string | null> {
  try {
    const favicon = await fetchAndResizeFavicon(`${url}/favicon.ico`);
    if (favicon) {
      return favicon;
    }
  } catch (error) {
    console.error('Error fetching favicon.ico:', error);
  }

  return getFaviconAltAsBase64(url);
}

export async function getFaviconTryAllAsBase64(url: string): Promise<string | null> {
  const favicon = await getFaviconAsBase64(url);
  if (favicon) {
    return favicon;
  }
  return getFaviconAltAsBase64(url);
}
