import { CaretRightOutlined } from "@ant-design/icons";
import { Button, Collapse, message } from "antd";
import { ethers } from "ethers";
import useObjectState from "hooks/useObjectState";
import { isArray, isEmpty } from "lodash";
import { HomeContext } from "pages";
import { useContext } from "react";
import InputWithName from "./InputWithName";

function ListViewFunction({ listFunction = [] }) {
  const [state, setState] = useObjectState();
  const smartContract = useContext(HomeContext);
  const onChange = (parentKey, key) => (e) => {
    let value = e.target.value;
    let newObject = Object.assign({}, state[parentKey]);
    newObject[key] = value;
    setState({ [parentKey]: newObject });
  };
  const handleSubmit = (functionData) => async () => {
    try {
      let functionKey = functionData.name;
      let functionValues = state[functionKey];
      let input = Object.keys(functionValues)
        .filter((item) => !isNaN(item))
        .map((item) => functionValues[item]);
      let outputs = await smartContract[functionKey](...input);
      if (functionData.outputs.length == 1) {
        if (
          functionData.outputs[0].type.startsWith("uint") ||
          functionData.outputs[0].type.startsWith("int")
        ) {
          console.log(outputs);
          outputs = ethers.utils.formatUnits(outputs, 0);
        }
      } else {
        for (let index = 0; index < functionData.outputs.length; index++) {
          const element = functionData.outputs[index];

          if (element.startsWith("uint") || element.type.startsWith("int")) {
            functionData.outputs[index] = ethers.utils.formatUnits(
              outputs[index],
              0
            );
          }
        }
      }
      let newObject = Object.assign({}, state[functionKey]);
      newObject.outputs = outputs;
      setState({ [functionKey]: newObject });
    } catch (error) {
      message.error(JSON.stringify(error));
    }
  };

  const handleOpenFunctionBlank = (functionData) => async () => {
    try {
      if (isEmpty(functionData.inputs)) {
        let functionKey = functionData.name;
        let outputs = await smartContract[functionKey]();

        if (functionData.outputs.length == 1) {
          if (
            functionData.outputs[0].type.startsWith("uint") ||
            functionData.outputs[0].type.startsWith("int")
          ) {
            outputs = ethers.utils.formatUnits(outputs, 0);
          }
        } else {
          for (let index = 0; index < functionData.outputs.length; index++) {
            const element = functionData.outputs[index];

            if (element.startsWith("uint") || element.type.startsWith("int")) {
              functionData.outputs[index] = ethers.utils.formatUnits(
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
  };
  return (
    <div>
      {listFunction.map((functionData, index) => {
        let showQuery = functionData.inputs.length > 0;
        return (
          <Collapse
            bordered={false}
            expandIcon={({ isActive }) => (
              <CaretRightOutlined rotate={isActive ? 90 : 0} />
            )}
            style={{ marginBottom: 20 }}
          >
            <Collapse.Panel
              onClick={handleOpenFunctionBlank(functionData)}
              header={`${index + 1}. ${functionData.name}`}
              key={index}
            >
              {functionData.inputs.map((inputData, inputKey) => {
                return (
                  <InputWithName
                    key={inputKey}
                    inputData={inputData}
                    onChange={onChange(functionData.name, inputKey)}
                  />
                );
              })}
              <br />
              {showQuery && (
                <>
                  {" "}
                  <Button onClick={handleSubmit(functionData)}>Query</Button>
                  <br />
                  <br />
                </>
              )}

              {functionData.outputs.map((outputData, outputKey) => {
                return (
                  <p key={outputKey}>
                    <span>
                      {isArray(state?.[functionData.name]?.outputs)
                        ? state?.[functionData.name]?.outputs?.[outputKey]
                        : state?.[functionData.name]?.outputs}
                    </span>
                    <span>: </span>
                    <span>{outputData.type}</span>
                  </p>
                );
              })}
            </Collapse.Panel>
          </Collapse>
        );
      })}
    </div>
  );
}

export default ListViewFunction;
