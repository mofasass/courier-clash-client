import React, { useEffect, useContext, useCallback, useState } from "react";
import styled from "styled-components";
import { GameContext } from "../context/game-context";
import Player from "../player/PlayerPresentation";
import Gray from "../pic/Gray.png";
import Box from "../pic/box.png";

const BoardDiv = styled.div`
  height: 1000px;
  width: 1000px;
  background: url(${Gray});
  border: 1px solid #000;
  position: relative;
`;

const PackageDiv = styled.div<{ x: number; y: number }>`
  height: 20px;
  width: 20px;
  background: url(${Box}) no-repeat;
  background-size: contain;

  position: absolute;
  left: ${({ x }) => x}px;
  top: ${({ y }) => y}px;
`;

const DropZoneDiv = styled.div<{ x: number; y: number }>`
  height: 100px;
  width: 100px;
  border: 2px dashed #000;
  position: absolute;
  left: ${({ x }) => x}px;
  top: ${({ y }) => y}px;
`;

const Board = () => {
  const { gameTime, createPlayer, players, currentPackage, dropZone } =
    useContext(GameContext);
  const [username, setUsername] = useState("");

  return (
    <>
      <h2>Ticks left: {gameTime}</h2>
      <BoardDiv>
        {players.map((p) => (
          <Player
            key={p.name + p.color + p.id}
            color={p.color}
            x={p.gameData.position.x}
            y={p.gameData.position.y}
            direction={p.gameData.Direction}
            hasPackage={p.gameData.HasPackage}
            name={p.name}
          />
        ))}
        <PackageDiv x={currentPackage.x * 5} y={currentPackage.y * 5} />
        <DropZoneDiv x={dropZone.x * 5} y={dropZone.y * 5} />
      </BoardDiv>
      <input onChange={(e) => setUsername(e.target.value)} />
      <button
        onClick={async (e) => {
          e.preventDefault();
          console.log("setting playerId to ", username);
          await createPlayer(username);
        }}
      >
        JOIN
      </button>
    </>
  );
};

export default Board;
