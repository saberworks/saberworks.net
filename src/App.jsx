import React from "react";
import "./App.css";
import { Layout } from "antd";
import { Routes, Route, BrowserRouter } from "react-router-dom";
const { Header, Footer, Content } = Layout;

import { Home } from "@/pages/Home";
import { Create as ProjectCreate } from "@/pages/projects/Create";
import { Edit as ProjectEdit } from "@/pages/projects/Edit";
import { View as ProjectView } from "@/pages/projects/View";
import { Image as ProjectImage } from "@/pages/projects/Image";

import { Edit as PostEdit } from "@/pages/posts/Edit";

function App() {
  return (
    <Layout>
      <Header>
        <div>
          <h1 className="saberworks-logo">saberworks.net</h1>
        </div>
      </Header>
      <Content>
        <p className="motto">project pages for everyone</p>

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects/create" element={<ProjectCreate />} />
            <Route path="/projects/:projectId" element={<ProjectView />} />
            <Route path="/projects/:projectId/:tab" element={<ProjectView />} />
            <Route path="/projects/:projectId/edit" element={<ProjectEdit />} />
            <Route
              path="/projects/:projectId/image"
              element={<ProjectImage />}
            />
            <Route
              path="/projects/:projectId/posts/:postId/edit"
              element={<PostEdit />}
            />

            <Route
              path="*"
              element={
                <main style={{ padding: "1rem" }}>
                  <p>404 Not Found</p>
                </main>
              }
            />
          </Routes>
        </BrowserRouter>
      </Content>
      <Footer>
        Copyright &copy; 2022{" "}
        <a href="https://www.massassi.net/">The Massassi Temple</a>
      </Footer>
    </Layout>
  );
}

export default App;
