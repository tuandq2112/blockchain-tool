import { Button, Col, Form, Input, message, Row } from "antd";
import CustomUpload from "components/custom/Upload";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { ProfileWrapper } from "styles/styled";
import { useAccount } from "wagmi";
function Profile() {
  const { uploadSingleFile, getSingleFile } = useDispatch().file;
  const [form] = Form.useForm();
  const { getAddress } = useAccount();
  const [imageUrl, setImageUrl] = useState();
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const customRequest = async (options) => {
    const { onSuccess, onError, file, onProgress } = options;
    uploadSingleFile(file)
      .then((res) => {
        getSingleFile(res.filename).then((res2) => {
          setImageUrl(res2);
        });
      })
      .catch((err) => {});
  };

  const onFinish = () => {
    form.validateFields().then((res) => {
    });
  };
  return (
    <ProfileWrapper>
      <div className="content">
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={[24, 24]}>
            <Col md={12} sm={24}>
              <Form.Item label={<strong>Username</strong>} name="username">
                <Input />
              </Form.Item>
            </Col>
            <Col md={12} sm={24}>
              <strong>Profile image</strong>
              <br /> <CustomUpload />
            </Col>

            <Col md={12} sm={24}>
              <Form.Item
                label={<strong>Email</strong>}
                name="email"
                rules={[
                  {
                    type: "email",
                    message: "The input is not valid E-mail!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col md={12} sm={24}>
              <Form.Item label={<strong>Link</strong>} name="link">
                <Input />
              </Form.Item>
            </Col>
            <Col md={12} sm={24}>
              <Form.Item label={<strong>Bio</strong>} name="biography">
                <Input.TextArea />
              </Form.Item>
            </Col>
            <Col md={12} sm={24}>
              <Form.Item label={<strong>Address</strong>} name="address">
                <Input disabled={true} />
              </Form.Item>
            </Col>

            <Col md={12} sm={24}>
              <Button type="submit">Save</Button>
            </Col>
          </Row>
        </Form>
      </div>
    </ProfileWrapper>
  );
}

export default Profile;
