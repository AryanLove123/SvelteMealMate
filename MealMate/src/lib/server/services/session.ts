import type { Cookies } from "@sveltejs/kit";
import { COLLECTIONS, connectToDatabase } from "../db/mongo.ts";
import { randomUUID } from "node:crypto";
import { ObjectId } from "mongodb";

const SESSION_COOKIE = "mealmate_session";

export interface SessionUser {
  id: string;
  username: string;
  displayName: string;
}

export async function findOrCreateUser(username: string): Promise<SessionUser> {
  const db = await connectToDatabase();

  const users = db.collection(COLLECTIONS.users);

  const existing = await users.findOne({ username });

  if (existing) {
    return {
      id: existing._id.toString(),
      username: existing.username,
      displayName: existing.displayName,
    };
  }

  const doc = {
    _id: randomUUID(),
    username,
    displayName: username,
    createdAt: new Date().toISOString(),
  };

  await users.insertOne(doc as any);
  return { id: doc._id, username: doc.username, displayName: doc.displayName };
}

export function setSessionCookie(cookies: Cookies, userId: string) {
  cookies.set(SESSION_COOKIE, userId, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export function clearSessionCookie(cookies: Cookies) {
  cookies.delete(SESSION_COOKIE, { path: "/" });
}

export function getSessionUserId(cookies: Cookies): string | null {
  return cookies.get(SESSION_COOKIE) ?? null;
}

export async function getSessionUser(
  cookies: Cookies,
): Promise<SessionUser | null> {
  const userId = getSessionUserId(cookies);

  if (!userId) {
    return null;
  }

  const db = await connectToDatabase();

  const users = db.collection(COLLECTIONS.users);

  const user = await users.findOne({
    _id: new ObjectId(userId),
  });

  if (!user) {
    return null;
  }

  return {
    id: user._id.toString(),
    username: user.username,
    displayName: user.displayName,
  };
}
