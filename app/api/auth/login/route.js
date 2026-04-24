import { NextResponse } from "next/server";

const mockUsers = [
  { id: 1, email: "john@example.com", password: "test123", userType: "citizen" },
  { id: 2, email: "ngo@strayshield.com", password: "test123", userType: "ngo" },
];

export async function POST(req) {
  const { email, password, userType } = await req.json();

  if (!email || !password || !userType) {
    return NextResponse.json({ message: "Missing login fields" }, { status: 400 });
  }

  const user = mockUsers.find((u) => u.email === email && u.password === password && u.userType === userType);

  if (!user) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  return NextResponse.json({ token: "mock-token-123","userType": user.userType, "userId": user.id });
}
