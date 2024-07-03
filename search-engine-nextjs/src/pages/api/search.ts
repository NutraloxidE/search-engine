import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import connectDB from '../../utils/db';
import Data from '../../utils/Data';

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    const { searchterm } = req.query;

    await connectDB();

    console.log("Search term:", req.query.searchterm);

    // Split the search term by space for OR search
    const orTerms = (searchterm as string).split(' ');

    console.log("OR terms:", orTerms); // Output OR terms

    // Create the query
    const query = {
        $or: orTerms.map(term => ({
            $or: [
                { title: { $regex: new RegExp(term, 'i') } },
                { about: { $regex: new RegExp(term, 'i') } },
                { textSnippet: { $regex: new RegExp(term, 'i') } },
                { url: { $regex: new RegExp(term, 'i') } }
            ]
        }))
    };

    // Search the database for the search term
    const results = await Data.find(query);

    // Return the results
    res.status(200).json(results);
}