import React, { useEffect, useState } from 'react';

const MainPage: React.FC = () => {
  const [data, setData] = useState('');

  useEffect(() => {
    fetch(':3001/api/test')
      .then(response => response.text())
      .then(data => setData(data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h1>Hello, Worlddddddddddddddd!</h1>
      <p>{data}</p>
    </div>
  );
};

export default MainPage;