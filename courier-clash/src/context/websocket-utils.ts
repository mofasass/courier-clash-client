import type { Player } from "./game-context";

type playerJoined = {
  eventType: "playerJoined";
  player: Player;
};

type GameStatus = {
  eventType: "gameStatus";
  gameTime: number;
  players: Player[];
  currentPackage: { x: number; y: number };
  dropZone: { x: number; y: number };
};

type wsPayloads = playerJoined | GameStatus;

export const sendOnWs =
  (ws: WebSocket, data: wsPayloads) => (message: string) => {
    ws.send(JSON.stringify(data));
  };

export const parseWsMessage = (message: any) => {
  return JSON.parse(message.toString()) as wsPayloads;
};
