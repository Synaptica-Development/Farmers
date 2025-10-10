import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  // clear token cookie
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  // clear role cookie
  response.cookies.set("role", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}
