import React from "react";
import { useEffect, useState } from "react";
import {
  message,
  Card,
  List,
  PageHeader,
  Popconfirm,
  Spin,
  Tooltip,
  Typography,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

import { Breadcrumbs } from "@/components/Breadcrumbs";

const { Paragraph } = Typography;

export function Home() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [shouldReload, setShouldReload] = useState(true);

  const crumbs = getBreadcrumbs();

  // Download list of projects
  useEffect(() => {
    if (!shouldReload) {
      return;
    }

    setLoading(true);

    fetch("http://localhost/api/saberworks/projects", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .then(() => setShouldReload(false))
      .then(() => setLoading(false));
  }, [shouldReload]);

  if (loading) {
    return (
      <div>
        <Spin />
      </div>
    );
  }

  const deleteProject = async (project) => {
    // django requires csrftoken to be in the request headers; yank it out
    // of the cookie and put it in the headers
    // TODO: pull this into a util or switch to a non-cookie based auth
    const csrftoken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="))
      .split("=")[1];

    const url = `http://localhost/api/saberworks/projects/${project.id}`;

    fetch(url, {
      method: "DELETE",
      cache: "no-cache",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          message.success("Project was deleted successfully.", 10);
        } else {
          message.error(
            "Error: Project could not be deleted.  Are all associated posts and files already deleted?",
            10
          );
        }
      })
      .then(() => setShouldReload(true))
      .catch((e) => {
        console.log(e);
        message.error(
          "Error: Project could not be deleted.  Are all associated posts and files already deleted?",
          10
        );
      });
  };

  return (
    <>
      <Breadcrumbs crumbs={crumbs} />

      <PageHeader
        className="site-page-header"
        title="Dashboard"
        extra={<Link to="/projects/create">Create Project</Link>}
      />

      <List
        header={<h3>All Your Projects</h3>}
        dataSource={projects}
        grid={{ gutter: 16, column: 3 }}
        split={false}
        renderItem={(project) => (
          <List.Item>
            <Card
              title={
                <Link
                  to={`/projects/${project.id}/`}
                  style={{ color: "silver" }}
                >
                  {project.name}
                </Link>
              }
              headStyle={{
                fontWeight: "bold",
                background:
                  "linear-gradient(to right, #000000, #" +
                  project.accent_color +
                  ")",
              }}
              bodyStyle={{
                background:
                  "linear-gradient(to right, black, transparent), url(" +
                  `http://localhost/${project.image}` +
                  ")",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                whiteSpace: "pre-line",
              }}
              actions={[
                <Tooltip title="Edit Project" key="tt0">
                  <Link to={`/projects/${project.id}/edit`}>
                    <EditOutlined key="edit" />
                  </Link>
                </Tooltip>,
                <Tooltip title="Set Project Image" key="tt1">
                  <Link to={`/projects/${project.id}/image`}>
                    <PictureOutlined key="image" />
                  </Link>
                </Tooltip>,
                <Tooltip title="Delete Project" key="tt2">
                  <Popconfirm
                    placement="top"
                    title={
                      <>
                        <p>Are you sure you want to delete this project?</p>
                        <p>
                          Project Id: {project.id}
                          <br />
                          Project Name: {project.name}
                        </p>
                        <p>
                          This action is{" "}
                          <span style={{ color: "orangered" }}>permanent</span>{" "}
                          and there is <em>no undo</em>.
                        </p>
                      </>
                    }
                    onConfirm={() => {
                      deleteProject(project);
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
                </Tooltip>,
              ]}
            >
              <Paragraph
                ellipsis={{ rows: 2, expandable: true, symbol: "more" }}
              >
                {project.description}
              </Paragraph>
            </Card>
          </List.Item>
        )}
      />
    </>
  );
}

function getBreadcrumbs() {
  return [
    {
      breadcrumbName: "Dashboard",
    },
  ];
}
