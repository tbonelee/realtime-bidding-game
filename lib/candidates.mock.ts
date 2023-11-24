import { Candidate, CandidateLine, Lines } from "@/lib/dto/candidate";
import { faker } from "@faker-js/faker";
import { nanoid } from "nanoid";

const MOCK_CANDIDATES_LENGTH = 30;

const getRandomLines = () => {
  const lines: CandidateLine[] = [];
  const lineCount = [0, 0, 0, 0, 0];
  const maxLineCount = 6;
  for (let i = 0; i < 6; i++) {
    while (true) {
      const lineIndex = Math.floor(Math.random() * 5);
      if (lineCount[lineIndex] < maxLineCount) {
        const line = Lines[lineIndex];
        lines.push(line);
        lineCount[lineIndex]++;
        break;
      }
    }
  }
  return lines;
};

const randomLines = getRandomLines();

export const mockCandidates: Candidate[] = Array.from(
  { length: MOCK_CANDIDATES_LENGTH },
  (_, i) => ({
    name: faker.person.firstName(),
    id: nanoid(),
    imgUrl: faker.image.urlPicsumPhotos({
      width: 200,
      height: 200,
    }),
    line: randomLines[i],
  })
);

console.log(
  "url",
  faker.image.urlPicsumPhotos({
    width: 200,
    height: 200,
  }),
  faker.internet.userName()
);
