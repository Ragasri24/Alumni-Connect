import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import pool from "./db";

const SESSION_COOKIE = "session_id";
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function createSession(
  userId: number,
  role: "STUDENT" | "ALUMNI" | "FACULTY" | "ADMIN"
) {
  const sessionId = randomBytes(32).toString("hex");

  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  await pool.query(
    `
    INSERT INTO auth_sessions
      (session_id, user_id, role, expires_at)
    VALUES
      ($1, $2, $3, $4)
    `,
    [sessionId, userId, role, expiresAt]
  );

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION / 1000,
  });

  return sessionId;
}

export async function getSession() {
  const cookieStore = await cookies();

  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionId) {
    return null;
  }

  const result = await pool.query(
    `
    SELECT
      session_id,
      user_id,
      role,
      expires_at
    FROM auth_sessions
    WHERE session_id = $1
      AND expires_at > CURRENT_TIMESTAMP
    `,
    [sessionId]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
}

export async function requireAuth() {
  const session = await getSession();

  if (!session) {
    throw new Error("UNAUTHORIZED");
  }

  return session;
}

export async function requireRole(
  allowedRoles: Array<"STUDENT" | "ALUMNI" | "FACULTY" | "ADMIN">
) {
  const session = await requireAuth();

  if (!allowedRoles.includes(session.role)) {
    throw new Error("FORBIDDEN");
  }

  return session;
}

export async function deleteSession() {
  const cookieStore = await cookies();

  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (sessionId) {
    await pool.query(
      `
      DELETE FROM auth_sessions
      WHERE session_id = $1
      `,
      [sessionId]
    );
  }

  cookieStore.delete(SESSION_COOKIE);
}