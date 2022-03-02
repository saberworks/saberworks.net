import React, { useEffect, useState } from "react";
import {
  Button,
  Divider,
  Form,
  Image,
  Input,
  message,
  Table,
  Typography,
} from "antd";

import { projectPropTypes } from "@/lib/PropTypes";
import { baseUrl, saberworksApiClient as client } from "@/client/saberworks";

export function Posts({ project }) {
  const [form] = Form.useForm();
  const projectId = project.id;

  const [shouldReloadPosts, setShouldReloadPosts] = useState(true);
  const [posts, setPosts] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  // Download list of posts
  useEffect(() => {
    if (!shouldReloadPosts) return;

    const fetchData = async () => {
      const posts = await client.getPosts(projectId);

      setPosts(posts);
      setShouldReloadPosts(false);
    };

    fetchData();
  }, [shouldReloadPosts]);

  const onFinish = async (values) => {
    const requestBody = {
      title: values.title,
      text: values.text,
    };

    const formData = new FormData();

    formData.append("payload", JSON.stringify(requestBody));
    formData.append("uploaded_image", selectedFile);

    const data = await client.addPost(projectId, formData);

    const postId = data.post.id;
    form.resetFields();
    setShouldReloadPosts(true);
    message.success("The post was added successfully!");
  };

  return (
    <>
      <Typography.Title level={4}>Add a Text Post</Typography.Title>
      <Typography.Paragraph>
        Text posts require title and text. Image is optional.
      </Typography.Paragraph>
      <Form
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

        <Form.Item name="image" label="Image">
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
      <Divider />

      <Typography.Title level={4}>All Posts</Typography.Title>
      <Table
        rowKey="id"
        dataSource={[...posts]}
        columns={getPostsTableColumns()}
      />
    </>
  );
}

Posts.propTypes = projectPropTypes;

function getPostsTableColumns() {
  return [
    {
      title: "Image",
      dataIndex: "image",
      render: (image) => {
        return image ? <Image src={`${baseUrl}/${image}`} width="200px" /> : "";
      },
    },
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Text",
      dataIndex: "text",
      render: (text) => {
        return (
          <Typography.Paragraph
            ellipsis={{ rows: 2, symbol: "more" }}
            style={{ whiteSpace: "pre-line" }}
          >
            {text}
          </Typography.Paragraph>
        );
      },
    },
  ];
}
