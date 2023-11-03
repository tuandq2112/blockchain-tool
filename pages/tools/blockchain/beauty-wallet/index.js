import { CloudDownloadOutlined } from "@ant-design/icons";
import { Button, Col, Descriptions, Input, Row, Spin, Switch } from "antd";
import useObjectState from "hooks/useObjectState";
import downloadFile from "js-file-download";
import { BeautyWalletWrapper } from "styles/styled";
import { loopCreateBeautyWallet } from "utils";
function BeautyWallet() {
  const [state, setState] = useObjectState({
    value: "",
    checked: false,
    loading: false,
    num: 0,
  });
  const { value, checked, loading, data } = state;

  const updateNumberWallet = (num) => {
    setState({ num });
  };
  const handleCreateBeautyWallet = () => {
    setState({ loading: true });
    setTimeout(() => {
      loopCreateBeautyWallet(value, checked, updateNumberWallet)
        .then((res) => {
          let mnemonic = res.wallet._mnemonic();
          setState({
            data: res,
            phrase: mnemonic.phrase,
          });
        })
        .catch((err) => {
        })
        .finally(() => {
          setState({ loading: false });
        });
    }, 1000);
  };

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

            <Descriptions.Item label="Number Wallet created">
              {state.num}
            </Descriptions.Item>
          </Descriptions>
        </Col>
        <Col md={24}>
          {" "}
          <Descriptions title="Data">
            <Descriptions.Item label="Address">
              {data?.wallet?.address}
            </Descriptions.Item>
            <Descriptions.Item label="Download private key">
              <Button
                onClick={() => {
                  debugger;
                  downloadFile(state?.phrase, "privatekey.txt");
                }}
              >
                Download <CloudDownloadOutlined />
              </Button>
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </BeautyWalletWrapper>
  );
}
export async function getStaticProps() {
  return {
    props: {},
  };
}
export default BeautyWallet;
