import React from "react";
import PropTypes from "prop-types";
import { Tag } from "antd";

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
  if (!tags) return <></>;

  const groupedTags = groupTags(tags);
  const sortedKeys = Object.keys(groupedTags).sort();

  const jsxTags = [];

  // Looping in sorted order so the color per tag type is relatively consistent
  for (const [index, tagType] of sortedKeys.entries()) {
    const color = availableColors[index];

    for (const tag of groupedTags[tagType]) {
      jsxTags.push(
        <Tag color={color} key={`tag_${tag.value}`}>
          {tagType}:{tag.label}
        </Tag>
      );
    }
  }

  return <>{jsxTags}</>;
}

Tags.propTypes = {
  tags: PropTypes.array.isRequired,
};

// TODO: this function is copied, find all the copies and find a singular
// place to put it
function groupTags(tagOptions) {
  const tagsByGroup = {};

  for (const tag of tagOptions) {
    if (!(tag.type in tagsByGroup)) {
      tagsByGroup[tag.type] = [];
    }

    tagsByGroup[tag.type].push({
      label: tag.tag,
      value: tag.id,
    });
  }

  return tagsByGroup;
}
