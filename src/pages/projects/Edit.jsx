import React from "react";

import { Typography, PageHeader } from "antd";
import { useParams } from "react-router-dom";
import { Breadcrumbs } from "../../components/Breadcrumbs";

const { Text } = Typography;

export function Edit() {
  let params = useParams();

  const projectId = parseInt(params.projectId);
  const crumbs = getBreadcrumbs(projectId);

  return (
    <>
      <Breadcrumbs crumbs={crumbs} />
      <PageHeader className="site-page-header" title="Edit Project" />
      <Text>Edit project! {projectId}</Text>
    </>
  );
}

function getBreadcrumbs(projectId) {
  const idStr = projectId.toString();

  return [
    {
      path: "/",
      breadcrumbName: "Dashboard",
    },
    {
      path: "/projects",
      breadcrumbName: "Projects",
    },
    {
      path: `/projects/${idStr}`,
      breadcrumbName: `Project ${idStr}`,
    },
    {
      breadcrumbName: "edit",
    },
  ];
}
