import { Menu } from "antd";
import MenuConfig from "constants/menu";
import { CustomMenu, HeaderWrapper } from "./styled";

function Header() {
  return (
    <HeaderWrapper>
      <CustomMenu
        mode="horizontal"
        defaultSelectedKeys={["2"]}
        items={MenuConfig}
      />
    </HeaderWrapper>
  );
}

export default Header;
