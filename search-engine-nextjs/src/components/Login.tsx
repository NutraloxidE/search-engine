// src/components/Login.tsx
import React from 'react';

const Login: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <h2 className="text-2xl font-semibold mb-4">ログイン</h2>
      <form className="w-full max-w-sm">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="LoginId">
            Login ID
          </label>
          <input
            id="LoginId"
            type="text"
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none shadow-neumorphism-input rounded-md"
            placeholder="Login ID"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none shadow-neumorphism-input rounded-md"
            placeholder="Password"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-pastel-blue hover:bg-pastel-blue-dark text-white font-bold py-2 px-4 rounded shadow-neumorphism-button"
          >
            ログイン
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
