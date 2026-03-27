import { NextResponse } from "next/server";

// Mock profile database for demo
const mockUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", phone: "+91 9876543210", address: "123 Green Street, Bangalore", organization_name: "Stray Shield Rescue", role: "citizen" },
  { id: 2, name: "NGO Admin", email: "ngo@strayshield.com", phone: "+91 9000012345", address: "Bangalore, India", organization_name: "Stray Shield NGO", role: "ngo" },
];

export async function GET() {
  try {
    // For now, return a generic user if no token condition exists
    return NextResponse.json({ user: mockUsers[0] });
  } catch (err) {
    console.error("[v0] /api/users/profile error", err);
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
}
