import { NextResponse } from "next/server";

// For now, just echo back the update request
export async function PATCH(req, { params }) {
  const { id } = params;
  const { status } = await req.json();

  // In a real DB setup, you'd update the record here.
  // For now, just return the updated object.
  return NextResponse.json({ id, status });
}