import React, { useEffect, useState } from "react";
import { Divider, Image, Table, Typography } from "antd";

import { projectPropTypes } from "@/lib/PropTypes";
import { ImageUpload } from "@/components/ImageUpload";
import { baseUrl, saberworksApiClient as client } from "@/client/saberworks";

export function Screenshots({ project }) {
  const projectId = project.id;

  const [shouldReloadScreenshots, setShouldReloadScreenshots] = useState(true);
  const [screenshots, setScreenshots] = useState([]);

  const onUploadSuccess = function () {
    setShouldReloadScreenshots(true);
  };

  // Download list of screenshots
  useEffect(() => {
    if (!shouldReloadScreenshots) return;

    const fetchData = async () => {
      let screenshots = [];

      try {
        screenshots = await client.getScreenshots(projectId);
      } catch (error) {
        // it's ok, probably just a 404
      }

      setScreenshots(screenshots);
      setShouldReloadScreenshots(false);
    };

    fetchData();
  }, [shouldReloadScreenshots]);

  const imageUploadActionUrl = `${baseUrl}/api/saberworks/projects/${projectId}/screenshots`;

  return (
    <>
      <Typography.Title level={4}>Add an Image</Typography.Title>
      <Typography.Paragraph>
        Your project page has an &quot;images&quot; section, anything you upload
        here will be visible there. (any image related to your project is ok!)
      </Typography.Paragraph>
      <ImageUpload
        instructions="Please upload a png, jpg, gif, or svg file."
        actionUrl={imageUploadActionUrl}
        successMessage="The screenshot was uploaded successfully."
        onSuccess={onUploadSuccess}
      />

      <Divider />

      <Typography.Title level={4}>All Images</Typography.Title>
      <Table
        rowKey="id"
        dataSource={[...screenshots]}
        columns={getScreenshotsTableColumns()}
      />
    </>
  );
}

Screenshots.propTypes = projectPropTypes;

function getScreenshotsTableColumns() {
  return [
    {
      title: "Image",
      dataIndex: "image",
      render: (image) => {
        return image ? <Image src={`${baseUrl}/${image}`} width="200px" /> : "";
      },
    },
  ];
}
