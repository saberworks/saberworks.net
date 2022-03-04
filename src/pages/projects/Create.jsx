import React from "react";
import { PageHeader } from "antd";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProjectForm } from "@/components/forms/ProjectForm";

export function Create() {
  const crumbs = getBreadcrumbs();

  return (
    <>
      <Breadcrumbs crumbs={crumbs} />
      <PageHeader className="site-page-header" title="Create Project" />
      <ProjectForm successMessage="Project created successfully!" />
    </>
  );
}

function getBreadcrumbs() {
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
      breadcrumbName: "create",
    },
  ];
}
