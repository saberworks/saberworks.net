import React from "react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { message, Typography, PageHeader } from "antd";
import { useParams } from "react-router-dom";
import { Breadcrumbs } from "../../components/Breadcrumbs";

const { Text } = Typography;

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
      message.success("Project created!  You may want to add a project image.");
    }
  }, [state]);

  console.log("PROJECT::::::::::::::::::::");
  console.dir(project);

  // TODO: make a decent looking page for the project
  // * use accent_color somewhere
  // * link or form to submit a project image

  return (
    <>
      <Breadcrumbs crumbs={crumbs} />
      <PageHeader
        className="site-page-header"
        title="projects"
        subTitle="edit"
      />
      <Text>View project! {projectId}</Text>
      <Text>{project.name}</Text>
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
