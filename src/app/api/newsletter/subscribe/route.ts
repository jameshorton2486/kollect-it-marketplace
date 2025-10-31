import { NextResponse } from "next/server";

// This endpoint has been removed along with the newsletter popup modal.
// Return 410 Gone to signal clients the route is deprecated.
export async function POST() {
  return NextResponse.json(
    { error: "Newsletter has been removed" },
    { status: 410 },
  );
}
