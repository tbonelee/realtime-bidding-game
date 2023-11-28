import { RoomInfo } from "lib/dto/room-info";

const roomInfos: Record<string, RoomInfo> = {};

export const roomExists = (roomId: string) => {
  return !!roomInfos[roomId];
};

export const createRoom = (roomId: string, roomInfo: RoomInfo) => {
  roomInfos[roomId] = roomInfo;
};

export const getRoom = (roomId: string) => {
  return roomInfos[roomId];
};

export const deleteRoom = (roomId: string) => {
  delete roomInfos[roomId];
};
