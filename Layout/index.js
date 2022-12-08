import "antd/dist/reset.css";
import Head from "next/head";
import Content from "./Content";
import Footer from "./Footer";
import Header from "./Header";
import { RootWrapper } from "./styled";

export default function CustomLayout({ children }) {
  return (
    <RootWrapper>
      <Head>
        <title>Welcome Naut's blogs</title>
        <link rel="shortcut icon" href="/logohead.png" />
      </Head>
      <Header />
      <Content>{children} </Content>
      <Footer />
    </RootWrapper>
  );
}
