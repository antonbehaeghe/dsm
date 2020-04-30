import Head from "next/head";
import AdminPanel from "../components/AdminPanel";
import LoginForm from "../components/LoginForm";

import UserProvider, { useUser } from "../context/userContext";

export default function Admin() {
  return (
    <UserProvider>
      <AdminPage />
    </UserProvider>
  );
}

function AdminPage() {
  const { loadingUser, user } = useUser();

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex justify-center items-center h-screen">
        {!user && !loadingUser && <LoginForm />}
        {user && <AdminPanel />}
      </main>
    </div>
  );
}
