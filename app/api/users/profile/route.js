import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

// Mock profile database for demo
// const mockUsers = [
//   { id: 1, name: "John Doe", email: "john@example.com", phone: "+91 9876543210", address: "123 Green Street, Bangalore", organization_name: "Stray Shield Rescue", role: "citizen" },
//   { id: 2, name: "NGO Admin", email: "ngo@strayshield.com", phone: "+91 9000012345", address: "Bangalore, India", organization_name: "Stray Shield NGO", role: "ngo" },
// ];

export async function GET(req) {
  try {
    // get userId (same as frontend)
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID missing" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
    });

    return NextResponse.json({ user });

  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json(
      { message: "User not found" },
      { status: 404 }
    );
  }
}


export async function PUT(req) {
  try {
    const body = await req.json();

    const { userId, name, email, phone, address, bio } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID missing" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: Number(userId), //  ensure it's number
      },
      data: {
        name,
        email,
        phone,
        address,
        bio,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });

  } catch (error) {
    console.error("DB Update Error:", error);

    return NextResponse.json(
      { success: false, message: "Update failed" },
      { status: 500 }
    );
  }
}
