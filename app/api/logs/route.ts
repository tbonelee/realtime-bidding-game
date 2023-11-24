import { faker } from "@faker-js/faker";
import { nanoid } from "nanoid";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(
    Array.from({ length: 6 }, () => ({
      id: nanoid(),
      text: faker.lorem.sentence(),
    }))
  );
}
