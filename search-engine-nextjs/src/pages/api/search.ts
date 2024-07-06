import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import connectDB from '../../utils/db';
import Data from '../../utils/Data';
import * as kuromoji from 'kuromoji';
const path = require('path');
import { stopWords } from '../../utils/search-stopword';

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    const { searchterm, limit = 15, page = 1 } = req.query;
    const limitInt = parseInt(limit as string);
    const pageInt = parseInt(page as string);

    await connectDB();

    console.log("Search term:", req.query.searchterm);

    // Split the search term by space for OR search
    const orTerms = (searchterm as string).split(' ');
    console.log("OR terms:", orTerms); // Output OR terms

    //日本語の検索を分割
    let SeparatedPerWords: string[] = [];

    const dicPath = path.resolve(process.cwd(), 'node_modules/kuromoji/dict');
    const builder = kuromoji.builder({ dicPath: dicPath });

    await new Promise<void>((resolve, reject) => {
        builder.build((err:any, tokenizer:any) => {
            if (err) {
                reject(err);
                return;
            }
    
            // req.query.searchtermを単語に分割します。
            const path = tokenizer.tokenize(req.query.searchterm);
            SeparatedPerWords = path.map((token:any) => token.surface_form);
    
            console.log(SeparatedPerWords);
            resolve();
        });
    });

    // SeparatedPerWordsからストップワードを削除します。
    SeparatedPerWords = SeparatedPerWords.filter((word) => !stopWords.includes(word));

    console.log("After Filtered");
    console.log(SeparatedPerWords);    

    // Create the query for OR terms
    const orQuery = {
        $or: orTerms.map(term => ({
            $or: [
                { title: { $regex: new RegExp(term, 'i') } },
                { about: { $regex: new RegExp(term, 'i') } },
                { textSnippet: { $regex: new RegExp(term, 'i') } },
                { url: { $regex: new RegExp(term, 'i') } }
            ]
        }))
    };

    // Create the query for SeparatedPerWords
    const SeparatedPerWordsQuery = {
        $or: SeparatedPerWords.map(term => ({
            $or: [
                { title: { $regex: new RegExp(term, 'i') } },
                { about: { $regex: new RegExp(term, 'i') } },
                { textSnippet: { $regex: new RegExp(term, 'i') } },
                { url: { $regex: new RegExp(term, 'i') } }
            ]
        }))
    };

    const orResults = await Data.find(orQuery);
    const separatedResults = await Data.find(SeparatedPerWordsQuery);

    // Combine the results
    const combinedResults = [...orResults, ...separatedResults];

    // Remove duplicates
    const uniqueResults = combinedResults.reduce((acc: typeof combinedResults, current: typeof combinedResults[0]) => {
        const x = acc.find(item => item._id.toString() === current._id.toString());
        if (!x) {
            return acc.concat([current]);
        } else {
            return acc;
        }
    }, [] as typeof combinedResults);

    //sort the results by the number of matches
    uniqueResults.sort((a, b) => {
        const aScore = Number(orResults.includes(a)) * 2 + Number(separatedResults.includes(a));
        const bScore = Number(orResults.includes(b)) * 2 + Number(separatedResults.includes(b));
        return bScore - aScore;
    });

    // Pagination
    const totalResults = uniqueResults.length;
    const paginatedResults = uniqueResults.slice((pageInt - 1) * limitInt, pageInt * limitInt);

    // Return the results
    res.status(200).json({ totalResults, results: paginatedResults });
}
