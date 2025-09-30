import { SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";

export interface SessionData {
  user?: {
    id: number;
    email: string;
    name?: string | null;
    department?: string;
    avatar?: string | null;
    points?: number;
    isAdmin?: boolean;
  };
}

const computedPassword =
  process.env.SESSION_PASSWORD && process.env.SESSION_PASSWORD.length >= 32
    ? process.env.SESSION_PASSWORD
    : "hansoo+aminemh@test1234567891234";

export const sessionOptions: SessionOptions = {
  cookieName: "merit_session",
  password: computedPassword,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}
