import type { NextApiRequest, NextApiResponse } from 'next';
const connectDB = require('../../utils/db');
import Data from '../../utils/Data';
import mongoose from 'mongoose';

const loadFaviconFromDB = async (req: NextApiRequest, res: NextApiResponse) => {
  // データベースに接続
  connectDB();

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Missing id parameter' });
  }

  try {
    // MongoDBのオブジェクトIDが有効かどうかをチェック
    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      return res.status(400).json({ error: 'Invalid id parameter' });
    }

    const data = await Data.findById(id).select('favicon');

    if (!data) {
      return res.status(404).json({ error: 'Data not found' });
    }

    res.status(200).json({ favicon: data.favicon });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default loadFaviconFromDB;
