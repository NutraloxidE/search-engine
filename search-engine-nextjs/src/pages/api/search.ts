import type { NextApiRequest, NextApiResponse } from "next";

const data = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" },
    { id: 4, name: "David" },
    { id: 5, name: "Eve" },
];

export default function handler (req: NextApiRequest, res: NextApiResponse) {
    const { searchterm } = req.query;

    console.log("Search term:", req.query);

    // Filter the data based on the search term
    const results = data.filter(item => item.name.includes(searchterm as string));

    // Return the results
    res.status(200).json(results);
}