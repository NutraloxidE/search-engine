import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import connectDB from '../../utils/db';
import Data from '../../utils/Data';
import SearchHistory from '../../utils/DataSearchHistory';
import * as kuromoji from 'kuromoji';
const path = require('path');
import { stopWords } from '../../utils/search-stopword';
import NodeCache from 'node-cache';

const myCache = new NodeCache();

// Connect to MongoDB and ensure the indexes are created
async function ensureIndexes() {
    await connectDB();
    // Ensure indexes are created on the relevant fields
    await Data.collection.createIndex({ title: "text", about: "text", textSnippet: "text", url: "text" });
}

async function addSearchHistory(ip: string, searchTerm: string) {
    await connectDB();
    const searchHistory = new SearchHistory({ ip, searchTerm });
    await searchHistory.save();
    console.log("Search history added to the database");
}

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    const { searchterm, limit = 15, page = 1 } = req.query;
    const limitInt = parseInt(limit as string);
    const pageInt = parseInt(page as string);   

    console.log("Search term:", req.query.searchterm);

    // Add the search history to the database
    let ip = req.headers['x-real-ip'] as string;
    if (!ip) {
        ip = req.connection.remoteAddress as string;
    }
    addSearchHistory(ip, searchterm as string);

    // Check if the results are in the cache
    const cachedResults = myCache.get(searchterm as string) as any[];
    if (cachedResults) {
        console.log("Results are in the cache");
        const paginatedResults = cachedResults.slice((pageInt - 1) * limitInt, pageInt * limitInt);
        return res.status(200).json({ totalResults: cachedResults.length, results: paginatedResults });
    }

    await ensureIndexes();

    // If the results are not in the cache, continue with the search

    // Split the search term by space for OR search
    const orTerms = (searchterm as string).split(' ');
    console.log("OR terms:", orTerms); // Output OR terms

    //日本語の検索を分割
    let SeparatedPerWords: string[] = [];

    const dicPath = path.resolve(process.cwd(), 'node_modules/kuromoji/dict');
    const builder = kuromoji.builder({ dicPath: dicPath });

    await new Promise<void>((resolve, reject) => {
        builder.build((err: any, tokenizer: any) => {
            if (err) {
                reject(err);
                return;
            }
    
            // req.query.searchtermを単語に分割します。
            const path = tokenizer.tokenize(req.query.searchterm);
            SeparatedPerWords = path.map((token: any) => token.surface_form);
    
            console.log(SeparatedPerWords);
            resolve();
        });
    });

    // SeparatedPerWordsからストップワードを削除します。
    SeparatedPerWords = SeparatedPerWords.filter((word) => !stopWords.includes(word));

    console.log("After Filtered");
    console.log(SeparatedPerWords);    

    /**
     * From here, the search query is created.
     */

    // Create the query for OR terms
    const orQuery = {
        $or: orTerms.map(term => ({
            $or: [
                //{ title: { $regex: new RegExp(term, 'i') } },
                //{ about: { $regex: new RegExp(term, 'i') } },
                { textSnippet: { $regex: new RegExp(term, 'i') } },
                //{ url: { $regex: new RegExp(term, 'i') } }
            ]
        }))
    };

    // Create the query for SeparatedPerWords
    const SeparatedPerWordsQuery = {
        $or: SeparatedPerWords.map(term => ({
            $or: [
                { title: { $regex: new RegExp(term, 'i') } },
                //{ about: { $regex: new RegExp(term, 'i') } },
                //{ textSnippet: { $regex: new RegExp(term, 'i') } },
                //{ url: { $regex: new RegExp(term, 'i') } }
            ]
        }))
    };

    // 
    const orResults = await Data.find(orQuery, { title: 1, about: 1, textSnippet: 1, url: 1 });
    const separatedResults = await Data.find(SeparatedPerWordsQuery, { title: 1, about: 1, textSnippet: 1, url: 1 });

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
    // Cache the results with a TTL (Time to Live) of 1 hour (3600 seconds)
    myCache.set(searchterm as string, uniqueResults, 3600);
    const paginatedResults = uniqueResults.slice((pageInt - 1) * limitInt, pageInt * limitInt);
    res.status(200).json({ totalResults: uniqueResults.length, results: paginatedResults });
}
