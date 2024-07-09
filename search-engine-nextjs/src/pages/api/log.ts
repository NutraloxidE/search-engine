// /pages/api/log.ts

import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { ip, url } = req.body;

  const log = `IP: ${ip}, URL: ${url}\n`;
  
  const logFilePath = path.join(process.cwd(), 'logs', 'access.log');
  fs.appendFileSync(logFilePath, log);

  res.status(200).json({ message: 'Log recorded' });
}
