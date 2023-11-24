import { RoomInfo } from "@/lib/dto/room-info";
import { MAX_PLAYERS } from "@/lib/constants";

export const isRoomFull = (room: RoomInfo) => {
  return room.players.length >= MAX_PLAYERS;
};
