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
  const {
    gameTime,
    updateMovement,
    createPlayer,
    players,
    currentPackage,
    dropZone,
  } = useContext(GameContext);
  const [username, setUsername] = useState("");

  const setUpListener = useCallback((e: any) => {
    if (
      ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1
    ) {
      e.preventDefault();
      updateMovement(e.code.replace("Arrow", "").toLowerCase());
    }
  }, []);

  // Set up arrow key listener
  useEffect(() => {
    window.addEventListener("keydown", setUpListener);

    return () => {
      window.removeEventListener("keydown", setUpListener);
    };
  }, []);

  return (
    <>
      <h2>Ticks left: {gameTime}</h2>
      <BoardDiv>
        {players.map((p) => (
          <Player
            color={p.color}
            x={p.gameData.position.x}
            y={p.gameData.position.y}
            direction={p.gameData.direction}
            hasPackage={p.gameData.hasPackage}
            name={p.name}
          />
        ))}
        <PackageDiv x={currentPackage.x * 5} y={currentPackage.y * 5} />
        <DropZoneDiv x={dropZone.x * 5} y={dropZone.y * 5} />
      </BoardDiv>
      <input onChange={(e) => setUsername(e.target.value)} />
      <button
        onClick={(e) => {
          e.preventDefault();
          createPlayer(username);
        }}
      >
        Button
      </button>
    </>
  );
};

export default Board;
