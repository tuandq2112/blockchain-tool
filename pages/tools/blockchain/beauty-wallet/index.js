import { Button, Col, Descriptions, Input, Row, Spin, Switch } from "antd";
import useObjectState from "hooks/useObjectState";
import { BeautyWalletWrapper } from "styles/styled";
import { loopCreateBeautyWallet } from "utils";
function BeautyWallet() {
  const [state, setState] = useObjectState({
    value: "",
    checked: false,
    loading: false,
  });
  const { value, checked, loading, data } = state;

  const handleCreateBeautyWallet = () => {
    console.log("Before click!");
    setState({ loading: true });
    console.log("After click!");

    setTimeout(() => {
      loopCreateBeautyWallet(value, checked)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          console.log("finally");
          setState({ loading: false });
        });
    }, 1000);
    console.log("end function!");
  };
  console.log("loading", loading);
  return (
    <BeautyWalletWrapper>
      <Row gutter={[24, 24]}>
        <Col md={12}>
          <Input
            onChange={(event) => {
              setState({ value: event.target.value });
            }}
          />
          <Switch
            checked={checked}
            checkedChildren="Prefixes"
            unCheckedChildren="Suffixes"
            onChange={(checked) => {
              setState({ checked: checked });
            }}
          />
          <Button onClick={handleCreateBeautyWallet}>Confirm create</Button>
        </Col>
        <Col md={12}>
          {" "}
          <Descriptions title="Estimate">
            <Descriptions.Item label="Hard level">
              {Math.pow(16, value?.length)}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {loading && <Spin />}
            </Descriptions.Item>
          </Descriptions>
        </Col>
        <Col md={24}>
          {" "}
          <Descriptions title="Data">
            <Descriptions.Item label="Address">
              {data?.wallet?.address}
            </Descriptions.Item>
            <Descriptions.Item label="Private Key">
              {loading && <Spin />}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </BeautyWalletWrapper>
  );
}

export default BeautyWallet;
