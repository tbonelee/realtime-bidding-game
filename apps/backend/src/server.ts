import * as fs from "fs";
import * as dotenv from "dotenv";
import express from "express";
import Ably from "ably";
import { GLOBAL_CHANNEL_NAME } from "lib/dto/channel";
import { GLOBAL_CHANNEL_ROOM_ENTER_EVENT } from "lib/dto/event";
import { RoomEnterMessage } from "lib/dto/message";
import { deleteRoom, roomExists } from "../dao/room-info";
import { Worker } from "worker_threads";
import { WorkerData } from "../lib/type/worker-data";
import { getEnvFilePath } from "../lib/config";

const envConfig = dotenv.parse(fs.readFileSync(getEnvFilePath()));

console.log("envConfig", envConfig);

const realtime = new Ably.Realtime.Promise({
  key: envConfig.ABLY_API_KEY,
  echoMessages: false,
});

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3001, () => {
  console.log("Example app listening on port 3000!");
});

const isRoomEnterMessage = (data: unknown): data is RoomEnterMessage => {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof (data as RoomEnterMessage).data === "object" &&
    (data as RoomEnterMessage).data !== null &&
    typeof (data as RoomEnterMessage).data.roomId === "string" &&
    typeof (data as RoomEnterMessage).data.userId === "string"
  );
};

function generateNewRoomThread(roomId: string) {
  if (roomExists(roomId) === true) {
    return;
  }

  const workerData: WorkerData = {
    roomId,
  };
  const worker = new Worker("./server-worker", {
    workerData,
  });
  console.log(`worker for ${roomId} created`);

  worker.on("error", (error) => {
    // TODO: error시 방 재생성 또는 참여자 alert
    console.error(`worker for ${roomId} error`, error);
  });

  worker.on("message", (message) => {
    console.log(`worker for ${roomId} message`, message);
  });

  worker.on("exit", (code) => {
    console.log(`worker for ${roomId} exit`, code);
    if (code !== 0) {
      console.log(`worker stopped with exit code ${code}`);
    }
    deleteRoom(roomId);
  });
}

const init = async () => {
  const channel = realtime.channels.get(GLOBAL_CHANNEL_NAME);
  channel
    .subscribe(GLOBAL_CHANNEL_ROOM_ENTER_EVENT, (message) => {
      if (isRoomEnterMessage(message) === false) {
        return;
      }
      const {
        clientId,
        data: { roomId, userId },
      } = message;

      if (roomExists(roomId) === true) {
        return;
      }

      generateNewRoomThread(roomId);
    })
    .then(() => {
      console.log("subscribe success");
    });
};

init();
