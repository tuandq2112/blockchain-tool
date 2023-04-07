import { PlusOutlined } from "@ant-design/icons";
import { Modal, Upload } from "antd";
import useObjectState from "hooks/useObjectState";
import { getBase64 } from "utils";

const CustomUpload = ({ multiple = false, onChange = () => {} }) => {
  const [state, setState] = useObjectState();

  const { openModalPreview, previewImage, previewTitle, fileList } = state;
  const handleCancel = () => setState({ openModalPreview: false });
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setState({
      previewImage: file.url || file.preview,
      openModalPreview: true,
      previewTitle:
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
    });
  };
  const handleChange = ({ fileList, file }) => {
    setState({ fileList });
    onChange({ fileList, file });
  };
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  return (
    <>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        multiple={multiple}
        accept="image/png, image/jpeg"
        maxCount={1}
      >
        {(fileList?.length || 0) < 1 ? uploadButton : null}
      </Upload>
      <Modal
        open={openModalPreview}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img
          alt="example"
          style={{
            width: "100%",
          }}
          src={previewImage}
        />
      </Modal>
    </>
  );
};
export default CustomUpload;
