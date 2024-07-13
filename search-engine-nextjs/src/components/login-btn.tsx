//src/components/login-btn.tsx
import { useSession, signIn, signOut } from "next-auth/react"
import { FaCheck } from "react-icons/fa";

export default function LoginBtn() {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        {console.log(session)}
        <div className="flex items-center w-full">
          <FaCheck className="ml-8 mr-5" />
          <div>
            <p>Signed in as {session.user!.name} </p>
            <button
              className="text-cyan-500"
              onClick={() => signOut()}
            >
              Sign out
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <button
        className="text-cyan-500"
        onClick={() => signIn()}>外部アカウントでログイン
      </button>
    </>
  )
}