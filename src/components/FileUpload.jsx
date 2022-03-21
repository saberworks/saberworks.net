import React from "react";
import { useState } from "react";
import { message, Button, Typography, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

import { baseUrl, saberworksApiClient as client } from "@/client/saberworks";

export function FileUpload({
  projectId,
  instructions,
  onSuccess,
  onChange,
  onStage,
}) {
  const [fileList, setFileList] = useState([]);
  const [actionUrl, setActionUrl] = useState(null);

  // django requires csrftoken to be in the request headers; yank it out
  // of the cookie and put it in the headers
  // TODO: pull this into a util or switch to a non-cookie based auth
  const csrftoken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrftoken="))
    .split("=")[1];

  const validArchiveTypes = [
    "application/zip",
    "application/gzip",
    "application/x-7z-compressed",
    "application/vnd.rar",
    "text/plain", // TODO REMOVE THIS
  ];

  const props = {
    name: "file",
    action: actionUrl,
    fileList: fileList,
    multiple: false,
    withCredentials: true,
    headers: {
      "X-CSRFToken": csrftoken,
    },
    beforeUpload: async (file) => {
      const isValidArchiveType = validArchiveTypes.includes(file.type);

      if (!isValidArchiveType) {
        message.error({
          content: `${file.name} is not a valid archive file.  Please use one of zip, gzip, 7zip, or rar.`,
          style: {
            marginTop: "20vh",
          },
          duration: 10,
        });
      }

      // stage the file -- this means send a request to the server telling it
      // we want to upload a file for the specified project; we aren't actually
      // uploading the file yet.  Server should respond with a dummy file entry
      // (mostly filled with meaningless values).  The file entry includes the
      // fileId to which we'll post the actual file, and later the file details,
      // as entered by the user
      if (isValidArchiveType) {
        const data = await client.stageFile(projectId);

        if (data.success) {
          onStage(data.file.id, setFileList);

          setActionUrl(
            `${baseUrl}/api/saberworks/projects/${projectId}/files.upload/${data.file.id}`
          );
        } else {
          message.error("Unable to stage file.  This is not your fault.");
          return false;
        }
      }

      return isValidArchiveType || Upload.LIST_IGNORE;
    },
    onChange(info) {
      setFileList(info.fileList);

      if (onChange) {
        onChange(info);
      }

      if (info.file.status === "done") {
        message.success("File uploaded, please continue!", 5);

        if (onSuccess) {
          onSuccess(info.file);
        }
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    progress: {
      strokeColor: {
        "0%": "#108ee9",
        "100%": "#87d068",
      },
      strokeWidth: 3,
      format: (percent) => `${parseFloat(percent.toFixed(2))}%`,
    },
  };

  const uploadButton = (
    <Button icon={<UploadOutlined />}>Click to Upload</Button>
  );

  return (
    <>
      <Typography.Paragraph>{instructions}</Typography.Paragraph>
      <div style={{ width: "50%" }}>
        <Upload {...props}>{fileList.length > 0 ? null : uploadButton}</Upload>
      </div>
    </>
  );
}

FileUpload.propTypes = {
  projectId: PropTypes.number.isRequired,
  instructions: PropTypes.string,
  actionUrl: PropTypes.string.isRequired,
  onSuccess: PropTypes.func,
  onChange: PropTypes.func,
  onStage: PropTypes.func,
};
