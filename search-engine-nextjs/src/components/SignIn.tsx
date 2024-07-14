// src/components/SignIn.tsx
import React from 'react';
import Link from 'next/link';
import LoginBtn from './login-btn';
import { useSession, signIn, signOut } from "next-auth/react"

const SignIn: React.FC = () => {

  const { data: session } = useSession();
  
  //if user is already logged in
  if (session){

    return (<>
      
      <div className="mt-5 flex items-center justify-center">
        <h3 className="text-1xl font-semibold mb-4">
          <LoginBtn />
        </h3>
      </div>

    </>);

  } else {

    //if user is not logged in
    return (
      <div className="flex flex-col items-center justify-center w-full">
        <h2 className="text-2xl font-semibold mb-4">サインイン</h2>
        <form className="w-full max-w-sm">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="SignInId">
              Sign in ID
            </label>
            <input
              id="SignInId"
              type="text"
              className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none shadow-neumorphism-input rounded-md"
              placeholder="Sign in ID"
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
          <div className="flex-col items-center justify-between">
            <button
              type="submit"
              className="fuwafuwa mr-2 bg-pastel-blue hover:bg-pastel-blue-dark text-white font-bold py-2 px-4 rounded shadow-neumorphism-button"
            >
              サインイン
            </button>
  
            {/*link for register page*/}
            <Link href="/register">
              <button 
                className="fuwafuwa bg-pastel-blue hover:bg-pastel-blue-dark text-white font-bold py-2 px-4 rounded shadow-neumorphism-button"
              >
                新規登録ページへ
              </button>
            </Link>
          
          
          </div>
          <div className="flex-col items-center justify-between">
            
          </div>
  
          {/*Third party loging*/}
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
