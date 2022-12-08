import CustomLayout from "Layout";
import React from "react";

export default function App({ Component, pageProps }) {
  return (
    <CustomLayout {...pageProps}>
      <Component />
    </CustomLayout>
  );
}
