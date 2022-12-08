import { Descriptions } from "antd";
import { FooterWrapper } from "./styled";

function Footer() {
  return (
    <FooterWrapper>
      <Descriptions title="" column={4}>
        <Descriptions.Item label="UserName">Đỗ Quốc Tuấn</Descriptions.Item>
        <Descriptions.Item label="Telephone">0341231255</Descriptions.Item>
        <Descriptions.Item label="Live">Ha Noi, Viet Nam</Descriptions.Item>
        <Descriptions.Item label="Email">
          doquoctuan311@gmail.com
        </Descriptions.Item>
      </Descriptions>
    </FooterWrapper>
  );
}

export default Footer;
