import { Button, Col, Input, message, Row } from "antd";
import { HighLightText } from "components/styled";
import useObjectState from "hooks/useObjectState";
import { PrivateWrapper } from "styles/styled";
import { phraseToPrivateKey } from "utils";
function Private() {
  const [state, setState] = useObjectState({ checked: false });

  return (
    <PrivateWrapper>
      <HighLightText>Convert phrase to private key</HighLightText>
      <div className="switch">
        <Button
          onClick={() => {
            try {
              let func = phraseToPrivateKey;
              let afterText = func(state.beforeText);
              setState({ afterText });
              message.success("Convert success!");
            } catch (error) {
              setState({ beforeText: "" });
              message.error("Invalid mnemonic please try again!");
            }
          }}
        >
          Convert
        </Button>
      </div>
      <div className="content">
        <Row gutter={[24, 24]}>
          <Col span={12}>
            {" "}
            <Input.TextArea
              rows={10}
              value={state.beforeText}
              onChange={(event) => {
                setState({ beforeText: event.target.value });
              }}
            ></Input.TextArea>
          </Col>
          <Col span={12}>
            {" "}
            <Input.TextArea
              rows={10}
              value={state.afterText}
              disabled={true}
            ></Input.TextArea>
          </Col>
        </Row>
      </div>
    </PrivateWrapper>
  );
}

export async function getStaticProps() {
  return {
    props: {},
  };
}

export default Private;
