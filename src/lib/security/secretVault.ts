// src/lib/security/secretVault.ts
import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";

function getMasterKey(): Buffer {
  const rawKey =
    process.env.CAMCU_STUDIO_MASTER_KEY ||
    "camcu-studio-fallback-32-byte-secret-key-2026";
  return crypto.createHash("sha256").update(rawKey).digest();
}

export function encryptSecret(plainText: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, getMasterKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(plainText, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted.toString("hex")}`;
}

export function decryptSecret(payload: string): string {
  const [ivHex, authTagHex, encryptedHex] = payload.split(":");
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    getMasterKey(),
    Buffer.from(ivHex, "hex")
  );
  decipher.setAuthTag(Buffer.from(authTagHex, "hex"));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedHex, "hex")),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}

// Chỉ hiển thị 4 ký tự cuối dạng ••••1234 trên giao diện Cẩm Cù Studio (Mục B5)
export function maskSecretForClient(plainText: string): string {
  if (!plainText || plainText.length <= 4) return "••••••••";
  return `••••••••${plainText.slice(-4)}`;
}
