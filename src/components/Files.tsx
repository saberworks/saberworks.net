import React, { useEffect, useState } from "react";
import { Divider, List, message, Typography } from "antd";

import { FileForm } from "@/components/forms/FileForm";
import { projectPropTypes } from "@/lib/PropTypes";
import { saberworksApiClient as client } from "@/client/saberworks";
import { FileCard } from "@/components/cards/FileCard";
import { FileUpload } from "@/components/FileUpload";
import { File, Project } from "@/interfaces";
import { baseUrl } from "@/client/saberworks";
import _default from "antd/lib/time-picker";

export function Files({ project }) {
  const projectId = project.id;

  const [files, setFiles] = useState([]);
  const [fileId, setFileId] = useState(null);
  const [formEnabled, setFormEnabled] = useState(false);
  const [submitEnabled, setSubmitEnabled] = useState(false);
  const [resetUploadField, setResetUploadField] = useState(null);

  // Download list of files
  useEffect(() => {
    const fetchData = async () => {
      let posts = [];
      try {
        posts = await client.getFiles(projectId);
      } catch {
        // it's ok, probably just a 404
      }

      setFiles(posts);
    };

    fetchData();
  }, []);

  const onSuccess = async (newFile: File) => {
    setFiles([newFile, ...files]);
    setFormEnabled(false);
    setSubmitEnabled(false);
    resetUploadField();
  };

  const deleteFile = async (file: File) => {
    const genericError = "Error: File could not be deleted. (Not your fault!)";

    const deleteData = async () => {
      const data = await client.deleteFile(projectId, file.id);

      if (data.success) {
        message.success("File was deleted successfully.", 10);
        setFiles(files.filter((f) => f.id !== file.id));
      } else {
        message.error(genericError, 10);
      }
    };

    deleteData().catch((err) => {
      console.log(err);
      message.error(genericError, 10);
    });
  };

  const filesList = renderFilesList(project, files, deleteFile);

  // When the upload is finally finished, enable the Submit button
  const onUploadSuccess = function () {
    setSubmitEnabled(true);
  };

  const onUploadChange = function (info) {
    setFormEnabled(true);
  };

  // When the upload is staged it will call this onStage function
  // with two single arguments: fileId and setFileList.  The setFileList
  // function allows us to reset the file upload field back to the default
  // (removing the fileList and showing the upload button again).  The
  // resetUploadField function should be called when the entire process is
  // finished (upload, fill form, save form, success).
  const onStage = function (fileId, setFileList) {
    setFileId(fileId);
    setResetUploadField(() => () => setFileList([]));
  };

  const fileUploadActionUrl = `${baseUrl}/api/saberworks/projects/${projectId}/files/upload`;

  return (
    <>
      <Typography.Title level={4}>Add a File</Typography.Title>
      <Typography.Paragraph>
        Please choose your file first, it will upload while you're filling out
        the rest of the form.
      </Typography.Paragraph>

      <FileUpload
        projectId={projectId}
        instructions="Please upload a zip, gz, 7zip, or rar file."
        actionUrl={fileUploadActionUrl}
        successMessage="The file was uploaded successfully."
        onChange={onUploadChange}
        onSuccess={onUploadSuccess}
        onStage={onStage}
      />

      <Divider />

      <FileForm
        fileId={fileId}
        project={project}
        successMessage="File created successfully!"
        onSuccess={onSuccess}
        enabled={formEnabled}
        submitEnabled={submitEnabled}
      />

      <Divider />

      <Typography.Title level={4}>All Files</Typography.Title>
      {filesList}
    </>
  );
}

Files.propTypes = projectPropTypes;

function renderFilesList(
  project: Project,
  files: Array<File>,
  deleteFile: (file: File) => void
) {
  return (
    <List
      dataSource={files}
      grid={{ gutter: 16, column: 3 }}
      split={false}
      renderItem={(file) => (
        <List.Item>
          <FileCard
            project={project}
            file={file}
            onDeleteConfirm={() => {
              deleteFile(file);
            }}
          />
        </List.Item>
      )}
    />
  );
}
