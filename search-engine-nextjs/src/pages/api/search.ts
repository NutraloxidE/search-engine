import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from '../../utils/db';
import Data from '../../utils/Data';

const data = [
    { id: 1, name: "ゲキヤバ！簡単に作れるゲキヤバEDM" },
    { id: 2, name: "ゲキカワうんちブリブリサイト｜ゲキカワの極意" },
    { id: 3, name: "げきうんちうんちうんちうんちうんち" },
    { id: 4, name: "ゲキヤバ破壊" },
    { id: 5, name: "はい" },
];

export default function handler (req: NextApiRequest, res: NextApiResponse) {
    const { searchterm } = req.query;

    console.log("Search term:", req.query.searchterm);

    // Filter the data based on the search term
    const results = data.filter(item => item.name.includes(searchterm as string));

    // Return the results
    res.status(200).json(results);
}