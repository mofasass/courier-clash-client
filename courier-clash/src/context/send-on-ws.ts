import type { Player } from "./game-context";
import WebSocket from "ws";

type wsPayload = {
  eventType: "playerJoined" | "playerMoved";
  player: Player;
};

export const sendOnWs =
  (ws: WebSocket, data: wsPayload) => (message: string) => {
    ws.send(JSON.stringify(data));
  };
