import styled, { createGlobalStyle, css } from "styled-components";

const baseWrapperCss = css`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 10px;
  height: 100%;
`;

export const GlobalStyled = createGlobalStyle`
 .w-200 {
    width: 200px;
  }

 .space-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
 }
  
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
      color: white;
    }
    &.ant-btn-dangerous{
      color: white;
      background: #b22b2b !important;
      box-shadow: 0px 5px 0px #d7231a;

    }
    
  }`;
export const HomeWrapper = styled.div`
  padding: 5%;
  .title {
    display: flex;
    justify-content: center;
  }
`;
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
  padding: 20px;
`;
export const NotFoundPageWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;
export const ProfileWrapper = styled.div`
  /* display: "flex" !important; */
  /* justify-content: center; */
  .content {
    margin: auto;
    max-width: 700px;
  }
`;
export const BalanceHistoryWrapper = styled.div`
  /* ${baseWrapperCss} */
`;