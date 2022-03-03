import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Divider,
  Form,
  Image,
  Input,
  message,
  Popconfirm,
  Space,
  Table,
  Tooltip,
  Typography,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import { projectPropTypes } from "@/lib/PropTypes";
import { dateFormat } from "@/lib/Util";
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
      let posts = [];
      try {
        posts = await client.getPosts(projectId);
      } catch {
        // it's ok, probably just a 404
      }

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

  const deletePost = async (post) => {
    const genericError =
      "Error: Post could not be deleted.  This is not your fault.";

    const deleteData = async () => {
      const data = await client.deletePost(projectId, post.id);

      if (data.success) {
        message.success("Post was deleted successfully.", 10);
        setPosts(posts.filter((p) => p.id !== post.id));
      } else {
        message.error(genericError, 10);
      }
    };

    deleteData().catch((err) => {
      console.log(err);
      message.error(genericError, 10);
    });
  };

  return (
    <>
      <Typography.Title level={4}>Add a Post</Typography.Title>
      <Typography.Paragraph>
        Posts require title and text. Image is optional.
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
        columns={getPostsTableColumns(projectId, deletePost)}
      />
    </>
  );
}

Posts.propTypes = projectPropTypes;

const renderNoWrap = (value) => {
  return (
    <Typography.Text style={{ whiteSpace: "nowrap" }}>{value}</Typography.Text>
  );
};

function getPostsTableColumns(projectId, deletePost) {
  return [
    {
      title: "Created At",
      dataIndex: "created_at",
      className: "tdValignTop",
      render: (created_at) => {
        return renderNoWrap(dateFormat(created_at));
      },
    },
    {
      title: "Title",
      dataIndex: "title",
      className: "tdValignTop",
      render: (title) => renderNoWrap(title),
    },
    {
      title: "Text",
      dataIndex: "text",
      className: "tdValignTop",
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
    {
      title: "Image",
      dataIndex: "image",
      className: "tdValignTop",
      render: (image) => {
        return image ? <Image src={`${baseUrl}/${image}`} width="200px" /> : "";
      },
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (value, post, index) => {
        return (
          <>
            <Space size="middle">
              <Tooltip title="Edit Post" key="tt0">
                <Link to={`/projects/${projectId}/posts/${post.id}/edit`}>
                  <EditOutlined key="edit" />
                </Link>
              </Tooltip>
              <Tooltip title="Delete Post" key="tt2">
                <Popconfirm
                  placement="top"
                  title={
                    <>
                      <p>Are you sure you want to delete this post?</p>
                      <p>
                        Post Id: {post.id}
                        <br />
                        Post Title: {post.title}
                      </p>
                      <p>
                        This action is{" "}
                        <span style={{ color: "orangered" }}>permanent</span>{" "}
                        and there is <em>no undo</em>.
                      </p>
                    </>
                  }
                  onConfirm={() => {
                    deletePost(post);
                  }}
                  okText="Yes"
                  cancelText="No"
                >
                  <DeleteOutlined
                    key="delete"
                    twoToneColor="red"
                    style={{ color: "darkred" }}
                  />
                </Popconfirm>
              </Tooltip>
            </Space>
          </>
        );
      },
    },
  ];
}
