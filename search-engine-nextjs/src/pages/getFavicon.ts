import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;

  try {
    const response = await axios.get(`https://api.duckduckgo.com/?q=${url}&format=json`);
    const favicon = response.data.Icon.URL;

    if (favicon) {
      res.status(200).json({ favicon });
    } else {
      res.status(404).json({ error: 'Favicon not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to get favicon' });
  }
}