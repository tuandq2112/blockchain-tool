import pathToImage from "constants/pathToImage";
import Head from "next/head";
import { useRouter } from "next/router";

function DefaultHead() {
  const router = useRouter();
  return (
    <Head>
      <title>Welcome Naut's blogs</title>
      <link rel="shortcut icon" href="/head.png" />
      <meta charSet="UTF-8" />
      <meta name="description" content="Free some web3 tools!" />
      <meta name="keywords" content="web3, tools,..." />
      <meta name="author" content="tuandq" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:type" content="article" />
      <meta
        property="og:title"
        content={pathToImage[router.pathname]?.title || "Free web3 tool"}
      />
      <meta
        property="og:description"
        content={
          pathToImage[router.pathname]?.description || "Free some web3 tools!"
        }
      />
      <meta
        property="og:image"
        content={
          HOST + (pathToImage[router.pathname]?.image || "/beauty-wallet.jpg")
        }
      />
    </Head>
  );
}

export default DefaultHead;
