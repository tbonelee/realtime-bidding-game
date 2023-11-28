import { MAX_PLAYERS } from "./constants";
import { RoomInfo } from "./dto/room-info";

export const isRoomFull = (room: RoomInfo) => {
  return room.players.length >= MAX_PLAYERS;
};
