import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { message, PageHeader, Spin, Tabs } from "antd";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Project } from "@/components/Project";
import { Posts } from "@/components/Posts";
import { Screenshots } from "@/components/Screenshots";
import { saberworksApiClient as client } from "@/client/saberworks";

const { TabPane } = Tabs;

export function View() {
  const navigate = useNavigate();
  const params = useParams();
  const projectId = parseInt(params.projectId);
  const tab = params.tab;

  const { state } = useLocation();

  const [project, setProject] = useState({});
  const [crumbs, setCrumbs] = useState([]);

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
      <Tabs
        defaultActiveKey="info"
        activeKey={tab ? tab : "info"}
        onChange={(key) => {
          const url =
            key == "info"
              ? `/projects/${projectId}`
              : `/projects/${projectId}/${key}`;

          navigate(url);
        }}
      >
        <TabPane tab="Details" key="info">
          <Project project={project} />
        </TabPane>
        <TabPane tab="Posts" key="posts">
          <Posts project={project} />
        </TabPane>
        <TabPane tab="Screenshots" key="screenshots">
          <Screenshots project={project} />
        </TabPane>
        <TabPane tab="Files" key="files">
          OOF (not implemented yet) TODO: Implement files
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
      breadcrumbName: "manage",
    },
  ];
}
