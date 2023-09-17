import React from "react";
import styles from "../styles/Home.module.css";
import Head from "next/head";

function Index() {
  return (
    <>
      <Head>
        <link rel="icon" href="/codLogo.jpg" />
        <title>Welcome To Cod Robot</title>
      </Head>
      <div>This is the home page of the web application</div>
    </>
  );
}

export default Index;
