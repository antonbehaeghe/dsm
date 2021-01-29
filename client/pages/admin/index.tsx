import Head from "next/head";
import AdminPanel from "../../components/AdminPanel";
import LoginForm from "../../components/LoginForm";
import AdminQuestions from "../../components/AdminQuestions";

import UserProvider, { useUser } from "../../context/userContext";

export default function Admin({ children }) {
  return (
    <UserProvider>
      <AdminPage>{children}</AdminPage>
    </UserProvider>
  );
}

function AdminPage({ children }) {
  const { loadingUser, user } = useUser();

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex justify-center items-center h-screen">
        {!user && !loadingUser && <LoginForm />}
        {user && (
          <AdminPanel>
            <AdminQuestions>{children}</AdminQuestions>
          </AdminPanel>
        )}
      </main>
    </div>
  );
}
