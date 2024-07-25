// src/components/SignIn.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import LoginBtn from './login-btn';
import { useSession } from "next-auth/react";

const SignIn: React.FC = () => {
  const { data: session } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    
    try {
      const res = await fetch('/api/account/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Sign in failed');
      }

      window.location.href = '/'; // サインイン成功後のリダイレクト先
    } catch (err: any) {
      setError(err.message);
    }
  };

  // ユーザーが既にログインしている場合
  if (session) {
    return (
      <div className="mt-5 flex items-center justify-center">
        <h3 className="text-1xl font-semibold mb-4">
          <LoginBtn />
        </h3>
      </div>
    );
  } else {
    // ユーザーがログインしていない場合
    return (
      <div className="flex flex-col items-center justify-center w-full">
        <h2 className="text-2xl font-semibold mb-4">サインイン</h2>
        <form className="w-full max-w-sm" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="E-mail">
              E-mail
            </label>
            <input
              id="E-mail"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none shadow-neumorphism-input rounded-md"
              placeholder="E-mail"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none shadow-neumorphism-input rounded-md"
              placeholder="Password"
            />
          </div>
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          <div className="flex-col items-center justify-between">
            <button
              type="submit"
              className="fuwafuwa mr-2 bg-pastel-blue hover:bg-pastel-blue-dark text-white font-bold py-2 px-4 rounded shadow-neumorphism-button"
            >
              サインイン
            </button>
            {/* 新規登録ページへのリンク */}
            <Link href="/register">
              <button 
                className="fuwafuwa bg-pastel-blue hover:bg-pastel-blue-dark text-white font-bold py-2 px-4 rounded shadow-neumorphism-button"
              >
                新規登録ページへ
              </button>
            </Link>
          </div>
          <div className="flex-col items-center justify-between"></div>
          {/* サードパーティのログイン */}
          <div className="mt-3 ml-3 flex items-center justify-between">
            <div className="w-1/5 border-b border-gray-300"></div>
            <div className="text-xs text-center text-gray-500 w-1/5">or</div>
            <div className="w-1/5 border-b border-gray-300"></div>
          </div>
          <div className="mt-5 flex items-center justify-center">
            <h3 className="text-1xl font-semibold mb-4">
              <LoginBtn />
            </h3>
          </div>
        </form>
      </div>
    );
  }
};

export default SignIn;
