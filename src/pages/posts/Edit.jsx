import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PageHeader, Spin } from "antd";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PostForm } from "@/components/forms/PostForm";
import { saberworksApiClient as client } from "@/client/saberworks";

export function Edit() {
  const params = useParams();

  const [project, setProject] = useState({});
  const [post, setPost] = useState({});
  const [crumbs, setCrumbs] = useState([]);

  const projectId = parseInt(params.projectId);
  const postId = parseInt(params.postId);

  useEffect(() => {
    const fetchData = async () => {
      const data = await client.getProject(projectId);

      setProject(data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const data = await client.getPost(projectId, postId);

      setPost(data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    setCrumbs(getBreadcrumbs(project, post));
  }, [project]);

  if (!Object.keys(project).length) {
    return <Spin></Spin>;
  }

  return (
    <>
      <Breadcrumbs crumbs={crumbs} />
      <PageHeader className="site-page-header" title="Edit Post" />
      <PostForm
        project={project}
        post={post}
        successMessage="Post updated successfully!"
      />
    </>
  );
}

function getBreadcrumbs(project) {
  return [
    {
      path: "/",
      breadcrumbName: "Projects",
    },
    {
      path: `/projects/${project.id}`,
      breadcrumbName: project.name,
    },
    {
      path: `/projects/${project.id}/posts`,
      breadcrumbName: "Posts",
    },
    {
      breadcrumbName: `edit`,
    },
  ];
}
