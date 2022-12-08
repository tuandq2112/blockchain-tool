import { Layout } from "antd";
import styled from "styled-components";
const FOOTER_HEIGHT = "80px";

export const FooterWrapper = styled.div`
  height: ${FOOTER_HEIGHT};
  position: fixed;
  bottom: 0;
  width: 100%;
  background: ${(props) => props.footerBackground};
`;
