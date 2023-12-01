import React, { createContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { BOARD_X } from "../board/config";
import { parseWsMessage, sendOnWs } from "./websocket-utils";

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
};
//@ts-ignore
export const GameContext = createContext<GameContextType>({ players: [] });

//@ts-ignore
export const GameProvider = ({ children }) => {
  const ws = new WebSocket("ws://courier-clash-hub.azurewebsites.net/clashHub");

  ws.addEventListener("message", function message(data) {
    const wsData = parseWsMessage(data);

    switch (wsData.eventType) {
      case "gameStatus":
        setGameTime(wsData.gameTime);
        break;
    }
  });

  const [players, setPlayers] = React.useState<Player[]>([]);
  const [gameTime, setGameTime] = React.useState<number>(0);

  const createPlayer = (name: string) => {
    const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;

    const playerObject: Player = {
      id: uuidv4(),
      name,
      color,
      score: 0,
      gameData: {
        position: {
          x: Math.floor(Math.random() * BOARD_X) + 1,
          y: 0,
        },
        direction: "down",
        hasPackage: false,
      },
    };

    setPlayers([...players, playerObject]);

    sendOnWs(ws, { eventType: "playerJoined", player: playerObject });
  };

  return (
    <GameContext.Provider value={{ players, createPlayer, gameTime }}>
      {children}
    </GameContext.Provider>
  );
};
