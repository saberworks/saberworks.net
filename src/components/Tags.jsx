import React from "react";
import PropTypes from "prop-types";
import { Tag } from "antd";

import { groupTags } from "@/lib/Util";

const availableColors = [
  "volcano",
  "red",
  "purple",
  "orange",
  "magenta",
  "lime",
  "green",
  "gold",
  "geekblue",
  "cyan",
  "blue",
];

export function Tags({ tags }) {
  if (!(Array.isArray(tags) && tags.length > 0)) return <></>;

  const groupedTags = groupTags(tags);
  const sortedKeys = Object.keys(groupedTags).sort();

  const jsxTags = [];

  // Looping in sorted order so the color per tag type is relatively consistent
  for (const [index, tagType] of sortedKeys.entries()) {
    const color = availableColors[index];

    for (const tag of groupedTags[tagType]) {
      jsxTags.push(
        <Tag color={color} key={tag.key}>
          {tagType}:{tag.label}
        </Tag>
      );
    }

    jsxTags.push(<br style={{ marginBottom: ".5em" }} key={tagType} />);
  }

  jsxTags.pop(); // remove trailing <br>

  return <>{jsxTags}</>;
}

Tags.propTypes = {
  tags: PropTypes.array.isRequired,
};
