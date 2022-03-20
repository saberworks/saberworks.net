import React from "react";
import { useEffect, useState } from "react";
import {
  message,
  Card,
  List,
  PageHeader,
  Spin,
  Typography,
  Descriptions,
} from "antd";
import { Link } from "react-router-dom";

import { DeleteLink } from "@/components/actions/DeleteLink";
import { EditLink } from "@/components/actions/EditLink";
import { Games } from "@/components/Games";
import { saberworksApiClient as client } from "@/client/saberworks";
import { Tags } from "@/components/Tags";

export function Home() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);

  // Download list of projects
  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        const projects = await client.getProjects();

        setProjects(projects);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ height: "100px" }}>
        <Spin />
      </div>
    );
  }

  const deleteProject = async (project) => {
    const genericError =
      "Error: Project could not be deleted.  Are all associated posts and files already deleted?";

    const deleteData = async () => {
      const data = await client.deleteProject(project.id);

      if (data.success) {
        message.success("Project was deleted successfully.", 10);
        setProjects(projects.filter((p) => p.id !== project.id));
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
      <PageHeader
        className="site-page-header"
        title="Your Projects"
        extra={
          <Link to="/projects/create" className="ant-btn ant-btn-primary">
            Create Project
          </Link>
        }
      />

      <List
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
                backgroundImage: project.image
                  ? `linear-gradient(to right, black, transparent), url(${project.image})`
                  : "",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                whiteSpace: "pre-line",
              }}
              actions={[
                <EditLink
                  title="Edit Project"
                  to={`/projects/${project.id}/edit`}
                  key="edit"
                />,
                <DeleteLink
                  title="Delete Project"
                  key="delete"
                  confirmPrompt={
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
                />,
              ]}
            >
              <Typography.Paragraph
                style={{
                  padding: "1em",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
                ellipsis={{ rows: 2, expandable: true, symbol: "more" }}
              >
                {project.description}
              </Typography.Paragraph>
              <Descriptions
                size="small"
                bordered
                labelStyle={{
                  fontWeight: "",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
                column={1}
                contentStyle={{
                  whiteSpace: "pre-line",
                  fontWeight: "bold",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
              >
                <Descriptions.Item label="Games">
                  <Games games={project.games} />
                </Descriptions.Item>
                <Descriptions.Item label="Tags">
                  <Tags tags={project.tags} />
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </List.Item>
        )}
      />
    </>
  );
}
