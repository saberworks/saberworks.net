import React from "react";
import PropTypes from "prop-types";
import { Tag } from "antd";

import { byGameOrder } from "@/lib/Util";

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

  const wantedGames = games.map((game) => {
    return { ...game, label: game.name };
  });

  const sortedGames = wantedGames.sort(byGameOrder);

  const jsxList = [];

  for (const [index, game] of sortedGames.entries()) {
    jsxList.push(
      <Tag
        color={availableColors[index]}
        key={`game_${game.id}`}
        style={{ marginBottom: ".5em" }}
      >
        {game.name}
      </Tag>
    );
  }

  return <>{jsxList}</>;
}

Games.propTypes = {
  games: PropTypes.array.isRequired,
};
