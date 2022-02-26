import React from "react";
import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";

export function Breadcrumbs({ crumbs }) {
  return getBreadcrumbs(crumbs);
}

// Example parameter:
//
// const crumbs = [
//     {
//       path: "/",
//       breadcrumbName: "Dashboard",
//     },
//     {
//       path: "/projects",
//       breadcrumbName: "Projects",
//     },
//     {
//       path: `/projects/${idStr}`,
//       breadcrumbName: `Project ${idStr}`,
//     },
//     {
//       path: `/projects/${idStr}/edit`,
//       breadcrumbName: "edit",
//     },
//   ];
//
// This function takes a list of crumbs like the example above.
function getBreadcrumbs(crumbs) {
  if (!crumbs) {
    return <></>;
  }

  return (
    <Breadcrumb style={{ paddingTop: "1em" }}>
      {crumbs.map((crumb) => {
        return (
          <Breadcrumb.Item key={crumb.path ? crumb.path : "foofoofoo"}>
            {crumb.path ? (
              <Link to={crumb.path}>{crumb.breadcrumbName}</Link>
            ) : (
              crumb.breadcrumbName
            )}
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
}
