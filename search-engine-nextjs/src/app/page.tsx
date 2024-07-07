// page.tsx
import React from 'react';
import SearchBar from '../components/SearchBar';

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-transparent" style={{transform: 'translateY(-10vh)'}}>
      <h1 className="text-4xl font-bold mb-10">GEKIYABA SEARCH</h1>
      
        <SearchBar/>

      {/* add 広告 / about GEKIYABA GEKIKAWA GANG / R1ce.farm といったようなリンク昔のgoogleみたいに追加*/}
      <div className="flex flex-row items-center justify-center mt-20">
        <a href="lmao" className="text-blue-500 text-sm hover:underline mr-8 ml-10">???</a>
        <a href="lol" className="text-blue-500 text-sm hover:underline mr-5 ml-12">About GEKIYABA GEKIKAWA GANG</a>
        <a href="https://r1ce.farm" rel="noopener noreferrer" target='blank' className="text-blue-500 text-sm hover:underline mr-8 ml-8">R1ce.farm</a>
      </div>

      <p className='text-gray-500 text-xs mt-5 ml-8 mr-8 mb-8'>©2024 - GGG</p>

    </div>
  );
}