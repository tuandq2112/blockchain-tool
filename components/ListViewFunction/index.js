import FunctionView from "components/FunctionView";

function ListViewFunction({ listFunction = [], smartContract }) {
  return (
    <div>
      {listFunction.map((data, index) => {
        return (
          <FunctionView
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

export default ListViewFunction;