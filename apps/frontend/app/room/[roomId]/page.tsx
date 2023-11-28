"use client";

import { ParticipantsContainer } from "@/app/room/(participants)/participants-container";
import { GameInfoContainer } from "@/app/room/(game-info)/game-info-container";
import { CandidatesContainer } from "@/app/room/(candidates)/candidates-container";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Participant } from "lib/dto/participant";
import { Candidate } from "lib/dto/candidate";
import { Log } from "lib/dto/log";
import { useGlobalChannel } from "@/hook/use-global-room-channel";
import { RoomEnterMessage } from "lib/dto/message";
import AblyClientProvider from "@/app/room/[roomId]/ably-client-provider";

export default function RoomPage({ params }: { params: { roomId: string } }) {
  return (
    <AblyClientProvider>
      <_RoomPage params={params} />
    </AblyClientProvider>
  );
}

function _RoomPage({ params }: { params: { roomId: string } }) {
  console.log("room page", params);
  const { channel: globalChannel } = useGlobalChannel();

  const { data: participants } = useQuery({
    queryKey: ["participants"],
    queryFn: () => {
      return fetch("/api/participants", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => data as Participant[]);
    },
  });
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
    const roomEnterData: RoomEnterMessage["data"] = {
      roomId: params.roomId,
    };
    globalChannel;
    globalChannel.presence
      .enter(roomEnterData)
      .then(() => console.log("enter success"))
      .catch((err) => console.log("enter failed", err));
  }, []);

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
    <AblyClientProvider>
      <div className={"grid h-full w-full grid-cols-8 grid-rows-1 gap-2"}>
        {participants && <ParticipantsContainer participants={participants} />}

        {logs && <GameInfoContainer logs={logs} />}

        <CandidatesContainer
          candidatesNotYetAuctioned={candidatesNotYetAuctioned}
          candidatesFailedToAuction={candidatesFailedToAuction}
        />
      </div>
    </AblyClientProvider>
  );
}
