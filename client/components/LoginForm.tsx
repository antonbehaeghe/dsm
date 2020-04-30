import { useState } from "react";
import firebase from "../firebase";

interface IState {
  email: string;
  password: string;
}

function LoginForm() {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  function handleInput(e: React.FormEvent<HTMLInputElement>) {
    setData({ ...data, [e.currentTarget.name]: e.currentTarget.value } as Pick<
      IState,
      keyof IState
    >);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (data.email && data.password) {
      firebase
        .auth()
        .signInWithEmailAndPassword(data.email, data.password)
        .catch(function (error) {
          console.log("sign in error");
        });
    }
  }

  return (
    <div className="w-full max-w-xs">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="email"
            id="email"
            type="email"
            value={data.email}
            onChange={handleInput}
            placeholder="user@example.com"
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            name="password"
            id="password"
            type="password"
            value={data.password}
            onChange={handleInput}
            placeholder="******************"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
