import React, { useEffect, useState } from "react";
import { Divider, Image, message, Space, Table, Typography } from "antd";

import { PostForm } from "@/components/forms/PostForm";
import { EditLink } from "@/components/actions/EditLink";
import { DeleteLink } from "@/components/actions/DeleteLink";
import { projectPropTypes } from "@/lib/PropTypes";
import { dateFormat } from "@/lib/Util";
import { saberworksApiClient as client } from "@/client/saberworks";

export function Posts({ project }) {
  const projectId = project.id;

  const [posts, setPosts] = useState([]);

  // Download list of posts
  useEffect(() => {
    const fetchData = async () => {
      let posts = [];
      try {
        posts = await client.getPosts(projectId);
      } catch {
        // it's ok, probably just a 404
      }

      setPosts(posts);
    };

    fetchData();
  }, []);

  const onSuccess = async (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const deletePost = async (post) => {
    const genericError = "Error: Post could not be deleted. (Not your fault!)";

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
      <PostForm
        project={project}
        successMessage="Post created successfully!"
        onSuccess={onSuccess}
      />

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
      title: "Image",
      dataIndex: "image",
      className: "tdValignTop",
      render: (image) => {
        return image ? <Image src={image} width="200px" /> : "";
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
      title: "Created At",
      dataIndex: "created_at",
      className: "tdValignTop",
      render: (created_at) => renderNoWrap(dateFormat(created_at)),
    },
    {
      title: "Action",
      dataIndex: "",
      className: "tdValignTop",
      align: "center",
      key: "action",
      render: (_value, post) => {
        return (
          <>
            <Space size="middle">
              <EditLink
                title="Edit Post"
                to={`/projects/${projectId}/posts/${post.id}/edit`}
                key="edit"
              />

              <DeleteLink
                title="Delete Post"
                key="delete"
                confirmPrompt={
                  <>
                    <p>Are you sure you want to delete this post?</p>
                    <p>
                      Post Id: {post.id}
                      <br />
                      Post Title: {post.title}
                    </p>
                    <p>
                      This action is{" "}
                      <span style={{ color: "orangered" }}>permanent</span> and
                      there is <em>no undo</em>.
                    </p>
                  </>
                }
                onConfirm={() => {
                  deletePost(post);
                }}
              />
            </Space>
          </>
        );
      },
    },
  ];
}
