import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, message, Space, Spin, Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

import { saberworksApiClient as client } from "@/client/saberworks";

export function FileForm({
  project,
  fileId,
  file,
  successMessage,
  onSuccess,
  enabled,
  submitEnabled,
}) {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const projectId = project.id;
  const isEditMode = file !== undefined;

  const [selectedImage, setSelectedImage] = useState(null);
  const [initialValues, setInitialValues] = useState({ title: project.name });
  const [imageLabel, setImageLabel] = useState(<span>Image</span>);

  // if a post was passed in, gather values from it to set initial form values
  useEffect(() => {
    if (file === undefined) return;
    if (Object.keys(file).length == 0) return;

    const initialValues = {
      title: file.title,
      name: file.name,
      version: file.version,
      description: file.description,
    };

    const imageLabel = (
      <span>
        New Image&nbsp;
        <Tooltip title="If you choose a new image, it will replace the old one.">
          <QuestionCircleOutlined />
        </Tooltip>
      </span>
    );

    setImageLabel(imageLabel);
    setInitialValues(initialValues);
  }, [file]);

  const handleCancel = async () => {
    navigate(`/projects/${projectId}/files`);
  };

  const onFinish = async (values: {
    title: string;
    version: string;
    description: string;
  }) => {
    const requestBody = {
      title: values.title,
      version: values.version,
      description: values.description,
    };

    const data = await client.updateFileWithImage(
      projectId,
      fileId,
      requestBody,
      selectedImage
    );

    if (data.success) {
      form.resetFields();
      setSelectedImage(null);
      message.success(successMessage);

      if (onSuccess) {
        onSuccess(data.file);
      } else {
        navigate(`/projects/${projectId}/files`);
      }
    } else {
      message.error("Something went wrong :(  (Not your fault!)");
    }
  };

  // If a file was passed in, must wait until initialValues is populated
  // before we let the form render.  If the form renders without initialValues
  // being passed, and then later initialValues is populated, the form won't
  // see the values
  if (isEditMode && Object.keys(initialValues).length == 0) {
    return <Spin></Spin>;
  }

  return (
    <Form
      initialValues={initialValues}
      layout="horizontal"
      form={form}
      onFinish={onFinish}
      labelCol={{ span: 2 }}
      wrapperCol={{ span: 10 }}
    >
      <Form.Item
        name="title"
        label="Title"
        rules={[{ required: true, message: "Please enter a Title." }]}
      >
        <Input
          placeholder={project.name}
          maxLength={256}
          disabled={!enabled}
        ></Input>
      </Form.Item>

      <Form.Item
        name="version"
        label="Version"
        rules={[{ required: true, message: "Please enter a Version." }]}
      >
        <Input
          placeholder="Version"
          maxLength={256}
          disabled={!enabled}
        ></Input>
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: "Please enter a Description." }]}
      >
        <Input.TextArea
          showCount
          maxLength={8192}
          disabled={!enabled}
          style={{ height: "12em" }}
        ></Input.TextArea>
      </Form.Item>

      <Form.Item name="image" label={imageLabel}>
        <Input
          disabled={!enabled}
          type="file"
          value={selectedImage}
          onChange={(e) => setSelectedImage(e.target.files[0])}
        />
      </Form.Item>

      <Form.Item name="submit" wrapperCol={{ offset: 2, span: 10 }}>
        <Space size="large">
          <Button type="primary" htmlType="submit" disabled={!submitEnabled}>
            {enabled && !submitEnabled ? (
              <Spin style={{ paddingRight: ".5em" }}></Spin>
            ) : (
              ""
            )}
            Submit
          </Button>

          {isEditMode && (
            <Button type="link" onClick={handleCancel}>
              Cancel
            </Button>
          )}
        </Space>
      </Form.Item>
    </Form>
  );
}

FileForm.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    accent_color: PropTypes.string,
    games: PropTypes.array,
    tags: PropTypes.array,
    image: PropTypes.string,
  }).isRequired,
  file: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    version: PropTypes.string,
    description: PropTypes.string,
    file: PropTypes.string,
    image: PropTypes.string,
  }),
  successMessage: PropTypes.string.isRequired,
  onSuccess: PropTypes.func,
  enabled: PropTypes.bool,
  fileId: PropTypes.number,
  submitEnabled: PropTypes.bool,
};
