// pages/api/getUserNameViaUserID.ts

import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/utils/db';
import User from '@/utils/models/DataUser';
import { getSession } from 'next-auth/react';
import jwt from 'jsonwebtoken';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { userID } = req.query;

  if (!userID) {
    return res.status(400).json({ error: 'UserID is required' });
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token is required' });
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    return res.status(500).json({ error: 'JWT_SECRET is not set in environment variables' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const user = await User.findById(userID).select('userName');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ userName: user.userName });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
