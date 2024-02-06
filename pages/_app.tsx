//Internal Imports
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useState, useEffect } from "react";
import Head from "next/head";

//External Imports
import { GoogleOAuthProvider } from "@react-oauth/google";

const App = ({ Component, pageProps }: AppProps) => {
  //State for SSR checking before rendering page.
  const [isSSR, setIsSSR] = useState(true);

  useEffect(() => {
    setIsSSR(false);
  }, []);

  if (isSSR) return null;

  return (
    <>
      <Head>
        <title>TIKTIK</title>
      </Head>
      <GoogleOAuthProvider
        clientId={`${process.env.NEXT_PUBLIC_GOOGLE_API_TOKEN}`}
      >
        <div className="xl:w-[70rem] m-auto overflow-scroll  h-[100vh]">
          <Navbar />

          <div className="flex gap-6 md:gap-20">
            <div className=" h-[95vh] overflow-y-scroll overflow-x-hidden">
              <Sidebar />
            </div>
            <div className=" mt-10 lg:mt-28 lg:ml-80 flex flex-col gap-10  scroll h-[100vh] videos ">
              <Component {...pageProps} />
            </div>
          </div>
        </div>
      </GoogleOAuthProvider>
    </>
  );
};

export default App;
