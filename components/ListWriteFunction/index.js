import FunctionWrite from "components/FunctionWrite";

function ListWriteFunction({ listFunction = [], smartContract }) {
  return (
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
  );
}

export default ListWriteFunction;
