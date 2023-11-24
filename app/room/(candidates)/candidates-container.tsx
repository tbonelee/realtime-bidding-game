"use client";
import { Candidate } from "@/lib/dto/candidate";
import Image from "next/image";
import { useEffect, useState } from "react";

const Candidate = ({ candidate }: { candidate: Candidate }) => {
  return (
    <div className={"flex items-center justify-center"}>
      <div className={"flex flex-col items-center justify-center"}>
        <div className={"flex items-center justify-center"}>
          <Image
            src={candidate.imgUrl}
            width={64}
            height={64}
            alt={candidate.name}
            className={"h-16 w-16 rounded-md"}
          />
        </div>
        {candidate.name.length > 6 ? (
          <div className={"text-base font-semibold"}>
            {candidate.name.substring(0, 10) + "..."}
          </div>
        ) : (
          <div className={"text-base font-semibold"}>{candidate.name}</div>
        )}
      </div>
    </div>
  );
};

const EmptyCandidate = () => {
  return (
    <div className={"flex items-center justify-center"}>
      <div className={"flex flex-col items-center justify-center"}>
        <div className={"flex items-center justify-center"}>
          <div className={"h-16 w-16 rounded-md opacity-0"} />
        </div>
        <div className={"text-base text-transparent"}>{"x"}</div>
      </div>
    </div>
  );
};

const CandidatesRow = ({ candidates }: { candidates: OptionalCandidate[] }) => {
  const MAX_CANDIDATES_PER_ROW = 5;

  return (
    <div
      className={
        "col-span-1 row-span-1 grid grid-cols-5 grid-rows-1 items-center justify-center"
      }
    >
      {candidates
        .slice(0, MAX_CANDIDATES_PER_ROW)
        .map((candidate, i) =>
          candidate ? (
            <Candidate key={i} candidate={candidate} />
          ) : (
            <EmptyCandidate key={i} />
          )
        )}
    </div>
  );
};

type OptionalCandidate = Candidate | null;

const CandidatesContainerByPhase = ({
  title,
  candidates,
}: {
  title: "경매 후보" | "유찰 목록";
  candidates: Candidate[];
}) => {
  const viewRows = title === "경매 후보" ? 4 : 2;
  const [fullLengthCandidates, setFullLengthCandidates] = useState<
    OptionalCandidate[]
  >([]);

  useEffect(() => {
    const fullLength = viewRows * 5;
    setFullLengthCandidates(
      Array.from({ length: fullLength }, (_, i) => {
        const candidate = candidates[i];
        if (candidate) {
          return candidate;
        }
        return null;
      })
    );
  }, [candidates, viewRows]);

  return (
    <div
      className={
        "rounded-lg border-2 border-gray-300 " +
        "flex h-full w-full flex-col items-center justify-center " +
        (title === "경매 후보" ? "row-span-4" : "row-span-2")
      }
    >
      <div className={"m-2 text-center text-lg font-semibold"}>{title}</div>
      <div
        className={
          "grid w-full flex-grow grid-cols-1 items-center justify-center " +
          (title === "경매 후보" ? "grid-rows-4" : "grid-rows-2")
        }
      >
        {Array.from({ length: viewRows }, (_, i) => (
          <CandidatesRow
            key={i}
            candidates={
              fullLengthCandidates.slice(i * 5, i * 5 + 5) as Candidate[]
            }
          />
        ))}
      </div>
    </div>
  );
};

export const CandidatesContainer = ({
  candidatesNotYetAuctioned,
  candidatesFailedToAuction,
}: {
  candidatesNotYetAuctioned: Candidate[];
  candidatesFailedToAuction: Candidate[];
}) => {
  return (
    <div className={"col-span-3 row-span-1 m-2 grid grid-rows-6 gap-2"}>
      {/*아직 경매되지 않은 선수 목록*/}
      <CandidatesContainerByPhase
        title={"경매 후보"}
        candidates={candidatesNotYetAuctioned}
      />

      {/*경매에 실패한 선수 목록*/}
      <CandidatesContainerByPhase
        title={"유찰 목록"}
        candidates={candidatesFailedToAuction}
      />
    </div>
  );
};
