import styled from "styled-components";
const ROOT_HEIGHT = "100vh";
const HEADER_HEIGHT = "80px";
const FOOTER_HEIGHT = "0px";
export const ContentWrapper = styled.div`
  margin-top: ${HEADER_HEIGHT};
  margin-bottom: ${FOOTER_HEIGHT};
  padding-left: 10px;
  padding-right: 10px;
  height: calc(${ROOT_HEIGHT} - ${HEADER_HEIGHT} - ${FOOTER_HEIGHT});
  overflow-y: scroll;
  overflow-x: hidden;
`;
