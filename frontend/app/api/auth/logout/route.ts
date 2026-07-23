import { NextResponse } from "next/server";

export async function POST() {
  const isProduction = process.env.NODE_ENV === "production";
  const response = NextResponse.json({ message: "Logged out successfully" });

  response.cookies.set("access_token", "", {
    path: "/",
    maxAge: 0,
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
  });
  response.cookies.set("refresh_token", "", {
    path: "/",
    maxAge: 0,
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
  });

  return response;
}
