import { Input } from "antd";

function InputWithName({ inputData, onChange }) {
  const nameType = `${inputData.name} (${inputData.type})`;
  return (
    <div>
      <p>{nameType}</p>
      <Input placeholder={nameType} onChange={onChange}></Input>
    </div>
  );
}

export default InputWithName;
