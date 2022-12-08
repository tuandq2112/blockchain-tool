import styled from "styled-components";
const ROOT_HEIGHT = "100vh";
const HEADER_HEIGHT = "80px";
const FOOTER_HEIGHT = "80px";
export const ContentWrapper = styled.div`
  padding-top: ${HEADER_HEIGHT};
  padding-bottom: ${FOOTER_HEIGHT};
  padding-left: 10px;
  padding-right: 10px;
  height: calc(${ROOT_HEIGHT});
`;
