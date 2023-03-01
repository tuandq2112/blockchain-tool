import Head from "next/head";

function DefaultHead() {
  return (
    <Head>
      <title>Welcome Naut's blogs</title>
      <link rel="shortcut icon" href="/logohead.png" />
      <meta charset="UTF-8" />
      <meta name="description" content="Free some web3 tools!" />
      <meta name="keywords" content="web3, tools,..." />
      <meta name="author" content="tuandq" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* <meta property="og:url" content="https://nothing.com" /> */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content="Web3 website" />
      <meta property="og:description" content="Free some web3 tools!" />
      <meta
        property="og:image"
        content="https://d3lkc3n5th01x7.cloudfront.net/wp-content/uploads/2022/07/18031856/Web3-Vs-Web-3.0.png"
      />
    </Head>
  );
}

export default DefaultHead;
