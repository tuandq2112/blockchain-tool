import { Button, Col, Descriptions, Input, Row } from "antd";
import FunctionWrite from "components/FunctionWrite";
import useObjectState from "hooks/useObjectState";
import { decodeFunctionData } from "viem";

function ListWriteFunction({ listFunction = [], smartContract }) {
  
  return (
    <div>
    
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
