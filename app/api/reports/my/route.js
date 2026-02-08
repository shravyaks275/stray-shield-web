import { NextResponse } from "next/server";

// Temporary mock data until DB is connected
const mockReports = [
  {
    id: 1,
    title: "Stray dog near park",
    description: "Brown dog spotted near City Park",
    location: "City Park, Mysore",
    contact: "9876543210",
    status: "pending",
  },
  {
    id: 2,
    title: "Injured dog at bus stop",
    description: "Dog limping near main bus stop",
    location: "Central Bus Stop, Mysore",
    contact: "9123456780",
    status: "resolved",
  },
];

export async function GET() {
  return NextResponse.json(mockReports);
}