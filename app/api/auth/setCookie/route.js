import { NextResponse } from "next/server";
import cookie from "cookie";

export async function POST(request) {
  const { token } = await request.json();

  try {
    // Set the session cookie
    const expiresIn = 60 * 60 * 24; // One day
    const options = {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    };

    const res = NextResponse.json({ success: true });
    res.headers.set(
      "Set-Cookie",
      cookie.serialize("auth_token", token, options)
    );
    return res;
  } catch (error) {
    return NextResponse.json(
      { error: "Error storing cookies" },
      { status: 500 }
    );
  }
}
