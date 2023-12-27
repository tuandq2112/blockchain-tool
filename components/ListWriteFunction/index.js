import { Button, Col, Descriptions, Input, Row } from "antd";
import FunctionWrite from "components/FunctionWrite";
import useObjectState from "hooks/useObjectState";
import { decodeFunctionData } from "viem";

function ListWriteFunction({ listFunction = [], smartContract }) {
  const [state, setState] = useObjectState({
    decodedData: {},
  });

  const inputDataEncoded = (event) => {
    setState({ dataEncoded :event.target.value});
  };

  const handleDecodeData = () => {
    debugger
    const dataDecoded = decodeFunctionData({
      abi: smartContract.abi,
      data: state.dataEncoded,
    });
    setState({ dataDecoded });
  };
  return (
    <div>
      <Row gutter={[24, 24]} style={{ marginBottom: "20px" }}>
        <Col span={8}>
          <Input.TextArea onChange={inputDataEncoded} placeholder="Input here" />

          <br />

          <Button onClick={handleDecodeData} type="ghost">
            Decode
          </Button>
        </Col>
        <Col span={8}>
          <Descriptions title="Decoded Data" bordered>
            <Descriptions.Item label="Function name" span={3}>
              {state.decodedData?.functionName}
            </Descriptions.Item>
            <Descriptions.Item label="Arguments" span={3}>
              {state.decodedData?.args?.map((item, index) => (
                <div>
                  <span>{index + 1}. </span>
                  <span>{JSON.stringify(item)} </span>
                </div>
              ))}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
      <div>
        {listFunction.map((data, index) => {
          return (
            <FunctionWrite
              key={index}
              renderData={data}
              index={index}
              smartContract={smartContract}
            />
          );
        })}
      </div>
    </div>
  );
}

export default ListWriteFunction;
