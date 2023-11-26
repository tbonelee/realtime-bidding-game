import { mockCandidates } from "@/lib/candidates.mock";

export const dynamic = "force-dynamic";
const candidates = mockCandidates;

export async function GET() {
  return Response.json(candidates);
}
