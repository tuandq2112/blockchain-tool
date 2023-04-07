import { CaretRightOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import InputWithName from "components/base/InputWithName";
import { StyledCollapse } from "components/styled";
import useObjectState from "hooks/useObjectState";

function FunctionWrite({ renderData, index, smartContract }) {
  const [state, setState] = useObjectState({
    inputValues: {},
    loading: false,
  });

  const isPayableFunction = renderData.stateMutability == "payable";

  const onChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    let newObject = Object.assign({}, state.inputValues);
    newObject[name] = value;
    setState({ inputValues: newObject });
  };

  const handleQuery = async () => {
    setState({ loading: true });
    console.log(state.inputValues)

    try {
      let functionKey = renderData.name;
      let inputKeys = renderData.inputs.map((item) => item.name);
      let inputs = inputKeys.map((item) => state.inputValues[item]);
      console.log(isPayableFunction);
      if (isPayableFunction) {
        let values = { value: state.inputValues.value };

        response = await smartContract[functionKey](...inputs, values);
      } else {
        response = await smartContract[functionKey](...inputs);
      }
      let waitResponse = await response.wait();
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
              onChange={onChange}
            />
          );
        })}
        {isPayableFunction && (
          <InputWithName
            inputData={{ name: "value", type: "uint256" }}
            onChange={onChange}
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
