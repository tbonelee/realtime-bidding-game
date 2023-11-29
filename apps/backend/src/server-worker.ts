import { workerData } from "worker_threads";
import { WorkerData } from "../lib/type/worker-data";
import Ably from "ably";
import { roomChannelName } from "lib/dto/channel";
import * as dotenv from "dotenv";
import * as fs from "fs";
import { getEnvFilePath } from "../lib/config";
import { Participant } from "lib/dto/participant";
import { MAX_PARTICIPANTS } from "lib/constants";
import {
  RoomExileMessage,
  RoomParticipantEnterMessage,
  RoomParticipantLeaveMessage,
  RoomSyncMessage,
} from "lib/dto/message";
import {
  ROOM_CHANNEL_PARTICIPANT_ENTER_EVENT,
  ROOM_CHANNEL_ROOM_EXILE_EVENT,
  ROOM_CHANNEL_ROOM_SYNC_EVENT,
} from "lib/dto/event";

const envConfig = dotenv.parse(fs.readFileSync(getEnvFilePath()));

const { roomId } = workerData as WorkerData;

const participantInfos: Participant[] = [];

function deleteParticipant(clientId: string) {
  const index = participantInfos.findIndex(
    (participantInfo) => participantInfo.id === clientId,
  );
  if (index === -1) {
    return;
  }
  participantInfos.splice(index, 1);
}

function getParticipant(clientId: string) {
  return participantInfos.find(
    (participantInfo) => participantInfo.id === clientId,
  );
}

function participantExists(clientId: string) {
  return getParticipant(clientId) !== undefined;
}

function addInitialarticipant(clientId: string) {
  participantInfos.push({
    id: clientId,
    items: {
      TOP: null,
      MID: null,
      BOTTOM: null,
      JUNGLE: null,
      SUPPORT: null,
    },
  });
}

const realtime = new Ably.Realtime.Promise({
  key: envConfig.ABLY_API_KEY,
  echoMessages: false,
});
const channel = realtime.channels.get(roomChannelName(roomId));

main();

async function main() {
  console.log(`worker for ${roomId} started`);

  const subscribeEnterProm = channel.presence.subscribe(
    "enter",
    async (member) => {
      console.log("enter", member);
      // 풀방 체크
      if (isRoomFull() && !participantExists(member.clientId)) {
        console.log("room is full");
        // TODO: send message to client
        const roomExileData: RoomExileMessage["data"] = {
          roomId,
          clientId: member.clientId,
        };
        await channel.publish(ROOM_CHANNEL_ROOM_EXILE_EVENT, roomExileData);

        return;
      }
      const participant = getParticipant(member.clientId);
      if (participant === undefined) {
        addInitialarticipant(member.clientId);
      }
      await publishRoomSyncMessage();
      if (isRoomFull()) {
        console.log("room is full");
        startGame();
        return;
      }
    },
  );

  const subscribeUpdateProm = channel.presence.subscribe(
    "update",

    async (member) => {
      console.log("update", member);
      // 풀방 체크
      if (isRoomFull() && !participantExists(member.clientId)) {
        console.log("room is full");
        // TODO: send message to client
        const roomExileData: RoomExileMessage["data"] = {
          roomId,
          clientId: member.clientId,
        };
        await channel.publish(ROOM_CHANNEL_ROOM_EXILE_EVENT, roomExileData);

        return;
      }
      const participant = getParticipant(member.clientId);
      if (participant === undefined) {
        addInitialarticipant(member.clientId);
      }
      await publishRoomParticipantEnterMessage(
        participant ?? {
          id: member.clientId,
          items: {
            TOP: null,
            MID: null,
            BOTTOM: null,
            JUNGLE: null,
            SUPPORT: null,
          },
        },
      );
      if (isRoomFull()) {
        console.log("room is full");
        startGame();
        return;
      }
    },
  );

  const subscribeLeaveProm = channel.presence.subscribe(
    "leave",
    async (member) => {
      console.log("leave", member);
      const participant = getParticipant(member.clientId);
      deleteParticipant(member.clientId);
      await publishRoomParticipantLeaveMessage(member.clientId);
    },
  );

  await Promise.all([
    subscribeEnterProm,
    subscribeLeaveProm,
    subscribeUpdateProm,
  ]);

  await syncParticipantsFromConnection();
}

async function syncParticipantsFromConnection() {
  const participants = await channel.presence.get();

  const clientIdToParticipantMap = new Map(
    participants.map((participant) => [participant.clientId, participant]),
  );

  const newParticipants = [...clientIdToParticipantMap.values()].filter(
    (participant) => !participantExists(participant.clientId),
  );

  console.log("newParticipants", newParticipants);
  newParticipants.forEach((participant) => {
    addInitialarticipant(participant.clientId);
  });

  await publishRoomSyncMessage();
}

async function syncParticipantsFromDb() {
  const syncData: RoomSyncMessage["data"] = {
    roomId,
    participants: participantInfos,
  };
  await channel.publish(ROOM_CHANNEL_ROOM_SYNC_EVENT, syncData);
}

async function publishRoomSyncMessage() {
  const roomSyncData: RoomSyncMessage["data"] = {
    roomId,
    participants: participantInfos,
  };
  await channel.publish(ROOM_CHANNEL_ROOM_SYNC_EVENT, roomSyncData);
}

async function publishRoomParticipantEnterMessage(participant: Participant) {
  const roomEnterData: RoomParticipantEnterMessage["data"] = {
    roomId,
    participant,
  };
  await channel.publish(ROOM_CHANNEL_PARTICIPANT_ENTER_EVENT, roomEnterData);
}

async function publishRoomParticipantLeaveMessage(clientId: string) {
  const roomEnterData: RoomParticipantLeaveMessage["data"] = {
    roomId,
    clientId,
  };
  await channel.publish(ROOM_CHANNEL_PARTICIPANT_ENTER_EVENT, roomEnterData);
}

function isRoomFull() {
  return Object.keys(participantInfos).length === MAX_PARTICIPANTS;
}

function startGame() {
  console.log("startGame");
}
