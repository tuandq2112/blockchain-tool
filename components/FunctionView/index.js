import { CaretRightOutlined, CopyOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import InputWithName from "components/base/InputWithName";
import { StyledCollapse } from "components/styled";
import useObjectState from "hooks/useObjectState";
import { isEmpty } from "lodash";
import { convertOutput, copyToClipBoard } from "utils";
function FunctionView({ renderData, index, smartContract }) {
  const [state, setState] = useObjectState({
    inputValues: {},
    outputValues: [],
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
          let values = await smartContract[functionKey]();
          setState({
            outputValues: convertOutput(renderData.outputs, values),
          });
        }
      } catch (error) {
        message.error(error.reason || error.message);
      }
    }
  };
  const handleQuery = async () => {
    try {
      let functionKey = renderData.name;
      let inputKeys = renderData.inputs.map((item) => item.name);
      let inputs = inputKeys.map((item) => state.inputValues[item]);
      let values = await smartContract[functionKey](...inputs);

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
                  <span>{state.outputValues[index]}</span>
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
