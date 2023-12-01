import React, { useContext } from "react";
import styled from "styled-components";
import { GameContext } from "../context/game-context";

const BoardDiv = styled.h1`
  height: 1000px;
  width: 1000px;
  background: #aaa;
  border: 1px solid #000;
`;

const Board = () => {
  const { gameTime } = useContext(GameContext);

  return (
    <>
      <h2>Time left: {gameTime}</h2>
      <BoardDiv></BoardDiv>
    </>
  );
};

export default Board;
