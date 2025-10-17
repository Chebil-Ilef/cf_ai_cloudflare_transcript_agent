import crypto from "node:crypto";

export function verifyHmac(payload: string, headerSig: string, secret: string) {
  if (!secret) return false;
  try {
    const h = crypto.createHmac("sha256", secret).update(payload).digest("hex");
    const prefix = headerSig.startsWith("sha256=")
      ? headerSig.split("=")[1]
      : headerSig;
    return crypto.timingSafeEqual(Buffer.from(h), Buffer.from(prefix || ""));
  } catch (_e) {
    return false;
  }
}
