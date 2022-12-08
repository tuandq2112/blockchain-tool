import styled from "styled-components";
const FOOTER_HEIGHT = "80px";

export const FooterWrapper = styled.div`
  height: ${FOOTER_HEIGHT};
  position: fixed;
  bottom: 0;
  width: 100%;
  background: #caf0f8;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 20px 0 20px;
  * {
    color: #03045E !important;
  }
`;
