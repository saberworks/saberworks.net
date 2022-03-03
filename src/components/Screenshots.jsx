import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Divider,
  Image,
  message,
  Popconfirm,
  Space,
  Table,
  Tooltip,
  Typography,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import { projectPropTypes } from "@/lib/PropTypes";
import { dateFormat } from "@/lib/Util";
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

  const deleteScreenshot = async (screenshot) => {
    const genericError =
      "Error: Screenshot could not be deleted.  This is not your fault.";

    const deleteData = async () => {
      const data = await client.deleteScreenshot(projectId, screenshot.id);

      if (data.success) {
        message.success("Screenshot was deleted successfully.", 10);
        setScreenshots(screenshots.filter((s) => s.id !== screenshot.id));
      } else {
        message.error(genericError, 10);
      }
    };

    deleteData().catch((err) => {
      console.log(err);
      message.error(genericError, 10);
    });
  };

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
        columns={getScreenshotsTableColumns(projectId, deleteScreenshot)}
      />
    </>
  );
}

Screenshots.propTypes = projectPropTypes;

function getScreenshotsTableColumns(projectId, deleteScreenshot) {
  return [
    {
      title: "Image",
      dataIndex: "image",
      render: (image) => {
        return image ? <Image src={`${baseUrl}/${image}`} width="200px" /> : "";
      },
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      render: (created_at) => {
        return dateFormat(created_at);
      },
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (value, screenshot) => {
        return (
          <>
            <Space size="middle">
              <Tooltip title="Edit Screenshot" key="tt0">
                <Link
                  to={`/projects/${projectId}/screenshots/${screenshot.id}/edit`}
                >
                  <EditOutlined key="edit" />
                </Link>
              </Tooltip>
              <Tooltip title="Delete Screenshot" key="tt2">
                <Popconfirm
                  placement="top"
                  title={
                    <>
                      <p>Are you sure you want to delete this screenshot?</p>
                      <p>Screenshot Id: {screenshot.id}</p>
                      <p>
                        This action is{" "}
                        <span style={{ color: "orangered" }}>permanent</span>{" "}
                        and there is <em>no undo</em>.
                      </p>
                    </>
                  }
                  onConfirm={() => {
                    deleteScreenshot(screenshot);
                  }}
                  okText="Yes"
                  cancelText="No"
                >
                  <DeleteOutlined
                    key="delete"
                    twoToneColor="red"
                    style={{ color: "darkred" }}
                  />
                </Popconfirm>
              </Tooltip>
            </Space>
          </>
        );
      },
    },
  ];
}
