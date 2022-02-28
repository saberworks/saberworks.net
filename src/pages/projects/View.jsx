import React from "react";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { message, PageHeader, Spin, Tabs } from "antd";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Project } from "@/components/Project";

const { TabPane } = Tabs;

export function View() {
  const params = useParams();
  const projectId = parseInt(params.projectId);

  const { state } = useLocation();

  const [project, setProject] = useState({});
  const [crumbs, setCrumbs] = useState([]);

  useEffect(() => {
    fetch(`http://localhost/api/saberworks/projects/${projectId}`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => setProject(data));
  }, []);

  useEffect(() => {
    setCrumbs(getBreadcrumbs(project));
  }, [project]);

  useEffect(() => {
    if (state && state["justCreated"]) {
      message.success(
        "Project created!  You may want to set a project image.",
        10
      );
    }
  }, [state]);

  if (Object.keys(project).length === 0) {
    return <Spin />;
  }

  return (
    <>
      <Breadcrumbs crumbs={crumbs} />
      <PageHeader className="site-page-header" title={project.name} />
      <Tabs defaultActiveKey="1">
        <TabPane tab="Details" key="1">
          <Project project={project} />
        </TabPane>
        <TabPane tab="Posts" key="2">
          TODO: Implement list of posts
        </TabPane>
        <TabPane tab="Files" key="3">
          TODO: Implement list of files
        </TabPane>
      </Tabs>
    </>
  );
}

function getBreadcrumbs(project) {
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
      path: `/projects/${project.id}`,
      breadcrumbName: project.name,
    },
    {
      breadcrumbName: "view",
    },
  ];
}
