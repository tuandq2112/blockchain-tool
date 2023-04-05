import { Input } from "antd";

function InputWithName({ inputData, onChange }) {
  const nameType = `${inputData.name} (${inputData.type})`;
  return (
    <div>
      <p>{nameType}</p>
      <Input
        placeholder={nameType}
        onChange={onChange}
        name={inputData.name}
      ></Input>
    </div>
  );
}

export default InputWithName;
