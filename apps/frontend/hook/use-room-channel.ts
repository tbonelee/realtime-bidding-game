import { useChannel } from "ably/react";
import { roomChannelName } from "lib/dto/channel";

export const useRoomChannel = ({ roomId }: { roomId: string }) => {
  return useChannel(roomChannelName(roomId));
};
