import { BidSuccess, Participant } from "@/lib/dto/participant";
import { nanoid } from "nanoid";
import { faker } from "@faker-js/faker";
import { MAX_POINTS } from "@/lib/constants";

const PARTICIPANTS_NUM = 6;

const getMockBidSuccess = (
  line: BidSuccess["candidate"]["line"]
): BidSuccess => ({
  bidAmount: Math.floor(Math.random() * (MAX_POINTS / 5)),
  candidate: {
    name: faker.person.firstName(),
    line,
    imgUrl: faker.image.urlPicsumPhotos({
      width: 200,
      height: 200,
    }),
    id: nanoid(),
  },
});

const goRandomByPercent = (percent: number) => {
  return Math.random() < percent;
};

export const mockParticipants: Participant[] = Array.from(
  { length: PARTICIPANTS_NUM },
  () => ({
    id: nanoid(),
    name: faker.person.firstName(),
    items: {
      MID: goRandomByPercent(0.5) ? getMockBidSuccess("MID") : null,
      BOTTOM: goRandomByPercent(0.5) ? getMockBidSuccess("BOTTOM") : null,
      TOP: goRandomByPercent(0.5) ? getMockBidSuccess("TOP") : null,
      JUNGLE: goRandomByPercent(0.5) ? getMockBidSuccess("JUNGLE") : null,
      SUPPORT: goRandomByPercent(0.5) ? getMockBidSuccess("SUPPORT") : null,
    },
  })
);
