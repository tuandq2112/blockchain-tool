import { InboxOutlined } from "@ant-design/icons";
import { Button, Col, Input, message, Row, Tabs, Upload } from "antd";
import ListViewFunction from "components/ListViewFunction";
import ListWriteFunction from "components/ListWriteFunction";
import { HighLightText } from "components/styled";
import { ethers } from "ethers";
import useObjectState from "hooks/useObjectState";
import { isArray } from "lodash";
import { createContext } from "react";
import { HomeWrapper } from "styles/styled";
import { getContractInstance } from "utils";
import { useAccount } from "wagmi";

const { Dragger } = Upload;
export const HomeContext = createContext();

export default function Home() {
  const [state, setState] = useObjectState({ abi: [] });
  const { connector, isConnected } = useAccount();

  const items = [
    {
      key: "1",
      label: `Read contract`,
      children: (
        <ListViewFunction
          listFunction={state.abi.filter(
            (item) => item.type == "function" && item.stateMutability == "view"
          )}
          smartContract={state.smartContract}
        />
      ),
    },
    {
      key: "2",
      label: `Write contract`,
      children: (
        <ListWriteFunction
          listFunction={state.abi.filter(
            (item) => item.type == "function" && item.stateMutability != "view"
          )}
          smartContract={state.smartContract}
        />
      ),
    },
  ];

  const props = {
    name: "file",
    multiple: false,
    onChange(info) {
      if (info.file.status !== "uploading") {
        let reader = new FileReader();
        reader.onload = (e) => {
          const contents = e.target.result;
          const parsedData = JSON.parse(contents);
          setState({
            draftAbi: isArray(parsedData)
              ? parsedData
              : isArray(parsedData.abi)
              ? parsedData.abi
              : [],
          });
        };
        reader.readAsText(info.file.originFileObj);
        message.success(`${info.file.name} file uploaded successfully`);
      }
      // if (info.file.status === "done") {
      //   message.success(`${info.file.name} file uploaded successfully`);
      // } else if (info.file.status === "error") {
      //   message.error(`${info.file.name} file upload failed.`);
      // }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
    showUploadList: false,
    accept: "application/json",
  };
  const setupSmartContract = async () => {
    let smartContract = getContractInstance(
      state.smartContractAddress,
      state.draftAbi,
      await connector.getSigner()
    );
    setState({ smartContract, abi: state.draftAbi });
    message.success("Setup successful!");
  };

  const handleChangeSmartContractAddress = (e) => {
    let smartContractAddress = e.target.value;
    if (ethers.utils.isAddress(smartContractAddress)) {
      setState({ smartContractAddress });
    }
  };

  return (
    <HomeContext.Provider value={state.smartContract}>
      {" "}
      <HomeWrapper>
        <div className="title">
          {" "}
          <HighLightText>ABI Interaction</HighLightText>
        </div>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibited from
                uploading company data or other banned files.
              </p>
            </Dragger>
          </Col>
          <Col span={24}>
            <Input
              placeholder="Input address of contract"
              onChange={handleChangeSmartContractAddress}
              value={state.smartContractAddress}
            />
          </Col>
          <Col span={24}>
            <Button
              disabled={
                !state.draftAbi || !state.smartContractAddress || !isConnected
              }
              onClick={setupSmartContract}
            >
              Init smart contract
            </Button>
          </Col>
          <Col span={24}>
            <Tabs items={items} />
          </Col>
        </Row>
      </HomeWrapper>
    </HomeContext.Provider>
  );
}
