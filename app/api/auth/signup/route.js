import { NextResponse } from "next/server";

let mockUsers = [
  { id: 1, email: "john@example.com", password: "test123", userType: "citizen" },
  { id: 2, email: "ngo@strayshield.com", password: "test123", userType: "ngo" },
];

export async function POST(req) {
  const { email, password, userType } = await req.json();

  if (!email || !password || !userType) {
    return NextResponse.json({ message: "Missing signup fields" }, { status: 400 });
  }

  if (mockUsers.some((u) => u.email === email)) {
    return NextResponse.json({ message: "Email already in use" }, { status: 409 });
  }

  const id = mockUsers.length + 1;
  const newUser = { id, email, password, userType };
  mockUsers.push(newUser);

  return NextResponse.json({ token: "mock-token-123", userType, userId: id });
}
