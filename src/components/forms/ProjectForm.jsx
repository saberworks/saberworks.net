import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Checkbox, Form, Input, message, Spin, Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { HexColorPicker } from "react-colorful";
import PropTypes from "prop-types";

import { byGameOrder } from "@/lib/Util";
import { TagSetCheckBoxGroup } from "@/components/TagSetCheckBoxGroup";
import { saberworksApiClient as client } from "@/client/saberworks";

export function ProjectForm({ project, successMessage }) {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [projectId, setProjectId] = useState(null);
  const [color, setColor] = useState("#52A54E");
  const [gameOptions, setGameOptions] = useState([]); // available game options
  const [tagOptions, setTagOptions] = useState([]); // available tags
  const [tags, setTags] = useState({}); // currently selected tags
  const [selectedFile, setSelectedFile] = useState(null);
  const [initialValues, setInitialValues] = useState({});
  const [imageLabel, setImageLabel] = useState("Image");

  // if a project was passed in, gather values from it to set initial form
  // values
  useEffect(() => {
    if (project === undefined) return;
    if (Object.keys(project).length == 0) return;

    const initialValues = {
      name: project.name,
      description: project.description,
      games: selectedGamesFromProject(project.games),
    };

    const imageLabel = (
      <span>
        New Image&nbsp;
        <Tooltip title="If you choose a new image, it will replace the old one.">
          <QuestionCircleOutlined />
        </Tooltip>
      </span>
    );

    setProjectId(project.id);
    setTags(selectedTagsFromProject(project.tags));
    setColor(`#${project.accent_color}`);
    setImageLabel(imageLabel);
    setInitialValues(initialValues);
  }, [project]);

  // Download list of games
  useEffect(() => {
    const fetchData = async () => {
      const games = await client.getGames();

      // transform list of games into something the antd CheckboxGroup can use
      const wantedGames = games.map((game) => {
        return { label: game.name, value: game.id };
      });

      // Sort so the JK series shows up first and in order, with all other games
      // following in alphabetical order
      wantedGames.sort(byGameOrder);

      setGameOptions(wantedGames);
    };

    fetchData();
  }, []);

  // Download list of tags
  useEffect(() => {
    const fetchData = async () => {
      const tags = await client.getTags();

      setTagOptions(tags);
    };

    fetchData();
  }, []);

  const onFinish = async (values) => {
    const selectedColor = color ? color.substring(1) : "52A54E";
    const selectedTags = gatherSelectedTags(tags);

    const requestBody = {
      accent_color: selectedColor,
      tags: selectedTags,
      games: values.games,
      name: values.name,
      description: values.description,
    };

    let data;

    if (projectId) {
      data = await client.updateProjectWithImage(
        projectId,
        requestBody,
        selectedFile
      );
    } else {
      data = await client.addProjectWithImage(requestBody, selectedFile);
    }

    const newProjectId = data.project.id;

    message.success(successMessage);

    navigate(`/projects/${newProjectId}`);
  };

  const validateTags = async () => {
    const selectedTags = gatherSelectedTags(tags);

    if (selectedTags.length < 1) {
      return Promise.reject("Please select at least one tag.");
    }

    return Promise.resolve();
  };

  if (!(tagOptions.length && gameOptions.length)) {
    return <Spin></Spin>;
  }

  return (
    <Form
      initialValues={initialValues}
      layout="horizontal"
      form={form}
      onFinish={onFinish}
      labelCol={{ span: 2 }}
      wrapperCol={{ span: 10 }}
    >
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: "Please enter a Project Name." }]}
      >
        <Input placeholder="Project Name" maxLength={256}></Input>
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
        rules={[
          {
            required: true,
            message: "Please enter a Description of the project.",
          },
        ]}
      >
        <Input.TextArea
          showCount
          maxLength={8192}
          style={{ height: "12em" }}
        ></Input.TextArea>
      </Form.Item>

      <Form.Item name="image" label={imageLabel}>
        <Input
          type="file"
          value={selectedFile}
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />
      </Form.Item>

      <Form.Item label="Accent Color">
        <hr
          style={{
            backgroundColor: color,
            height: "6px",
            border: "0px",
            borderRadius: "2px",
          }}
        />

        <div className="color-picker-wrapper">
          <HexColorPicker
            color={color}
            className="saberworks-color-picker"
            onChange={setColor}
          />
        </div>

        <hr
          style={{
            backgroundColor: color,
            height: "6px",
            border: "0px",
            borderRadius: "2px",
          }}
        />
      </Form.Item>

      <Form.Item
        name="games"
        label="Game(s)"
        tooltip="Choose all that apply.  Something missing?  Contact me!."
        rules={[
          { required: true, message: "Please select at least one game." },
        ]}
      >
        <Checkbox.Group options={gameOptions} />
      </Form.Item>

      <Form.Item
        name="tags"
        label="Tags"
        tooltip="Choose all that apply.  You must select at least one."
        required={true}
        getValueFromEvent={setTags}
        rules={[{ validator: validateTags }]}
      >
        <TagSetCheckBoxGroup
          name="tags"
          tags={tags}
          setTags={setTags}
          tagOptions={tagOptions}
        />
      </Form.Item>

      <Form.Item name="submit" wrapperCol={{ offset: 2, span: 10 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}

ProjectForm.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    accent_color: PropTypes.string,
    games: PropTypes.array,
    tags: PropTypes.array,
    image: PropTypes.string,
  }),
  successMessage: PropTypes.string,
};

function gatherSelectedTags(tags) {
  const selectedTags = [];

  for (const tagType in tags) {
    for (const tag in tags[tagType]) {
      selectedTags.push(tags[tagType][tag]);
    }
  }

  return selectedTags;
}

function selectedGamesFromProject(games) {
  const selectedGames = [];

  for (const game of games) {
    selectedGames.push(game.id);
  }

  return selectedGames;
}

function selectedTagsFromProject(tags) {
  const selectedTags = {};

  for (const [, value] of Object.entries(tags)) {
    const tagType = value.type;

    if (selectedTags[tagType] === undefined) {
      selectedTags[tagType] = [];
    }

    selectedTags[tagType].push(value.id);
  }

  return selectedTags;
}
