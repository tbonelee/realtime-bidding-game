import {Candidate, CandidateLine} from "./candidate"; // 낙찰 성공 정보

// 낙찰 성공 정보
export type BidSuccess = {
  candidate: Candidate;
  bidAmount: number;
};

export type Participant = {
  id: string;
  name: string;
  items: Record<CandidateLine, null | BidSuccess>;
};
