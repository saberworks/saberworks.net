import React from "react";
import { Tooltip, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

import PropTypes from "prop-types";

export function DeleteLink({ title, confirmPrompt, onConfirm }) {
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

DeleteLink.propTypes = {
  title: PropTypes.string.isRequired,
  confirmPrompt: PropTypes.element.isRequired,
  onConfirm: PropTypes.func.isRequired,
};
