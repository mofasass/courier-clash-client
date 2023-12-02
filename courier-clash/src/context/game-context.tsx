import React, { createContext, useEffect, useState } from "react";
import { HttpTransportType, HubConnectionBuilder } from "@microsoft/signalr";

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
    Direction: "up" | "down" | "left" | "right";
    HasPackage: boolean;
  };
};

type GameContextType = {
  players: Player[];
  gameTime: number;
  createPlayer: (name: string) => void;
  currentPackage: { x: number; y: number };
  dropZone: { x: number; y: number };
};
//@ts-ignore
export const GameContext = createContext<GameContextType>({ players: [] });

//@ts-ignore
export const GameProvider = ({ children }) => {
  const [playerId, setPlayerId] = useState("");

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:7195/hub", {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  const [connection, setConnection] = useState<any>(null);

  const handleKeyDown = (event: KeyboardEvent) => {
    let newDirection: "up" | "down" | "left" | "right" = "up";
    // Check which arrow key is pressed
    switch (event.key) {
      case "ArrowUp":
        newDirection = "up";
        console.log("pressing up");
        break;
      case "ArrowDown":
        newDirection = "down";
        console.log("pressing down");
        break;
      case "ArrowLeft":
        newDirection = "left";
        console.log("pressing left");
        break;
      case "ArrowRight":
        newDirection = "right";
        console.log("pressing right");
        break;
      default:
        return;
    }

    updateMovement(newDirection);
  };

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          connection.on("messageReceived", (message: any) => {
            setPlayers(message.players);
          });
        })
        .catch((e: any) => console.log("Connection failed: ", e));
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [connection]);

  const [dropZone, setDropZone] = useState<{ x: number; y: number }>({
    x: 25,
    y: 25,
  });
  const [currentPackage, setCurrentPackage] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  const [players, setPlayers] = React.useState<Player[]>([]);
  const [gameTime, setGameTime] = React.useState<number>(0);

  useEffect(() => {
    const randomId = Math.floor(Math.random() * 10000).toString();
    setPlayerId(randomId);
    console.log("randomId is ", randomId);
  }, []);

  const sendMessage = async (message: string) => {
    try {
      if (connection) {
        console.log("playerId before sending is ", playerId);
        await connection.invoke("NewMessage", playerId, message);
      } else {
        console.error("connection is null");
      }
    } catch (error) {
      console.error(error);
    }
    console.log("message sent!");
  };

  const createPlayer = async (name: string) => {
    const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;

    const playerObject: Partial<Player> = {
      id: playerId,
      name,
      color,
    };

    try {
      await sendMessage(
        JSON.stringify({ eventType: "createPlayer", playerObject })
      );
    } catch (error) {
      console.error("Error creating player:", error);
    }
  };

  const updateMovement = (direction: "up" | "down" | "left" | "right") => {
    sendMessage(
      JSON.stringify({
        eventType: "updateMovement",
        playerId: connection.connectionId,
        direction,
      })
    );
  };

  return (
    <GameContext.Provider
      value={{
        players,
        createPlayer,
        gameTime,
        currentPackage,
        dropZone,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
