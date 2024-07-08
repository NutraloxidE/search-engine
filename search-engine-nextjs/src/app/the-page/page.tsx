// page.tsx THIS PAGE IS WIP
'use client';

import React, { useState } from 'react';
import axios from 'axios';
import ConnectDB from '../../utils/db';

export default function Page() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [data, setData] = useState(null);

  const handleLoginSubmit = async (event:any) => {
    event.preventDefault();

    // Verify the admin password
    const response = await axios.post('/api/verify-pw-admin', { username, password });

    if (response.data.success) {
      // Connect to the database
      await ConnectDB();

      // Fetch the data
      const dataResponse = await axios.get('/api/data');
      setData(dataResponse.data);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-transparent">
      <h1 className="text-4xl font-bold mb-10">GEKIYABA SEARCH</h1>

      {/* add simple login form here */}

      <form onSubmit={handleLoginSubmit}>
        <div className='flex-col'>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required
          className="mb-8 appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
          />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required
          className="mb-8 appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
          />
        </div>

        <button type="submit"
          className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded">
            Login
        </button>
      </form>

      {/* add 広告 / about GEKIYABA GEKIKAWA GANG / R1ce.farm といったようなリンク昔のgoogleみたいに追加*/}
      <div className="flex flex-row items-center justify-center mt-20">
        <a href="lmao" className="text-blue-500 text-sm hover:underline mr-8 ml-10">???</a>
        <a href="lol" className="text-blue-500 text-sm hover:underline mr-5 ml-12">About GEKIYABA GEKIKAWA GANG</a>
        <a href="https://r1ce.farm" rel="noopener noreferrer" target='blank' className="text-blue-500 text-sm hover:underline mr-8 ml-8">R1ce.farm</a>
      </div>

      <p className='text-gray-500 text-xs mt-5 ml-8 mr-8 mb-8'>©2024 - GGG</p>

      {/* Display the data */}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}