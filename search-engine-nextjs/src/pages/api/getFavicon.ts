import axios from 'axios';
import cheerio from 'cheerio';
import type { NextApiRequest, NextApiResponse } from 'next';
import Jimp from 'jimp';
import { resizeImage, toBase64, getFaviconAsBase64, getFaviconAltAsBase64, getFaviconTryAllAsBase64 } from '../../utils/getFaviconLib';

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