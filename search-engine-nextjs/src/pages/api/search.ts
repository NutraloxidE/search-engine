import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import connectDB from '../../utils/db';
import Data from '../../utils/Data';
import * as kuromoji from 'kuromoji';
const path = require('path');


export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    const { searchterm } = req.query;

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

    //TODOSeparatePerWordsから、"これ"や"は"などの指示語、助詞を削除します。
    // ストップワードリストを定義します。
    const stopWords = [
        "、", "。","これ", "それ", "あれ", "は",
        "が", "を", "に", "の", "で", "と", "から",
        "まで", "です", "ます", "た", "て", "たり", "だ",
        "でしょう", "でしょうか", "だろう", "だろうか", "である",
        "であろう", "であろうか", "であります", "でありましょう",
        "でありますか", "でありません", "でありませんか",
        "でありませんでしょう", "でありませんでしょうか", "でありませんでした",
        "でありませんでしたか", "でありませんでしたでしょう", "でありませんでしたでしょうか",
        "でありませんでしょう",
        "そして", "しかし", "また", "さらに", "なぜなら", "例えば",
        "これら", "それら", "あちら", "こっち", "そっち", "あっち",
        "この", "その", "あの", "なぜ", "どうして", "何", "誰", "どこ",
        "どの", "どれ", "どっち", "どう", "そんな", "あんな", "こんな",
        "うち", "なか", "とき", "もの", "こと",
    ];

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

    // Search the database for the search term
    const orResults = await Data.find(orQuery);
    const separatedResults = await Data.find(SeparatedPerWordsQuery);

    // Combine the results
    const results = [...orResults, ...separatedResults];
    results.sort((a, b) => {
        const aScore = Number(orResults.includes(a)) + Number(separatedResults.includes(a));
        const bScore = Number(orResults.includes(b)) + Number(separatedResults.includes(b));
        return bScore - aScore;
    });

    // Return the results
    res.status(200).json(results);
}