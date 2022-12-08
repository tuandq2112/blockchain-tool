import { Breadcrumb } from "antd";
import { useRouter } from "next/router";
import { ContentWrapper } from "./styled";

function Content({ children }) {
  const router = useRouter()
  console.log(router);
  return (
    <ContentWrapper>
      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="">Application Center</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="">Application List</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>An Application</Breadcrumb.Item>
      </Breadcrumb>
      {children}
    </ContentWrapper>
  );
}

export default Content;
