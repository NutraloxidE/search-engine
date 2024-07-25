// src/pages/api/signin.ts
import connectDB from "@/utils/db";
import User from "@/utils/models/DataUser";
import Session from "@/utils/models/DataSession";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

export default async function signInHandling (req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  
  if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const sessionId = uuidv4();
      const expires = new Date();
      expires.setHours(expires.getHours() + 1); // セッションの有効期限を1時間後に設定

      const session = new Session({
        userId: user._id,
        sessionId,
        expires,
      });

      await session.save();

      console.log(`User ${email} signed in successfully with session ID: ${sessionId}`); // ログイン成功情報を表示


      res.setHeader('Set-Cookie', `sessionId=${sessionId}; HttpOnly; Path=/; Max-Age=3600`);
      return res.status(200).json({ message: 'Sign in successful' });

    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }

  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
