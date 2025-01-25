// pages/index.js
import Head from 'next/head';
import Box from '../components/Box';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Next.js Box Example</title>
        <meta name="description" content="An example of a box in Next.js" />
      </Head>
      <main>
        <h1>Welcome to Next.js!</h1>
        <Box />
      </main>
    </div>
  );
}
