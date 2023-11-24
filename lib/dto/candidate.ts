export type Candidate = {
  id: string;
  name: string;
  imgUrl: string;
  line: CandidateLine;
};

export const Lines = ["TOP", "JUNGLE", "MID", "BOTTOM", "SUPPORT"] as const;

export type CandidateLine = (typeof Lines)[number];
