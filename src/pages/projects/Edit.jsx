import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PageHeader, Spin } from "antd";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProjectForm } from "@/components/forms/ProjectForm";
import { saberworksApiClient as client } from "@/client/saberworks";

export function Edit() {
  const params = useParams();

  const [project, setProject] = useState({});
  const [crumbs, setCrumbs] = useState([]);

  const projectId = parseInt(params.projectId);

  useEffect(() => {
    const fetchData = async () => {
      const data = await client.getProject(projectId);

      setProject(data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    setCrumbs(getBreadcrumbs(project));
  }, [project]);

  if (!Object.keys(project).length) {
    return <Spin></Spin>;
  }

  return (
    <>
      <Breadcrumbs crumbs={crumbs} />
      <PageHeader className="site-page-header" title="Edit Project" />
      <ProjectForm
        project={project}
        successMessage="Project updated successfully!"
      />
    </>
  );
}

function getBreadcrumbs(project) {
  return [
    {
      path: "/",
      breadcrumbName: "Home",
    },
    {
      path: "/projects",
      breadcrumbName: "Projects",
    },
    {
      path: `/projects/${project.id}`,
      breadcrumbName: project.name,
    },
    {
      breadcrumbName: "edit",
    },
  ];
}
