import styled, { css } from "styled-components";

const baseWrapperCss = css`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 10px;
  height: 100%;

  .ant-btn {
    color: white;
    background: #0077b6 !important;
    box-shadow: 0px 5px 0px #023e8a;
    transition-duration: 0.2s;

    &:hover {
      color: white;
      filter: brightness(1.5);
    }
    &:active {
      transform: translateY(5px);
      box-shadow: none;
    }
    &:disabled {
      filter: brightness(0.5);
      box-shadow: none;
      transform: none;
      /* cursor: none; */
    }
  }
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
