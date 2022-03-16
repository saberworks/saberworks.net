import React from "react";
import { Card, Checkbox } from "antd";

import { groupTags } from "@/lib/Util";

type Props = {
  name: string;
  tags: object;
  setTags: (tags: object) => void;
  tagOptions: Array<any>;
};

export function TagSetCheckBoxGroup({
  name,
  tagOptions,
  tags,
  setTags,
}: Props) {
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
        size="small"
        style={{ marginBottom: "1em" }}
        bodyStyle={{ backgroundColor: "#000000" }}
        key={`card_${group}`}
      >
        <Checkbox.Group
          name={name}
          defaultValue={tags[group]}
          options={tagsByGroup[group]}
          key={`tag_${group}`}
          onChange={(checkedValues) => saveSelections(group, checkedValues)}
        />
      </Card>
    );
  }

  return <>{groupedElements}</>;
}
