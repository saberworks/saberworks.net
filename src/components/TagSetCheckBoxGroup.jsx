import React from "react";
import PropTypes from "prop-types";

import { Card, Checkbox } from "antd";

export function TagSetCheckBoxGroup({ name, tagOptions, tags, setTags }) {
  if (tagOptions.length == 0) {
    return <></>;
  }

  const saveSelections = (group, values) => {
    setTags({ ...tags, [group]: values });
  };

  const tagsByGroup = groupTags(tagOptions);

  const groupedElements = [];

  for (const group in tagsByGroup) {
    groupedElements.push(
      <Card
        title={group}
        style={{ marginBottom: "1em" }}
        bodyStyle={{ backgroundColor: "#000000" }}
        key={`card_${group}`}
      >
        <Checkbox.Group
          name={name}
          options={tagsByGroup[group]}
          key={`tag_${group}`}
          onChange={(checkedValues) => saveSelections(group, checkedValues)}
        />
      </Card>
    );
  }

  return <>{groupedElements}</>;
}

TagSetCheckBoxGroup.propTypes = {
  name: PropTypes.string.isRequired,
  tags: PropTypes.object.isRequired, // currently selected tags
  setTags: PropTypes.func.isRequired, // func to set tags
  tagOptions: PropTypes.array.isRequired, // set of options to display as checkboxes
};

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
