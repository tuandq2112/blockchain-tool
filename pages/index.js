import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HomeWrapper } from "styles/styled";

export default function Home() {
  const { updateData } = useDispatch().auth;

  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    updateData({beoboe:"hello heo"});
  }, []);
  console.log(auth);
  return <HomeWrapper>Home </HomeWrapper>;
}
