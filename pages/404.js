// 404.js
import errorImagePath from "assets/images/404.jpg";
import Image from "next/image";
import Link from "next/link";
import { NotFoundPageWrapper } from "styles/styled";
export default function FourOhFour() {
  return (
    <NotFoundPageWrapper>
      <Image
        src={errorImagePath}
        width={500}
        height={500}
        alt="Picture of the author"
      />
      <Link href={"/"}>Click back to home page</Link>
    </NotFoundPageWrapper>
  );
}
