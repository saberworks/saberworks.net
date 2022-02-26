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
    fetch("http://localhost/api/saberworks/games", {
      credentials: "include",
    })
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
    fetch("http://localhost/api/saberworks/tags", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => setTagOptions(data));
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

    // django requires csrftoken to be in the request headers; yank it out
    // of the cookie and put it in the headers
    const csrftoken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="))
      .split("=")[1];

    const response = await fetch("http://localhost/api/saberworks/projects", {
      method: "POST",
      cache: "no-cache",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

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
