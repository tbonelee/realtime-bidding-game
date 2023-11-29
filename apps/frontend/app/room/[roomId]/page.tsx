"use client";

import { ParticipantsContainer } from "@/app/room/(participants)/participants-container";
import { GameInfoContainer } from "@/app/room/(game-info)/game-info-container";
import { CandidatesContainer } from "@/app/room/(candidates)/candidates-container";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Participant } from "lib/dto/participant";
import { Candidate } from "lib/dto/candidate";
import { Log } from "lib/dto/log";
import { useGlobalChannel } from "@/hook/use-global-channel";
import {
  RoomEnterMessage,
  RoomExileMessage,
  RoomParticipantEnterMessage,
  RoomSyncMessage,
} from "lib/dto/message";
import AblyClientProvider from "@/app/room/[roomId]/ably-client-provider";
import { useRoomChannel } from "@/hook/use-room-channel";
import { getClientId } from "@/lib/client-id-storage";
import {
  ROOM_CHANNEL_PARTICIPANT_ENTER_EVENT,
  ROOM_CHANNEL_ROOM_EXILE_EVENT,
  ROOM_CHANNEL_ROOM_SYNC_EVENT,
} from "lib/dto/event";

export default function RoomPage({ params }: { params: { roomId: string } }) {
  return (
    <AblyClientProvider>
      <_RoomPage params={params} />
    </AblyClientProvider>
  );
}

function _RoomPage({ params }: { params: { roomId: string } }) {
  const { channel: globalChannel } = useGlobalChannel();
  const { channel: roomChannel } = useRoomChannel({ roomId: params.roomId });

  const [participants, setParticipants] = useState<Participant[]>([]);

  const { data: candidates } = useQuery({
    queryKey: ["candidates"],
    queryFn: async () => {
      return await fetch("/api/candidates", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => data as Candidate[]);
    },
  });
  const { data: logs } = useQuery({
    queryKey: ["logs"],
    queryFn: async () => {
      return await fetch("/api/logs", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => data as Log[]);
    },
  });

  useEffect(() => {
    async function enterGlobalChannelForRoomThreadCreation() {
      const roomEnterData: RoomEnterMessage["data"] = {
        roomId: params.roomId,
      };
      await globalChannel.presence
        .enter(roomEnterData)
        .then(() => console.log(`enter global channel success`))
        .catch((err) => console.log("enter global channel failed", err));
    }

    async function initRoomChannel() {
      // 풀방시 추방 메시지 받기
      const onExileProm = roomChannel.subscribe(
        ROOM_CHANNEL_ROOM_EXILE_EVENT,
        (msg) => {
          const _msg = msg as RoomExileMessage;
          if (_msg.data.clientId === getClientId()) {
            // alert and redirect
            alert("방에서 추방되었습니다.");
            window.location.href = "/";
          }
        }
      );

      // 방 싱크 메시지 받기
      const onSyncPro = roomChannel.subscribe(
        ROOM_CHANNEL_ROOM_SYNC_EVENT,
        (msg) => {
          const _msg = msg as RoomSyncMessage;
          console.log("room sync message received", _msg.data);
          setParticipants(_msg.data.participants);
        }
      );

      // ROOM_CHANNEL_PARTICIPANT_ENTER_EVENT
      const onEnterProm = roomChannel.subscribe(
        ROOM_CHANNEL_PARTICIPANT_ENTER_EVENT,
        (msg) => {
          const _msg = msg as RoomParticipantEnterMessage;
          console.log("room enter message received", _msg.data);
        }
      );

      await Promise.all([onExileProm, onSyncPro, onEnterProm]);

      await roomChannel.presence
        .enter()
        .then(() => {
          roomChannel.presence;
        })
        .catch((err) =>
          console.log(`enter ${params.roomId} room channel failed`, err)
        );
    }

    Promise.all([enterGlobalChannelForRoomThreadCreation(), initRoomChannel()]);

    return () => {
      roomChannel.unsubscribe(ROOM_CHANNEL_ROOM_EXILE_EVENT);
      roomChannel.unsubscribe(ROOM_CHANNEL_ROOM_SYNC_EVENT);
      roomChannel.unsubscribe(ROOM_CHANNEL_PARTICIPANT_ENTER_EVENT);
      roomChannel.presence.leave();
    };
  }, [
    globalChannel.presence,
    params.roomId,
    roomChannel,
    roomChannel.presence,
  ]);

  const NUM_NOT_YET_AUCTIONED = 13;
  const NUM_FAILED_TO_AUCTION = 3;

  const [candidatesNotYetAuctioned, setCandidatesNotYetAuctioned] = useState<
    Candidate[]
  >([]);
  const [candidatesFailedToAuction, setCandidatesFailedToAuction] = useState<
    Candidate[]
  >([]);

  useEffect(() => {
    if (candidates === undefined) return;
    setCandidatesNotYetAuctioned(candidates.slice(0, NUM_NOT_YET_AUCTIONED));
    setCandidatesFailedToAuction(
      candidates.slice(
        NUM_NOT_YET_AUCTIONED,
        NUM_NOT_YET_AUCTIONED + NUM_FAILED_TO_AUCTION
      )
    );
  }, [candidates]);

  return (
    <div className={"grid h-full w-full grid-cols-8 grid-rows-1 gap-2"}>
      {participants && <ParticipantsContainer participants={participants} />}

      {logs && <GameInfoContainer logs={logs} />}

      <CandidatesContainer
        candidatesNotYetAuctioned={candidatesNotYetAuctioned}
        candidatesFailedToAuction={candidatesFailedToAuction}
      />
    </div>
  );
}
