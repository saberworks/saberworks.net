import React from "react";
import PropTypes from "prop-types";
import { Tag } from "antd";

const availableColors = [
  "blue",
  "cyan",
  "geekblue",
  "gold",
  "green",
  "lime",
  "magenta",
  "orange",
  "purple",
  "red",
  "volcano",
];

export function Games({ games }) {
  if (!(Array.isArray(games) && games.length > 0)) return <></>;

  const jsxList = [];

  for (const [index, game] of games.entries()) {
    jsxList.push(
      <Tag color={availableColors[index]} key={`game_${game.id}`}>
        {game.name}
      </Tag>
    );
  }

  return <>{jsxList}</>;
}

Games.propTypes = {
  games: PropTypes.array.isRequired,
};
