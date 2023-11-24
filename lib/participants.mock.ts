import { Participant } from "@/lib/dto/participant";
import { nanoid } from "nanoid";
import { faker } from "@faker-js/faker";

const PARTICIPANTS_NUM = 6;

export const mockParticipants: Participant[] = Array.from(
  { length: PARTICIPANTS_NUM },
  () => ({
    id: nanoid(),
    name: faker.person.firstName(),
    items: {
      MID: null,
      BOTTOM: null,
      TOP: null,
      JUNGLE: null,
      SUPPORT: null,
    },
  })
);
