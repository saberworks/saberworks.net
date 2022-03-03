import React from "react";
import { Link } from "react-router-dom";
import { Tooltip } from "antd";
import { EditOutlined } from "@ant-design/icons";

import PropTypes from "prop-types";

export function EditLink({ title, to }) {
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

EditLink.propTypes = {
  title: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
};
