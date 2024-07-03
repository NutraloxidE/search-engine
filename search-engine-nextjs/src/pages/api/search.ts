import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import connectDB from '../../utils/db';
import Data from '../../utils/Data';

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    const { searchterm } = req.query;

    await connectDB();

    console.log("Search term:", req.query.searchterm);

    // Search the database for the search term
    const results = await Data.find({
        $or: [
            { title: { $regex: new RegExp(searchterm as string, 'i') } },
            { about: { $regex: new RegExp(searchterm as string, 'i') } },
            { textSnippet: { $regex: new RegExp(searchterm as string, 'i') } }
        ]
    });

    // Return the results
    res.status(200).json(results);
}