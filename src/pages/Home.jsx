import React from "react";
import { Typography, PageHeader, Card, Row, Col } from "antd";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "../components/Breadcrumbs";

const { Text } = Typography;

export function Home() {
  const crumbs = getBreadcrumbs();

  return (
    <>
      <Breadcrumbs crumbs={crumbs} />

      <PageHeader
        className="site-page-header"
        title="dashboard"
        subTitle="admin"
      />
      <Row gutter={16}>
        <Col span={8}>
          <Card
            title="Your Latest Projects"
            style={{ width: "100%" }}
            extra={<Link to="/projects/create">Create Project</Link>}
          >
            <p>
              <Text italic>No projects found...</Text>
            </p>
            <p>
              <Link to="/projects/1234/edit">Edit fake project</Link>
            </p>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Latest Posts" style={{ width: "100%" }}>
            <p>
              <Text italic>No posts found...</Text>
            </p>
            <p>Create a project first, then you can add a post to it.</p>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Latest Files" style={{ width: "100%" }}>
            <p>
              <Text italic>No files found...</Text>
            </p>
            <p>Create a project first, then you can add a file to it.</p>
          </Card>
        </Col>
      </Row>
    </>
  );
}

function getBreadcrumbs() {
  return [
    {
      path: "/",
      breadcrumbName: "Dashboard",
    },
  ];
}
