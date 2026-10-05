import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { db } from "./db";

export const AUTH_COOKIE = "fc_token";

const SECRET = process.env.JWT_SECRET || "dev-secret";

export type JwtPayload = {
  userId: string;
  isAdmin: boolean;
};

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const payload = verifyToken(token);

  if (!payload) {
    return null;
  }

  return db.user.findUnique({
    where: {
      id: payload.userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      isAdmin: true,
      emailVerified: true,
    },
  });
}

export async function requireUser() {
  const user = await getSessionUser();

  if (!user) {
    throw new AuthError("Please log in to continue.");
  }

  return user;
}

export async function requireAdmin() {
  const user = await requireUser();

  if (!user.isAdmin) {
    throw new AuthError("Admin access required.");
  }

  return user;
}

export class AuthError extends Error {
  status = 401;
}