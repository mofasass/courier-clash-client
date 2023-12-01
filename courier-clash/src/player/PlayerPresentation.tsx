import React from "react";
import styled from "styled-components";
import Char from "../pic/char.png";

const PlayerDiv = styled.div<{ x: number; y: number }>`
  height: 20px;
  width: 20px;
  position: absolute;
  background: url(${Char}) no-repeat;
  background-size: contain;

  left: ${({ x }) => x}px;
  top: ${({ y }) => 1000 - y}px;
`;

const PlayerLabel = styled.div<{ hasPackage: boolean }>`
  position: absolute;
  top: -20px;
  left: 0;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  color: ${({ hasPackage }) => (hasPackage ? "red" : "black")};
`;

type PlayerProps = {
  color: string;
  x: number;
  y: number;
  direction: "up" | "down" | "left" | "right";
  hasPackage: boolean;
  name: string;
};

const Player = ({ name, hasPackage, color, x, y }: PlayerProps) => {
  return (
    <PlayerDiv x={x * 5} y={y * 5}>
      <PlayerLabel hasPackage={hasPackage}>{name}</PlayerLabel>
    </PlayerDiv>
  );
};

export default Player;
