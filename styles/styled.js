import styled, { css } from "styled-components";

const baseWrapperCss = css`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 10px;
  height: 100%;
`;
export const HomeWrapper = styled.div``;
export const PrivateWrapper = styled.div`
  ${baseWrapperCss}
  .switch {
    margin-bottom: 100px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }
  .content {
    width: 100%;
  }
`;
export const BlockchainWrapper = styled.div``;

export const ToolsWrapper = styled.div``;

export const BeautyWalletWrapper = styled.div`
  ${baseWrapperCss}
`;
export const DeployWrapper = styled.div`
  ${baseWrapperCss}
`;
