import { Menu } from "antd";
import styled from "styled-components";
const HEADER_HEIGHT = "80px";

export const HeaderWrapper = styled.div`
  position: fixed;
  width: 100% !important;
  height: ${HEADER_HEIGHT};
  /* background-color: #03045e !important; */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 20px;
  border-bottom: 1px solid #58595a;
  /* * {
    background-color: #03045e !important;
  } */
`;

export const CustomMenu = styled(Menu)`
  width: 90%;
`;
