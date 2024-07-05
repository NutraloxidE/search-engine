import axios from 'axios';
import cheerio from 'cheerio';
import type { NextApiRequest, NextApiResponse } from 'next';
import Jimp from 'jimp';

async function resizeImage(buffer: Buffer): Promise<Buffer> {
  const image = await Jimp.read(buffer);
  image.resize(32, 32);
  return await image.getBufferAsync(Jimp.MIME_PNG);
}

// BufferからBase64に変換する関数
function toBase64(buffer: Buffer): string {
  return buffer.toString('base64');
}

// faviconを取得し、Base64形式に変換する関数
async function getFaviconAsBase64(url: string): Promise<string | null> {
  try {
    const response = await axios.get(`${url}/favicon.ico`, {
      responseType: 'arraybuffer',
    });
    const resizedBuffer = await resizeImage(Buffer.from(response.data, 'binary'));
    return `data:image/png;base64,${toBase64(resizedBuffer)}`;
  } catch (error) {
    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const faviconUrl = $('link[rel="icon"], link[rel="shortcut icon"]').attr('href');
      if (faviconUrl) {
        const faviconResponse = await axios.get(faviconUrl, {
          responseType: 'arraybuffer',
        });
        const resizedBuffer = await resizeImage(Buffer.from(faviconResponse.data, 'binary'));
        return `data:image/png;base64,${toBase64(resizedBuffer)}`;
      }
    } catch (error) {
      return null;
    }
  }
  return null;
}

async function getFaviconAltAsBase64(url: string): Promise<string | null> {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    let faviconUrl = $('link[rel="icon"]').attr('href') || $('meta[property="og:image"]').attr('content');

    // If the favicon URL is not absolute, make it absolute
    if (faviconUrl && !faviconUrl.startsWith('http')) {
      faviconUrl = new URL(faviconUrl, url).href;
    }

    if (faviconUrl) {
      const faviconResponse = await axios.get(faviconUrl, {
        responseType: 'arraybuffer',
      });
      const resizedBuffer = await resizeImage(Buffer.from(faviconResponse.data, 'binary'));
      return `data:image/png;base64,${toBase64(resizedBuffer)}`;
    }
  } catch (error) {
    console.error(error);
  }
  return null;
}

async function getFaviconTryAllAsBase64(url: string): Promise<string | null> {
  const favicon = await getFaviconAsBase64(url);
  if (favicon) {
    return favicon;
  }
  return getFaviconAltAsBase64(url);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;

  // urlがundefinedまたは空文字列でないことを確認
  if (!url || typeof url !== 'string') {
    res.status(400).json({ error: 'Invalid URL' });
    return;
  }
  
  const favicon = await getFaviconTryAllAsBase64(url);
  if (favicon) {
    res.status(200).json({ favicon });
  } else {
    res.status(500).json({ error: 'Could not fetch favicon' });
  }
}