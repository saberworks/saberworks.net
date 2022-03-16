import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { message, Button, PageHeader, Spin, Typography, Upload } from "antd";
import { Image as AntImage } from "antd";
import { UploadOutlined } from "@ant-design/icons";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { baseUrl, saberworksApiClient as client } from "@/client/saberworks";

export function Image() {
  const navigate = useNavigate();

  const params = useParams();
  const projectId = parseInt(params.projectId);

  const [project, setProject] = useState({});
  const [crumbs, setCrumbs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await client.getProject(projectId);

      setProject(data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    setCrumbs(getBreadcrumbs(project));
  }, [project]);

  if (Object.keys(project).length === 0) {
    return <Spin />;
  }

  let currentImage = <Typography.Paragraph>None</Typography.Paragraph>;

  if (project.image) {
    currentImage = (
      <AntImage
        src={`${baseUrl}${project.image}`}
        width={200}
        alt="Project Image"
      />
    );
  }

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
    action: `${baseUrl}/api/saberworks/projects/${projectId}/image`,
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
      if (info.file.status === "done") {
        message.success(`Project image set successfully!`);
        navigate(`/projects/${projectId}`, { state: { imageAdded: true } });
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <>
      <Breadcrumbs crumbs={crumbs} />
      <PageHeader className="site-page-header" title={project.name} />
      <Typography.Title level={5}>Current Image:</Typography.Title>
      <Typography.Paragraph>{currentImage}</Typography.Paragraph>
      <Typography.Paragraph>
        Use the button below to upload a project image. This will replace any
        currently-set project image.
      </Typography.Paragraph>
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>
    </>
  );
}

function getBreadcrumbs(project) {
  return [
    {
      path: "/",
      breadcrumbName: "Projects",
    },
    {
      path: `/projects/${project.id}`,
      breadcrumbName: project.name,
    },
    {
      breadcrumbName: "image",
    },
  ];
}
