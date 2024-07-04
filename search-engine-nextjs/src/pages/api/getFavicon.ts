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
    //get the favicon.ico from the root of the domain
    const response = await axios.get(`${url}/favicon.ico`, {
      responseType: 'arraybuffer',
    });

    //send the response with the favicon url with json format
    res.status(200).json({
      url: `${url}/favicon.ico`,
      favicon: `data:image/png;base64,${Buffer.from(response.data, 'binary').toString('base64')}`,
    });

  } catch (error:any) {

    //send response with the error message with json format 
    res.status(500).json({ error: error.message });
    
  }

}