import React, { createContext, useState } from "react";
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
  updateMovement: (direction: "up" | "down" | "left" | "right") => void;
  currentPackage: { x: number; y: number };
  dropZone: { x: number; y: number };
};
//@ts-ignore
export const GameContext = createContext<GameContextType>({ players: [] });

//@ts-ignore
export const GameProvider = ({ children }) => {
  const ws = new WebSocket("ws://courier-clash-hub.azurewebsites.net/ws");

  ws.addEventListener("gameStatus", (data) => {
    const wsData = parseWsMessage({ eventType: "gameStatus", data });

    switch (wsData.eventType) {
      case "gameStatus":
        setGameTime(wsData.gameTime);
        setPlayers(wsData.players);
        setCurrentPackage(wsData.currentPackage);
        setDropZone(wsData.dropZone);
        break;
    }
  });

  const [currentPlayer, setCurrentPlayer] = useState<Player | undefined>(
    undefined
  );
  const [dropZone, setDropZone] = useState<{ x: number; y: number }>({
    x: 25,
    y: 25,
  });
  const [currentPackage, setCurrentPackage] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  const [players, setPlayers] = React.useState<Player[]>([
    {
      id: "1",
      color: "red",
      score: 27,
      name: "test",
      gameData: {
        position: { x: 1, y: 2 },
        direction: "down",
        hasPackage: false,
      },
    },
    {
      id: "2",
      color: "blue",
      score: 27,
      name: "test",
      gameData: {
        position: { x: 55, y: 55 },
        direction: "left",
        hasPackage: true,
      },
    },
  ]);
  const [gameTime, setGameTime] = React.useState<number>(0);

  const createPlayer = (name: string) => {
    const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;

    const playerObject: Partial<Player> = {
      id: uuidv4(),
      name,
      color,
    };

    ws.send(JSON.stringify({ eventType: "createPlayer", playerObject }));
  };

  const updateMovement = (direction: "up" | "down" | "left" | "right") => {
    const playerId = currentPlayer?.id;
    if (playerId) {
      console.log("sending movement to server");
      ws.send(
        JSON.stringify({ eventType: "createPlayer", playerId, direction })
      );
    } else {
      console.log("no player id, won't send movement to server");
    }
  };

  return (
    <GameContext.Provider
      value={{
        players,
        createPlayer,
        gameTime,
        updateMovement,
        currentPackage,
        dropZone,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
