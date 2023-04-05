import { CaretRightOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import InputWithName from "components/base/InputWithName";
import { StyledCollapse } from "components/styled";
import { ethers } from "ethers";
import useObjectState from "hooks/useObjectState";
import { isEmpty } from "lodash";

function FunctionView({ renderData, index, smartContract }) {
  const [state, setState] = useObjectState({
    inputValues: {},
    outputValues: {},
  });

  let isShowQuery = renderData.inputs.length > 0;
  const onChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    let newObject = Object.assign({}, state.inputValues);
    newObject[name] = value;
    setState({ inputValues: newObject });
  };
  const handleOpenFunctionBlank = async (values) => {
    if (!isEmpty(values)) {
      try {
        if (isEmpty(renderData.inputs)) {
          let functionKey = renderData.name;
          let outputs = await smartContract[functionKey]();

          if (renderData.outputs.length == 1) {
            if (
              renderData.outputs[0].type.startsWith("uint") ||
              renderData.outputs[0].type.startsWith("int")
            ) {
              outputs = ethers.utils.formatUnits(outputs, 0);
            }
          } else {
            for (let index = 0; index < renderData.outputs.length; index++) {
              const element = renderData.outputs[index];

              if (
                element.startsWith("uint") ||
                element.type.startsWith("int")
              ) {
                renderData.outputs[index] = ethers.utils.formatUnits(
                  outputs[index],
                  0
                );
              }
            }
          }
          let newObject = Object.assign({}, state[functionKey]);
          newObject.outputs = outputs;
          setState({ [functionKey]: newObject });
        }
      } catch (error) {
        message.error(JSON.stringify(error));
      }
    }
  };
  const handleQuery = async () => {
    try {
      let functionKey = renderData.name;
      let inputKeys = renderData.inputs.map((item) => item.name);
      let inputs = inputKeys.map((item) => state.inputValues[item]);
      let outputs = await smartContract[functionKey](...inputs);
      if (renderData.outputs.length == 1) {
        if (
          renderData.outputs[0].type.startsWith("uint") ||
          renderData.outputs[0].type.startsWith("int")
        ) {
          outputs = [ethers.utils.formatUnits(outputs, 0)];
        }
      } else {
        for (let index = 0; index < renderData.outputs.length; index++) {
          const element = renderData.outputs[index];

          if (element.startsWith("uint") || element.type.startsWith("int")) {
            renderData.outputs[index] = ethers.utils.formatUnits(
              outputs[index],
              0
            );
          }
        }
      }
      setState({ outputValues: outputs });
    } catch (error) {
      message.error(JSON.stringify(error));
    }
  };
  return (
    <StyledCollapse
      bordered={false}
      expandIcon={({ isActive }) => (
        <CaretRightOutlined rotate={isActive ? 90 : 0} />
      )}
      onChange={handleOpenFunctionBlank}
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
        <br />
        {isShowQuery && (
          <>
            <Button onClick={handleQuery}>Query</Button>
            <br />
            <br />
          </>
        )}

        {renderData.outputs?.map((outputData, index) => {
          console.log(outputData);
          return (
            <p key={index}>
              <span>{state.outputValues[index]}</span>
              <span>: </span>
              <span>{outputData.type}</span>
            </p>
          );
        })}
      </StyledCollapse.Panel>
    </StyledCollapse>
  );
}

export default FunctionView;
