// src/app/register/complete/page.tsx
'use client';

import React, { useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const RegistrationComplete: React.FC = () => {

  useEffect(() => {
    setTimeout(() => {
      window.location.href = '/SignIn';
    }, 3000);
  }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-900" style={{transform: 'translateY(-10vh)'}}>
        <div className="w-full max-w-lg ml-5 mr-5 mt-2 pl-2 pr-2 text-center">
          <FaCheckCircle className="text-6xl mb-4 text-green-500 animate-bounce" />
          <h1 className="text-4xl font-bold mb-2">登録完了！</h1>
          <p className="text-lg">3秒後にサインインページへ飛びます</p>
        </div>
      </div>
      <style jsx>{`
        @keyframes confetti {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .confetti {
          animation: confetti 2s linear infinite;
        }
      `}</style>
    </>
  );
};

export default RegistrationComplete;
