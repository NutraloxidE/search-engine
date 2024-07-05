//getFaviconLib.ts

import axios from 'axios';
import cheerio from 'cheerio';
import * as Jimp from 'jimp';

export async function resizeImage(buffer: Buffer): Promise<Buffer> {
  const image = await Jimp.read(buffer);
  image.resize(32, 32);
  return await image.getBufferAsync(Jimp.MIME_PNG);
}

// BufferからBase64に変換する関数
export function toBase64(buffer: Buffer): string {
  return buffer.toString('base64');
}

// faviconを取得し、Base64形式に変換する関数
export async function getFaviconAsBase64(url: string): Promise<string | null> {
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

export async function getFaviconAltAsBase64(url: string): Promise<string | null> {
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

export async function getFaviconTryAllAsBase64(url: string): Promise<string | null> {
  const favicon = await getFaviconAsBase64(url);
  if (favicon) {
    return favicon;
  }
  return getFaviconAltAsBase64(url);
}