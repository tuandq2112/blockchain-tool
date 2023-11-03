import { CaretRightOutlined, CopyOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import InputWithName from "components/base/InputWithName";
import { StyledCollapse } from "components/styled";
import useObjectState from "hooks/useObjectState";
import { isEmpty } from "lodash";
import { convertOutput, copyToClipBoard } from "utils";
function FunctionView({ renderData, index, smartContract }) {
  const [state, setState] = useObjectState({
    inputValues: [],
    outputValues: [],
  });

  let isShowQuery = renderData.inputs.length > 0;
  const onChange = (inputKey) => (event) => {
    let value = event.target.value;
    let newInputs = Object.assign([], state.inputValues);
    newInputs[inputKey] = value;
    setState({ inputValues: newInputs });
  };
  const handleOpenFunctionBlank = async () => {
    try {
      if (isEmpty(renderData.inputs)) {
        let functionKey = renderData.name;
        let values = await smartContract.read[functionKey]();
        setState({
          outputValues: convertOutput(renderData.outputs, values),
        });
      }
    } catch (error) {
      message.error(error.reason || error.message);
    }
  };

  const handleQuery = async () => {
    try {
      let functionKey = renderData.name;
      let inputs = state.inputValues
        .filter((item) => !!item)
        .map((item, index) => {
          if (renderData.inputs[index].type.includes("[]")) {
            return JSON.parse(item);
          } else {
            return item;
          }
        });
      let values = await smartContract.read[functionKey](inputs);
      setState({ outputValues: convertOutput(renderData.outputs, values) });
    } catch (error) {
      message.error(error.reason || error.message);
    }
  };

  const saveJson = (data) => () => {
    copyToClipBoard(JSON.stringify(data));
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
              onChange={onChange(inputKey)}
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
          return (
            <p key={index}>
              <p>
                {" "}
                <span>Click for copy response: </span>
                <span>
                  {" "}
                  <CopyOutlined
                    onClick={saveJson(state.outputValues[index])}
                  />{" "}
                </span>
              </p>
              <p>
                {" "}
                {typeof state.outputValues[index] == "object" ? (
                  <div>
                    <pre>{JSON.stringify(state.outputValues[index])}</pre>
                  </div>
                ) : (
                  <span>
                    {typeof state.outputValues[index] === "string"
                      ? state.outputValues[index]
                      : state.outputValues[index]?.toString()}
                  </span>
                )}
                <span>: </span>
                <span>{outputData.type}</span>
              </p>
            </p>
          );
        })}
      </StyledCollapse.Panel>
    </StyledCollapse>
  );
}

export default FunctionView;
