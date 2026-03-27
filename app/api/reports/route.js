import { NextResponse } from "next/server";

let mockReports = [
  {
    id: 1,
    title: "Stray dog near park",
    description: "Brown dog spotted near City Park",
    location: "City Park, Mysore",
    contact: "9876543210",
    status: "pending",
    userId: 1,
  },
  {
    id: 2,
    title: "Injured dog at bus stop",
    description: "Dog limping near main bus stop",
    location: "Central Bus Stop, Mysore",
    contact: "9123456780",
    status: "resolved",
    userId: 1,
  },
];

export async function GET(req) {
  const status = new URL(req.url).searchParams.get("status");

  if (status && status !== "all") {
    return NextResponse.json(mockReports.filter((report) => report.status === status));
  }

  return NextResponse.json(mockReports);
}

export async function POST(req) {
  const body = await req.json();
  if (!body || !body.title) {
    return NextResponse.json({ message: "Invalid report payload" }, { status: 400 });
  }

  const newReport = {
    id: mockReports.length + 1,
    ...body,
    status: body.status || "pending",
  };
  mockReports.push(newReport);

  return NextResponse.json(newReport, { status: 201 });
}
