import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, message, Spin, Tooltip, Typography } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

import { saberworksApiClient as client } from "@/client/saberworks";

export function PostForm({ project, post, successMessage, onSuccess }) {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const projectId = project.id;
  const postId = post !== undefined ? post.id : null;

  const [selectedFile, setSelectedFile] = useState(null);
  const [initialValues, setInitialValues] = useState({});
  const [imageLabel, setImageLabel] = useState("Image");

  // if a post was passed in, gather values from it to set initial form values
  useEffect(() => {
    if (post === undefined) return;
    if (Object.keys(post).length == 0) return;

    const initialValues = {
      title: post.title,
      text: post.text,
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
  }, [post]);

  const onFinish = async (values) => {
    const requestBody = {
      title: values.title,
      text: values.text,
    };

    let data;

    if (postId) {
      data = await client.updatePostWithImage(
        projectId,
        postId,
        requestBody,
        selectedFile
      );
    } else {
      data = await client.addPostWithImage(
        projectId,
        requestBody,
        selectedFile
      );
    }

    form.resetFields();
    setSelectedFile(null);
    message.success(successMessage);

    if (onSuccess) {
      onSuccess(data.post);
    } else {
      navigate(`/projects/${projectId}/posts`);
    }
  };

  // If a post was passed in, must wait until initialValues is populated
  // before we let the form render.  If the form renders without initialValues
  // being passed, and then later initialValues is populated, the form won't
  // see the values
  if (postId && Object.keys(initialValues).length == 0) {
    return <Spin></Spin>;
  }

  return (
    <>
      <Typography.Paragraph>
        Posts require title and text. Image is optional.
      </Typography.Paragraph>
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
          <Input placeholder="Title" maxLength={256}></Input>
        </Form.Item>

        <Form.Item
          name="text"
          label="Text"
          rules={[{ required: true, message: "Please enter some Text." }]}
        >
          <Input.TextArea
            showCount
            maxLength={8192}
            style={{ height: "12em" }}
          ></Input.TextArea>
        </Form.Item>

        <Form.Item name="image" label={imageLabel}>
          <Input
            type="file"
            value={selectedFile}
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
        </Form.Item>

        <Form.Item name="submit" wrapperCol={{ offset: 2, span: 10 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

PostForm.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    accent_color: PropTypes.string,
    games: PropTypes.array,
    tags: PropTypes.array,
    image: PropTypes.string,
  }).isRequired,
  post: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    text: PropTypes.string,
    image: PropTypes.string,
  }),
  successMessage: PropTypes.string.isRequired,
  onSuccess: PropTypes.func,
};
