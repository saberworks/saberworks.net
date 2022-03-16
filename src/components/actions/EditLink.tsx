import React from "react";
import { Link } from "react-router-dom";
import { Tooltip } from "antd";
import { EditOutlined } from "@ant-design/icons";

type Props = {
  title: string;
  to: string;
};

export function EditLink({ title, to }: Props) {
  return (
    <>
      <Tooltip title={title} key="tt0">
        <Link to={to}>
          <EditOutlined key="edit" style={{ fontSize: "1.5em" }} />
        </Link>
      </Tooltip>
    </>
  );
}
