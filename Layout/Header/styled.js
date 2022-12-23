import { Layout, Menu } from "antd";
import styled from "styled-components";
const HEADER_HEIGHT = "80px";

export const HeaderWrapper = styled.div`
  position: fixed;
  width: 100%;
  height: ${HEADER_HEIGHT};
  background-color: #03045e !important;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 20px;

  /* * {
    background-color: #03045e !important;
  } */
`;

export const CustomMenu = styled(Menu)`
  background: #03045e;
  .ant-menu-title-content {
    color: white ;
  }
`;
