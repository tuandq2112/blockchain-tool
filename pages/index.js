import { DeleteOutlined, InboxOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Input,
  Row,
  Select,
  Space,
  Tabs,
  Upload,
  message,
} from "antd";
import ListViewFunction from "components/ListViewFunction";
import ListWriteFunction from "components/ListWriteFunction";
import { HighLightText } from "components/styled";
import { ethers } from "ethers";
import useObjectState from "hooks/useObjectState";
import { isArray } from "lodash";
import { createContext, useEffect } from "react";
import { HomeWrapper } from "styles/styled";
import { getContractInstance } from "utils";
import { useAccount } from "wagmi";
const { Dragger } = Upload;
export const HomeContext = createContext();

export default function Home() {
  const [state, setState] = useObjectState({ abi: [] });
  const { connector, isConnected } = useAccount();
  useEffect(() => {
    readContract();
  }, []);
  const items = [
    {
      key: "1",
      label: `Read contract`,
      children: (
        <ListViewFunction
          listFunction={state.abi.filter(
            (item) =>
              item.type == "function" &&
              !["nonpayable", "payable"].includes(item.stateMutability)
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
            (item) =>
              item.type == "function" &&
              ["nonpayable", "payable"].includes(item.stateMutability)
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
          const isValidABI = isArray(parsedData) || isArray(parsedData.abi);
          const abi = isArray(parsedData)
            ? parsedData
            : isArray(parsedData.abi)
            ? parsedData.abi
            : [];
          setState({
            draftAbi: abi,
            isValidABI,
            fileName: info.file.name,
            draftAbiStr: JSON.stringify(abi),
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

  const handleChangeFileName = (e) => {
    let fileName = e.target.value;
    setState({ fileName });
  };

  const onChangeABI = (e) => {
    try {
      let data = e.target.value;
      let parsedData = JSON.parse(data);
      let isValidABI = isArray(parsedData);
      setState({
        draftAbi: isValidABI ? parsedData : [],
        isValidABI: isValidABI,
        draftAbiStr: JSON.stringify(isValidABI ? parsedData : []),
      });
    } catch (error) {
      setState({
        isValidABI: false,
      });
    }
  };
  const saveContract = () => {
    const body = {
      abi: state.draftAbi,
      address: state.smartContractAddress,
      fileName: state.fileName,
    };
    const contracts = localStorage.getItem("contracts");
    const parseContract = contracts ? JSON.parse(contracts) : [];
    parseContract.push(body);
    localStorage.setItem("contracts", JSON.stringify(parseContract));
    setState({ contracts: parseContract });
  };

  const onRemove = (event) => (index) => {
    const contracts = localStorage.getItem("contracts");
    const parseContract = contracts ? JSON.parse(contracts) : [];
    parseContract.splice(index, 1);
    localStorage.setItem("contracts", JSON.stringify(parseContract));
    setState({ contracts: parseContract });
  };
  const readContract = () => {
    const contracts = localStorage.getItem("contracts");
    setState({ contracts: JSON.parse(contracts) });
  };

  const onChange = (value, data) => {
    setState({
      draftAbi: data.abi,
      smartContractAddress: data.address,
      draftAbiStr: JSON.stringify(data.abi),
      isValidABI: true,
      fileName: data.fileName,
    });
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
            <Select
              className="w-200 "
              placeholder="Choose saved contract"
              options={state.contracts?.map((item, index) => ({
                label: (
                  <p key={index} className="space-between">
                    <span>{item.fileName}</span>
                    <span>
                      <DeleteOutlined onClick={onRemove(index)} />
                    </span>
                  </p>
                ),
                value: item.fileName,
                ...item,
              }))}
              onChange={onChange}
            />
          </Col>
          <Col span={12}>
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
          <Col span={12}>
            <Input.TextArea
              rows={10}
              onChange={onChangeABI}
              placeholder="Copy ABI to this"
              value={state.draftAbiStr}
            />
          </Col>

          <Col span={24}>
            <Input
              placeholder="Input address of contract"
              onChange={handleChangeSmartContractAddress}
              value={state.smartContractAddress}
            />
          </Col>

          <Col span={24}>
            <Input
              placeholder="Input name"
              onChange={handleChangeFileName}
              value={state.fileName}
            />
          </Col>
          <Col span={24}>
            <Space>
              <Button
                disabled={
                  !state.smartContractAddress ||
                  !isConnected ||
                  !state.isValidABI
                }
                onClick={setupSmartContract}
              >
                Init smart contract
              </Button>

              <Button
                disabled={!state.smartContractAddress || !state.isValidABI}
                onClick={saveContract}
              >
                Save
              </Button>
            </Space>

            <br />
            <br />
            <br />
            {/* {!state.isValidABI && <p style={{ color: "red" }}>INVALID ABI</p>} */}
          </Col>
          <Col span={24}>
            <Tabs items={items} />
          </Col>
          <Col></Col>
        </Row>
      </HomeWrapper>
    </HomeContext.Provider>
  );
}
