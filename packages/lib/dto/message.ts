import { Types } from "ably";
import PresenceMessage = Types.PresenceMessage;

export type RoomEnterMessage = Omit<PresenceMessage, "data"> & {
  data: RoomEnterData;
};

type RoomEnterData = {
  roomId: string;
};
