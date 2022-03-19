import React from "react";

import { Link } from "react-router-dom";
import { Descriptions, Image } from "antd";

import { byGameOrder } from "@/lib/Util";
import { projectPropTypes } from "@/lib/PropTypes";
import { Games } from "@/components/Games";
import { Tags } from "@/components/Tags";

export function Project({ project }) {
  const editPath = "/projects/" + project.id + "/edit";
  const editLink = (
    <Link to={editPath} className="ant-btn ant-btn-primary">
      Edit Project
    </Link>
  );

  const projectImage = project.image ? (
    <Image width={200} src={project.image} />
  ) : (
    <></>
  );

  const wantedGames = project.games.map((game) => {
    return { ...game, label: game.name };
  });

  const games = wantedGames.sort(byGameOrder);

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
        <Games games={games} />
      </Descriptions.Item>
      <Descriptions.Item label="Tags">
        <Tags tags={project.tags} />
      </Descriptions.Item>
      <Descriptions.Item label="Image">{projectImage}</Descriptions.Item>
      <Descriptions.Item
        label="Description"
        contentStyle={{ fontWeight: "normal" }}
      >
        {project.description}
      </Descriptions.Item>
    </Descriptions>
  );
}

Project.propTypes = projectPropTypes;
