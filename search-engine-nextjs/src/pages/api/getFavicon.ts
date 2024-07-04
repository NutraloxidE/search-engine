import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;

  // urlがundefinedまたは空文字列でないことを確認
  if (!url || typeof url !== 'string') {
    res.status(400).json({ error: 'Invalid URL' });
    return;
  }

  try {
    const response = await axios.get(`https://${url}/favicon.ico`);

    if (response.status === 200) {
      res.status(200).json({ favicon: `https://${url}/favicon.ico` });
    } else {
      res.status(404).json({ error: 'Favicon not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: `Failed to get favicon: ${error.message}` });
  }
}