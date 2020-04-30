import styled from "styled-components";
import tw from "tailwind.macro";

import Head from "next/head";

const Title = styled.h1`
  ${tw`text-blue-500 text-lg`};
`;

export default function Home() {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex justify-center items-center h-screen text-2xl">
        Hello World!
      </main>
    </div>
  );
}
