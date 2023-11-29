import { Types } from "ably";
import { Participant } from "./participant";
import PresenceMessage = Types.PresenceMessage;
import Message = Types.Message;

export type RoomEnterMessage = Omit<PresenceMessage, "data"> & {
  data: RoomEnterData;
};

type RoomEnterData = {
  roomId: string;
};

export type RoomExileMessage = Omit<Message, "data"> & {
  data: RoomExileData;
};

type RoomExileData = {
  roomId: string;
  clientId: string;
};

export type RoomSyncMessage = Omit<Message, "data"> & {
  data: RoomSyncData;
};

type RoomSyncData = {
  roomId: string;
  participants: Participant[];
};

export type RoomParticipantEnterMessage = Omit<Message, "data"> & {
  data: RoomParticipantEnterData;
};

type RoomParticipantEnterData = {
  roomId: string;
  participant: Participant;
};

export type RoomParticipantLeaveMessage = Omit<Message, "data"> & {
  data: RoomParticipantLeaveData;
};

type RoomParticipantLeaveData = {
  roomId: string;
  clientId: string;
};
