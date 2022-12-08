import { useState } from "react";

function useObjectState(defaultObject = {}) {
  const [state, _setState] = useState({ defaultObject });
  const setState = (data = {}) => {
    _setState((prevState) => ({ ...prevState, ...data }));
  };
  return [state, setState];
}

export default useObjectState;
