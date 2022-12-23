import styled from "styled-components";
const FOOTER_HEIGHT = "80px";

export const FooterWrapper = styled.div`
  height: ${FOOTER_HEIGHT};
  position: fixed;
  bottom: 0;
  width: 100%;
  background: #023e8a;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 20px;
  * {
    color: white !important;
  }
  .ant-descriptions-item {
    padding: none;
  }
  .ant-descriptions-item-content {
    white-space: nowrap;
  }
`;
