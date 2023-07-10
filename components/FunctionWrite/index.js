import { CaretRightOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import InputWithName from "components/base/InputWithName";
import { StyledCollapse } from "components/styled";
import useObjectState from "hooks/useObjectState";
import { waitForTransaction } from "wagmi/actions";

function FunctionWrite({ renderData, index, smartContract }) {
  const [state, setState] = useObjectState({
    inputValues: [],
    loading: false,
    value: 0,
  });

  const isPayableFunction = renderData.stateMutability == "payable";

  const onChange = (inputKey) => (event) => {
    let value = event.target.value;
    let newInputs = Object.assign([], state.inputValues);
    newInputs[inputKey] = value;
    setState({ inputValues: newInputs });
  };

  const setValue = (e) => {
    setState({ value: e.target.value });
  };
  const handleQuery = async () => {
    setState({ loading: true });
    let response;
    try {
      let functionKey = renderData.name;
      let inputs = state.inputValues.filter((item) => !!item);
      const args = inputs.map((item, i) => {
        if (renderData.inputs[i].type.includes("[]")) {
          return JSON.parse(item);
        } else {
          return item;
        }
      });
      if (isPayableFunction) {
        let values = { value: state.value };
        response = await smartContract.write[functionKey](args, values);
      } else {
        response = await smartContract.write[functionKey](args);
      }
      let waitResponse = await waitForTransaction({ hash: response });
      message.success(`Write function ${functionKey} successfully!`);
    } catch (error) {
      message.error(error.reason || error.message);
    } finally {
      setState({ loading: false });
    }
  };
  return (
    <StyledCollapse
      bordered={false}
      expandIcon={({ isActive }) => (
        <CaretRightOutlined rotate={isActive ? 90 : 0} />
      )}
    >
      <StyledCollapse.Panel header={`${index + 1}. ${renderData.name}`}>
        {renderData.inputs.map((inputData, inputKey) => {
          return (
            <InputWithName
              key={inputKey}
              inputData={inputData}
              onChange={onChange(inputKey)}
            />
          );
        })}
        {isPayableFunction && (
          <InputWithName
            inputData={{ name: "value", type: "uint256" }}
            onChange={setValue}
          />
        )}
        <br />
        <Button
          onClick={handleQuery}
          loading={state.loading}
          disabled={state.loading}
          danger={isPayableFunction}
        >
          Query
        </Button>
      </StyledCollapse.Panel>
    </StyledCollapse>
  );
}

export default FunctionWrite;
