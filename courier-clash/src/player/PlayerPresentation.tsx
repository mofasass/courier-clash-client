import React from "react";
import styled from "styled-components";

const PlayerDiv = styled.div<{ color: string; x: number; y: number }>`
  height: 10px;
  width: 10px;
  position: relative;
  background: ${({ color }) => color};
  left: ${({ x }) => x}px;
  top: ${({ y }) => 1000 - y}px;
  transform: translate(-50%, -50%);
`;

type PlayerProps = {
  color: string;
  x: number;
  y: number;
};

const Player = ({ color, x, y }: PlayerProps) => {
  return <PlayerDiv color={color} x={x * 10} y={y * 10} />;
};

export default Player;
