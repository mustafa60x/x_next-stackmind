import { SignJWT, jwtVerify } from "jose";

type DecodedToken = {
  id: string;
  username: string;
};

export function generateToken(user: { id: string; username: string }) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
  return new SignJWT({ id: user.id, username: user.username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // 7 days
    .sign(secret);
}

export async function verifyToken(token: string): Promise<DecodedToken | null> {
  try {
    if (token === "" || !token || token === "undefined" || token === null) {
      return null;
    }
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify<DecodedToken>(token, secret);
    return payload;
  } catch (error) {
    console.error("Token doğrulama hatası:", error);
    return null;
  }
}
