export const GLOBAL_CHANNEL_NAME = "global";

const ROOM_CHANNEL_PREFIX = "room";

export const roomChannelName = (roomId: string) => {
  return `${ROOM_CHANNEL_PREFIX}:${roomId}`;
};
