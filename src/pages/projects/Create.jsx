import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Checkbox, Form, Input, PageHeader } from "antd";
import { HexColorPicker } from "react-colorful";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { TagSetCheckBoxGroup } from "@/components/TagSetCheckBoxGroup";
import { saberworksApiClient as client } from "@/client/saberworks";

export function Create() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const crumbs = getBreadcrumbs();

  const [color, setColor] = useState("#F0F0F0");

  // stores available games from which the user can select
  const [gameOptions, setGameOptions] = useState([]);

  // stores available tags from which the user can select
  const [tagOptions, setTagOptions] = useState([]);

  // stores a list of tags actually selected by the user
  const [tags, setTags] = useState({});

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
    const selectedColor = color ? color.substring(1) : "FFFFFF";
    const selectedTags = gatherSelectedTags(tags);

    const requestBody = {
      accent_color: selectedColor,
      tags: selectedTags,
      games: values.games,
      name: values.name,
      description: values.description,
    };

    const data = await client.addProject(requestBody);

    const projectId = data.project.id;

    navigate(`/projects/${projectId}`, { state: { justCreated: true } });
  };

  const handleColorChange = (color) => {
    setColor(color);
  };

  const validateTags = async () => {
    const selectedTags = gatherSelectedTags(tags);

    if (selectedTags.length < 1) {
      return Promise.reject("Please select at least one tag.");
    }

    return Promise.resolve();
  };

  // the <hr> is styled with the selected accent color so user can see how
  // it will look on the background
  const hrStyle = {
    backgroundColor: color,
    height: "6px",
    border: "0px",
  };

  return (
    <>
      <Breadcrumbs crumbs={crumbs} />
      <PageHeader className="site-page-header" title="Create Project" />
      <Form
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

        <Form.Item label="Accent Color">
          <hr noshade="true" style={hrStyle} />

          <div className="color-picker-wrapper">
            <HexColorPicker
              className="saberworks-color-picker"
              onChange={handleColorChange}
            />
          </div>
          <hr noshade="true" style={hrStyle} />
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
            className="color-picker-wrapper"
          />
        </Form.Item>

        <Form.Item name="submit" wrapperCol={{ offset: 2, span: 10 }}>
          <Button type="primary" htmlType="submit">
            Next
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

function getBreadcrumbs() {
  return [
    {
      path: "/",
      breadcrumbName: "Dashboard",
    },
    {
      path: "/projects",
      breadcrumbName: "Projects",
    },
    {
      breadcrumbName: "create",
    },
  ];
}

const wantedGameOrder = [
  "Dark Forces",
  "Jedi Knight",
  "Mysteries of the Sith",
  "Jedi Outcast",
  "Jedi Academy",
];

// Sort JK series in order of release first, then any other games in
// alphabetical order.
function byGameOrder(a, b) {
  let aSort = wantedGameOrder.indexOf(a.label);
  let bSort = wantedGameOrder.indexOf(b.label);

  if (aSort == -1) {
    aSort += 9999;
  }

  if (bSort == -1) {
    bSort += 9999;
  }

  if (aSort == bSort) {
    return a.label < b.label ? -1 : 1;
  }

  return aSort - bSort;
}

function gatherSelectedTags(tags) {
  const selectedTags = [];

  for (const tagType in tags) {
    for (const tag in tags[tagType]) {
      selectedTags.push(tags[tagType][tag]);
    }
  }

  return selectedTags;
}
