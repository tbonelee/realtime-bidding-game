import { mockParticipants } from "lib/participants.mock";

export const dynamic = "force-dynamic";
const participants = mockParticipants;

export async function GET() {
  return Response.json(participants);
}
