// src/components/Register.tsx
import React,{ useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LoginBtn from './login-btn';
import { useSession, signIn, signOut } from "next-auth/react"

const Register: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [userName, setUserName] = useState('');
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  let [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    let isThereError = false;

    if (password !== confirmPassword) {
      setErrorMessage(errorMessage + '\nパスワードが一致しません。');
      isThereError = true;
    };
    
    if (password.length < 8) {
      setErrorMessage(errorMessage + '\nパスワードは8文字以上で入力してください。');
      isThereError = true;
    }

    if (userName.length < 1) {
      setErrorMessage(errorMessage + '\nユーザー名を入力してください。');
      isThereError = true;
    }

    if (email.length < 1) {
      setErrorMessage(errorMessage + '\nメールアドレスを入力してください。');
      isThereError = true;
    }

    //if there is no error, submit the form
    if (!isThereError) {
      setErrorMessage('');
      console.log({userName, email, password, confirmPassword});
      
      fetch('/api/account/registeruser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({userName, email, password}),
      })
      .then((response) => {
        if (response.ok) {
          console.log('Registration successful');
          router.push('/register/complete');
          return response.json();
        }else{
          setErrorMessage('ユーザー登録に失敗しました、メールアドレスが既に登録されているか、もしくはサーバーに問題が発生しています。');
          throw new Error('Registration failed');
        }
      })
      .catch((error) => {
        console.error('Registration error:', error);
      });
    }

  };

  return (
    <div className="mt-5 flex flex-col items-center justify-center w-full ">
      <h2 className="text-2xl font-semibold mb-4">新規登録</h2>
      <form className="w-full max-w-sm" onSubmit={handleSubmit}>


        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userName">
            ユーザー名
          </label>
          <input
            id="userName"
            type="text"
            onChange={(e) => setUserName(e.target.value)}
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none shadow-neumorphism-input rounded-md"
            placeholder="ユーザー名"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            メールアドレス
          </label>
          <input
            id="email"
            name="email"
            type="mail"
            onChange={(e) => setemail(e.target.value)}
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none shadow-neumorphism-input rounded-md"
            placeholder="メールアドレス"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            パスワード
          </label>
          <input
            id="password"
            name="password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none shadow-neumorphism-input rounded-md"
            placeholder="パスワード"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="passwordConfirm">
            パスワード (再確認)
          </label>
          <input
            id="passwordConfirm"
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none shadow-neumorphism-input rounded-md"
            placeholder="パスワード (再確認)"
          />
        </div>

        
        <div className="flex-col items-center justify-between">
          {errorMessage && <p className="mb-2 text-red-500">{errorMessage}</p>}
          <button
            type="submit"
            className="fuwafuwa mr-2 bg-pastel-blue hover:bg-pastel-blue-dark text-white font-bold py-2 px-4 rounded shadow-neumorphism-button"
          >
            登録
          </button>

          {/*link for login page*/}
          <Link href="/SignIn">
            <button 
              className="fuwafuwa bg-pastel-blue hover:bg-pastel-blue-dark text-white font-bold py-2 px-4 rounded shadow-neumorphism-button"
            >
              アカウントをお持ちの方
            </button>
          </Link>
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

};

export default Register;