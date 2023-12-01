import React, { createContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { BOARD_X } from "../board/config";
import { parseWsMessage, sendOnWs } from "./websocket-utils";
import { io } from "socket.io-client";

export type Player = {
  id: string;
  name: string;
  color: string;
  score: number;
  gameData: {
    position: {
      x: number;
      y: number;
    };
    direction: "up" | "down" | "left" | "right";
    hasPackage: boolean;
  };
};

type GameContextType = {
  players: Player[];
  gameTime: number;
  createPlayer: (name: string) => void;
  updateMovement: (direction: "up" | "down" | "left" | "right") => void;
};
//@ts-ignore
export const GameContext = createContext<GameContextType>({ players: [] });

//@ts-ignore
export const GameProvider = ({ children }) => {
  const ws = io("ws://courier-clash-hub.azurewebsites.net/clashHub");

  ws.onAny((event, ...data) => {
    const wsData = parseWsMessage({ eventType: event, data });

    switch (wsData.eventType) {
      case "gameStatus":
        setGameTime(wsData.gameTime);
        setPlayers(wsData.players);
        break;
    }
  });

  const [currentPlayer, setCurrentPlayer] = React.useState<Player | undefined>(
    undefined
  );
  const [players, setPlayers] = React.useState<Player[]>([]);
  const [gameTime, setGameTime] = React.useState<number>(0);

  const createPlayer = (name: string) => {
    const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;

    const playerObject: Partial<Player> = {
      id: uuidv4(),
      name,
      color,
    };

    ws.emit("createPlayer", playerObject);
  };

  const updateMovement = (direction: "up" | "down" | "left" | "right") => {
    ws.emit("updateMovement", { playerId, direction });
  };

  return (
    <GameContext.Provider
      value={{ players, createPlayer, gameTime, updateMovement }}
    >
      {children}
    </GameContext.Provider>
  );
};
