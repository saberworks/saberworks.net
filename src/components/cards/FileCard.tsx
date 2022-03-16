import React from "react";
import { Card, Image } from "antd";
import filesize from "filesize";

import { dateFormat } from "@/lib/Util";
import { EditLink } from "@/components/actions/EditLink";
import { DeleteLink } from "@/components/actions/DeleteLink";
import { baseUrl } from "@/client/saberworks";

export function FileCard({ project, file, onDeleteConfirm }) {
  return (
    <Card
      title={`${file.title} ${file.version}`}
      headStyle={{
        fontWeight: "bold",
        background: `linear-gradient(to right, #000000, #${project.accent_color})`,
      }}
      bodyStyle={{
        whiteSpace: "pre-line",
      }}
      actions={[
        <EditLink
          title="Edit File"
          to={`/projects/${project.id}/files/${file.id}/edit`}
          key="edit"
        />,
        <DeleteLink
          title="Delete File"
          key="delete"
          confirmPrompt={
            <>
              <p>Are you sure you want to delete this file?</p>
              <p>
                File Id: {file.id}
                <br />
                File Name: {file.name}
              </p>
              <p>
                This action is{" "}
                <span style={{ color: "orangered" }}>permanent</span> and there
                is <em>no undo</em>.
              </p>
            </>
          }
          onConfirm={onDeleteConfirm}
        />,
      ]}
    >
      <p>{file.description}</p>
      Download: <a href={`${baseUrl}/${file.file}`}>{file.name}</a>
      <br />
      Size: {filesize(file.file_size)}
      <br />
      Hash: {file.file_hash}
      <br />
      Uploaded: {dateFormat(file.created_at)}
      <br />
      <br />
      {file.image ? (
        <Image
          src={`${baseUrl}/${file.image}`}
          width="200"
          style={{ border: `1px solid #${project.accent_color}` }}
        ></Image>
      ) : (
        ""
      )}
    </Card>
  );
}
