"use client";

import { MAX_POINTS } from "lib/constants";
import { CandidateLine, Lines } from "lib/dto/candidate";
import { Participant } from "lib/dto/participant";
import Image from "next/image";

const Item = ({
  name,
  imgUrl,
  line,
}: {
  name: string;
  imgUrl: string;
  line: CandidateLine;
}) => {
  return (
    <div className={"flex flex-col items-center justify-center"}>
      <div className={"text-base font-semibold"}>{line}</div>
      <Image
        src={imgUrl}
        width={64}
        height={64}
        alt={name}
        className={"h-16 w-16 rounded-md"}
      />
      {name.length > 6 ? (
        <div className={"text-base font-semibold"}>
          {name.substring(0, 10) + "..."}
        </div>
      ) : (
        <div className={"text-base font-semibold"}>{name}</div>
      )}
    </div>
  );
};

const EmptyItem = ({ line }: { line: CandidateLine }) => {
  return (
    <div className={"flex flex-col items-center justify-center"}>
      <div className={"text-base font-semibold"}>{line}</div>
      <Image
        src={"https://picsum.photos/64/64"}
        width={64}
        height={64}
        alt={"X"}
        className={"h-16 w-16 rounded-md opacity-0"}
      />
      <div className={"text-base font-semibold opacity-0"}>{"X"}</div>
    </div>
  );
};

const ParticipantBox = ({ participant }: { participant: Participant }) => {
  const pointsLeft =
    MAX_POINTS -
    Object.values(participant.items).reduce(
      (acc, cur) => acc + (cur?.bidAmount ?? 0),
      0
    );

  return (
    <div
      className={
        "row-span-1 grid grid-cols-1 grid-rows-6 items-center justify-center rounded-lg border-2 border-gray-300"
      }
    >
      <div
        // center text
        className={
          "col-span-1 row-span-1 mt-3 grid grid-cols-6 grid-rows-1 items-center justify-center text-2xl font-semibold"
        }
      >
        {/*{participant.name}*/}

        {/*name on left*/}
        <div className={"col-span-3 row-span-1 m-6 text-left"}>
          {participant.id}
        </div>
        {/*points on right*/}
        <div className={"col-span-3 row-span-1 m-6 text-right"}>
          {pointsLeft}
          {" points"}
        </div>
      </div>
      <div
        className={
          "col-span-1 row-span-5 grid grid-cols-5 gap-2 text-base font-semibold"
        }
      >
        {Lines.map((line) => {
          const slot = participant.items[line];

          return slot === null ? (
            <EmptyItem key={line} line={line as CandidateLine} />
          ) : (
            <Item
              key={line}
              line={line as CandidateLine}
              name={slot.candidate.name}
              imgUrl={slot.candidate.imgUrl}
            />
          );
        })}
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
    <div className={"col-span-3 row-span-1 m-2"}>
      <div className={"grid h-full w-full grid-rows-6 gap-2"}>
        {participants &&
          participants.map((participant) => (
            <ParticipantBox key={participant.id} participant={participant} />
          ))}
      </div>
    </div>
  );
};
