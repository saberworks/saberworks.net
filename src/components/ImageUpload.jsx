import React from "react";
import { useState } from "react";
import { message, Button, Typography, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

export function ImageUpload({
  instructions,
  actionUrl,
  successMessage,
  onSuccess,
}) {
  const [fileList, setFileList] = useState([]);

  const myMessage = successMessage
    ? successMessage
    : "The file was uploaded successfully.";

  // django requires csrftoken to be in the request headers; yank it out
  // of the cookie and put it in the headers
  // TODO: pull this into a util or switch to a non-cookie based auth
  const csrftoken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrftoken="))
    .split("=")[1];

  const validImageTypes = [
    "image/bmp",
    "image/gif",
    "image/jpeg",
    "image/png",
    "image/svg",
  ];

  const props = {
    name: "image",
    action: actionUrl,
    fileList: fileList,
    multiple: false,
    withCredentials: true,
    headers: {
      "X-CSRFToken": csrftoken,
    },
    beforeUpload: (file) => {
      const isValidImageType = validImageTypes.includes(file.type);
      if (!isValidImageType) {
        message.error({
          content: `${file.name} is not a valid image file.  Please use one of bmp, gif, jpg/jpeg, png, or svg.`,
          style: {
            marginTop: "20vh",
          },
          duration: 10,
        });
      }
      return isValidImageType || Upload.LIST_IGNORE;
    },
    onChange(info) {
      setFileList(info.fileList);

      if (info.file.status === "done") {
        message.success(myMessage, 10);
        setFileList([]);

        if (onSuccess) {
          onSuccess();
        }
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <>
      <Typography.Paragraph>{instructions}</Typography.Paragraph>
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>
    </>
  );
}

ImageUpload.propTypes = {
  instructions: PropTypes.string,
  actionUrl: PropTypes.string.isRequired,
  successMessage: PropTypes.string,
  onSuccess: PropTypes.func,
};
