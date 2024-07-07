import bcrypt from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req : NextApiRequest, res : NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { password } = req.body;

  // 環境変数から保存された平文パスワードを取得
  const savedRawPW = process.env.PW_ADMIN_PAGE?.toString() || '';

  console.log('savedHash:', savedRawPW);
  console.log('receivedPW:', password);

  // 送信されたPWと保存されたPWを比較
  const isMatch = await savedRawPW === password;

  if (isMatch) {
    return res.status(200).json({ message: 'Password is correct' });
  } else {
    return res.status(401).json({ message: 'Password is incorrect' });
  }
}
