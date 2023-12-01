import React, { createContext } from "react";
import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { BOARD_X } from "../board/config";
import { sendOnWs } from "./send-on-ws";



export type Player = {
  id: string;
  name: string;
  color: string;
  score: number;
  gameData: {
    position: {
      x: number;
      y: number;
    },
    direction: 'up' | 'down' | 'left' | 'right';
    hasPackage: boolean;
  };
};

type GameContextType = {
  players: Player[];
  createPlayer: (name: string) => void;
};

export const GameContext = createContext<GameContextType>({ players: [] });

//@ts-ignore
export const GameProvider = ({ children }) => {
  const ws = new WebSocket('ws://www.host.com/path');

  ws.on('error', console.error);

  ws.on('open', function open() {
    ws.send('something');
  });
  
  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  const [players, setPlayers] = React.useState<Player[]>([]);


  const createPlayer = (name: string) => {
    const color =  `#${Math.floor(Math.random()*16777215).toString(16)}`;

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
        direction: 'down',
        hasPackage: false,
      },
    };

    setPlayers([...players, playerObject])

    sendOnWs(ws, { eventType: 'playerJoined', player: playerObject });
    
  }

  return (
    <GameContext.Provider value={{ players, createPlayer }}>{children}</GameContext.Provider>
  );
};
