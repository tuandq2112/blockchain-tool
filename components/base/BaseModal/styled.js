import { Modal } from "antd";
import styled from "styled-components";

export const BaseModalWrapper = styled(Modal)`
  .ant-modal-content {
    background-color: white;
    // min-height: 400px;
    border-radius: 20px;
    .ant-modal-body {
      padding-bottom: 4px;
    }
    .ant-modal-header {
      background-color: white;
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
    }
    .ant-modal-close-x {
      width: 55px;
      height: 40px;
      line-height: 40px;
      .ant-modal-close-icon {
        svg {
          color: white;
          width: 10px;
          height: 10px;
          stroke-width: 100px;
        }
      }
    }

    .ant-modal-footer {
      display: flex;
      justify-content: end;
      /* .delete__btn {
        border-radius: 20px;
      }
      .submit__btn {
        width: auto;
      } */
    }
  }
`;
