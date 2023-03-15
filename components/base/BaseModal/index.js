import { DeleteOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { BaseModalWrapper } from "./styled";

const BaseModal = (
  {
    title = "",
    cancelText = "Cancel",
    submitText = "Ok",
    renderForm = () => {},
    ignoreCancel = false,
    ignoreCancelButton = false,
    ignoreOkButton = false,
  },
  ref
) => {
  const callbackRef = useRef();
  const submitRef = useRef();
  const [state, _setState] = useState({});

  const setState = (data = {}) => {
    _setState((prevState) => ({ ...prevState, ...data }));
  };
  useImperativeHandle(ref, () => ({
    show: ({ callback = () => {}, submit = () => {} }) => {
      setState({ visible: true });
      if (callback) callbackRef.current = callback;
      if (submit) submitRef.current = submit;
    },
    hide: () => {
      setState({ visible: false });
    },
  }));
  const onCancel = () => {
    if (callbackRef.current) {
      callbackRef.current();
    }
    setState({ visible: false });
  };
  const onOk = async () => {
    await submitRef.current();
    if (!ignoreCancel) setState({ visible: false });
  };
  return (
    <BaseModalWrapper
      title={title || "Title"}
      open={state.visible}
      onCancel={onCancel}
      closable={true}
      footer={
        <div className="d-flex">
          {!ignoreCancelButton && (
            <Button className="delete__btn" onClick={onCancel}>
              <DeleteOutlined />
              {cancelText}
            </Button>
          )}
          {!ignoreOkButton && (
            <Button className="submit__btn" onClick={onOk}>
              {submitText}
            </Button>
          )}
        </div>
      }
    >
      {renderForm()}
    </BaseModalWrapper>
  );
};
export default forwardRef(BaseModal);
