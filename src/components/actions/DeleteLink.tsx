import React from "react";
import { Tooltip, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

type Props = {
  title: string;
  confirmPrompt: string;
  onConfirm: () => void;
};

export function DeleteLink({ title, confirmPrompt, onConfirm }: Props) {
  return (
    <>
      <Tooltip title={title} key="tt2">
        <Popconfirm
          placement="top"
          title={confirmPrompt}
          onConfirm={onConfirm}
          okText="Yes"
          cancelText="No"
        >
          <DeleteOutlined
            key="delete"
            style={{ color: "darkred", fontSize: "1.5em" }}
          />
        </Popconfirm>
      </Tooltip>
    </>
  );
}
