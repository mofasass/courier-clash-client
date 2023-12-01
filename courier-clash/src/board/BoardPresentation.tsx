import React, { useEffect, useContext, useCallback } from "react";
import styled from "styled-components";
import { GameContext } from "../context/game-context";

const BoardDiv = styled.h1`
  height: 1000px;
  width: 1000px;
  background: #aaa;
  border: 1px solid #000;
`;

const Board = () => {
  const { gameTime, updateMovement } = useContext(GameContext);

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
      <BoardDiv></BoardDiv>
    </>
  );
};

export default Board;
