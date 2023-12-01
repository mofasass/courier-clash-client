import React, { useEffect, useContext, useCallback, useState } from "react";
import styled from "styled-components";
import { GameContext } from "../context/game-context";
import Player from "../player/PlayerPresentation";

const BoardDiv = styled.div`
  height: 1000px;
  width: 1000px;
  background: #aaa;
  border: 1px solid #000;
  position: absolute;
`;

const PackageDiv = styled.div<{ x: number; y: number }>`
  height: 10px;
  width: 10px;
  background: #000;
  border: 1px solid #000;
  position: relative;
  border-radius: 50%;

  transform: translate(-50%, -50%);
  left: ${({ x }) => x}px;
  top: ${({ y }) => y}px;
`;

const DropZoneDiv = styled.div<{ x: number; y: number }>`
  height: 100px;
  width: 100px;
  background: #000;
  border: 1px solid #000;
  position: relative;

  transform: translate(-50%, -50%);
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
          />
        ))}
        <PackageDiv x={currentPackage.x * 10} y={currentPackage.y * 10} />
        <DropZoneDiv x={dropZone.x * 10} y={dropZone.y * 10} />
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
