import { NextRequest } from "next/server";
import { verifyToken, SessionPayload } from "./auth";

export function getSessionFromRequest(req: NextRequest): SessionPayload | null {
  // Check Authorization Bearer header first (for mobile apps & API clients)
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    const session = verifyToken(token);
    if (session) return session;
  }

  // Check httpOnly session cookie (for Next.js web client)
  const cookieToken = req.cookies.get("collabonet_session")?.value;
  if (cookieToken) {
    const session = verifyToken(cookieToken);
    if (session) return session;
  }

  return null;
}
