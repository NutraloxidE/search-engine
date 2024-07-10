// /pages/api/log.ts

import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { ip, url } = req.body;

  //time with 6 digits of precision in JST
  const time = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
  const log = "["+time+"]"+ `IP: ${ip}, URL: ${url}\n`;
  
  const logFilePath = path.join(process.cwd(), 'logs', 'access.log');
  fs.appendFileSync(logFilePath, log);

  res.status(200).json({ message: 'Log recorded' });
}
