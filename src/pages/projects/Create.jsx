import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Checkbox, Form, Input, PageHeader } from "antd";
import { HexColorPicker } from "react-colorful";

import { Breadcrumbs } from "../../components/Breadcrumbs";
import { TagSetCheckBoxGroup } from "../../components/TagSetCheckBoxGroup";

const wantedGameOrder = [
  "Dark Forces",
  "Jedi Knight",
  "Mysteries of the Sith",
  "Jedi Outcast",
  "Jedi Academy",
];

export function Create() {
  const navigate = useNavigate();

  const [color, setColor] = useState("#F0F0F0");
  const [gameOptions, setGameOptions] = useState([]);
  const [tagOptions, setTagOptions] = useState([]); // stored tag options (what can be selected by user)
  const [tags, setTags] = useState({}); // stores selected tags

  const [form] = Form.useForm();

  const crumbs = getBreadcrumbs();

  // Download list of games
  useEffect(() => {
    fetch("http://localhost/api/saberworks/games")
      .then((response) => response.json())
      .then((data) => {
        const unsortedGames = data.map((game) => {
          return { label: game.name, value: game.id };
        });

        const games = unsortedGames.sort(byGameOrder);

        setGameOptions(games);
      });
  }, []);

  // Download list of tags
  useEffect(() => {
    fetch("http://localhost/api/saberworks/tags")
      .then((response) => response.json())
      .then((data) => setTagOptions(data));
  }, []);

  const onFinish = (values) => {
    console.log("FORM SUBMITTED");

    const selectedColor = color;
    const selectedTags = gatherSelectedTags(tags);

    console.log(`SELECTED COLOR: ${selectedColor}`);
    console.log(`selected tags: ${selectedTags}`);

    console.dir(values);

    // TODO: submit json like this:
    //
    // this is the json that must be sent
    // {
    //   "games": [],
    //   "tags": [],
    //   "name": "string",
    //   "description": "string",
    //   "accent_color": "string"
    // }

    // const project_id = 1234;
    // navigate(`/projects/${project_id}`);
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
      <PageHeader
        className="site-page-header"
        title="projects"
        subTitle="create"
      />
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
          <Input placeholder="Project Name"></Input>
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[
            {
              required: true,
              message: "Please select a Description of the project.",
            },
          ]}
        >
          <Input.TextArea></Input.TextArea>
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
      path: "/projects/create",
      breadcrumbName: "create",
    },
  ];
}

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
