import React from "react";
import PropTypes from "prop-types";

import { Link } from "react-router-dom";
import { Descriptions, Image } from "antd";

import { Games } from "@/components/Games";
import { Tags } from "@/components/Tags";

export function Project({ project }) {
  const editPath = "/projects/" + project.id + "/edit";
  const editLink = (
    <Link to={editPath} className="ant-btn ant-btn-primary">
      Edit Project
    </Link>
  );

  const imagePath = `/projects/${project.id}/image`;
  const imageLink = <Link to={imagePath}>Set New Image</Link>;

  const projectImage = project.image ? (
    <Image
      width={200}
      src={`http://localhost/${project.image}`}
      style={{ marginBottom: "1em" }}
    />
  ) : (
    <></>
  );

  return (
    <Descriptions
      title="Project Details"
      bordered
      labelStyle={{ fontWeight: "" }}
      column={1}
      contentStyle={{ whiteSpace: "pre-line", fontWeight: "bold" }}
      extra={editLink}
    >
      <Descriptions.Item label="Name">{project.name}</Descriptions.Item>
      <Descriptions.Item
        label="Accent Color"
        contentStyle={{ color: "#" + project.accent_color }}
      >
        #{project.accent_color}
      </Descriptions.Item>
      <Descriptions.Item label="Games">
        <Games games={project.games} />
      </Descriptions.Item>
      <Descriptions.Item label="Tags">
        <Tags tags={project.tags} />
      </Descriptions.Item>
      <Descriptions.Item label="Image" contentStyle={{ fontWeight: "normal" }}>
        {projectImage}
        <br />
        {imageLink}
      </Descriptions.Item>
      <Descriptions.Item
        label="Description"
        contentStyle={{ fontWeight: "normal" }}
      >
        {project.description}
      </Descriptions.Item>
    </Descriptions>
  );
}

Project.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    accent_color: PropTypes.string,
    games: PropTypes.array,
    tags: PropTypes.array,
    image: PropTypes.string,
  }).isRequired,
};
