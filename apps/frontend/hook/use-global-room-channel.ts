import { useChannel } from "ably/react";
import { GLOBAL_CHANNEL_NAME } from "lib/dto/channel";

console.log("useChannel", useChannel, GLOBAL_CHANNEL_NAME);

export const useGlobalChannel = () => {
  return useChannel(GLOBAL_CHANNEL_NAME);
};
