import { Breadcrumb } from "antd";
import useObjectState from "hooks/useObjectState";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { capitalizeFirstLetter } from "utils";
import { ContentWrapper } from "./styled";

function Content({ children }) {
  const [state, setState] = useObjectState({ data: [] });
  const router = useRouter();
  const getBreadcrumbData = () => {
    let pathname = router.pathname;
    let arr = pathname.split("/");
    let data = arr.map((item, index) => {
      let name = capitalizeFirstLetter(item);
      let path = arr.slice(0, index + 1).join("/");
      return { name, path };
    });

    setState({ data });
  };
  useEffect(() => {
    if (router?.pathname) getBreadcrumbData();
  }, [router]);

  return (
    <ContentWrapper>
      <Breadcrumb>
        {state?.data?.slice(1)?.map((item, index) => {
          return <Breadcrumb.Item key={index}>{item.name}</Breadcrumb.Item>;
        })}
      </Breadcrumb>
      {children}
    </ContentWrapper>
  );
}

export default Content;
