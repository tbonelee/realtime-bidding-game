"use client";

import { Participant } from "@/lib/dto/participant";

const Participant = ({ participant }: { participant: Participant }) => {
  return (
    <div className={"flex flex-col items-center justify-center"}>
      <div className={"text-base font-semibold"}>{participant.name}</div>
      <div className={"flex flex-row items-center justify-center"}>
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className={"h-8 w-8 rounded-full bg-gray-300"} />
        ))}
      </div>
    </div>
  );
};

export const ParticipantsContainer = ({
  participants,
}: {
  participants: Participant[];
}) => {
  return (
    <div className={"col-span-3"}>
      <div className={"text-2xl font-semibold"}>{"참가자 목록"}</div>
      <div className={"grid grid-rows-6 gap-2"}>
        {participants &&
          participants.map((participant) => (
            <Participant key={participant.id} participant={participant} />
          ))}
      </div>
    </div>
  );
};
