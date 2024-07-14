// src/pages/login.tsx
'use client';

import React from 'react';
import Register from '../../components/Register';

const SignInPage: React.FC = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-transparent" style={{transform: 'translateY(-20vh)'}}>
        <div className="w-full max-w-lg ml-5 mr-5 mt-2 pl-2 pr-2">
          <div className="p-4 pt-4 pb-4 flex items-center py-2 shadow-neumorphism rounded-md bg-gray-200">
            <Register />
          </div>
        </div>
      </div>
    </>
  );
};

export default SignInPage;
