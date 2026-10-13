import crypto from "crypto";

/**
 * AES-256-GCM Encryption / Decryption Module for Cẩm Cù House
 * Secures API keys, Service Account JSONs, and secret credentials.
 */

// Derive a 32-byte (256-bit) encryption key from APP_ENCRYPTION_KEY
function getMasterKey(): Buffer {
  const envKey = process.env.APP_ENCRYPTION_KEY || process.env.AUTH_SECRET || "camcu_house_default_fallback_secret_encryption_key_2026";
  // Always derive a strictly 32-byte key via SHA-256
  return crypto.createHash("sha256").update(envKey).digest();
}

/**
 * Encrypt a secret string using AES-256-GCM
 * Output format: "iv_hex:auth_tag_hex:cipher_text_hex"
 */
export function encryptSecret(plainText: string): string {
  if (!plainText) return "";
  const iv = crypto.randomBytes(12); // 96-bit IV recommended for GCM
  const key = getMasterKey();
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");

  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

/**
 * Decrypt an AES-256-GCM encrypted secret string
 */
export function decryptSecret(encryptedPayload: string): string {
  if (!encryptedPayload) return "";
  const parts = encryptedPayload.split(":");
  if (parts.length !== 3) {
    // Return original if not in encrypted format (backward-compatibility)
    return encryptedPayload;
  }

  try {
    const [ivHex, authTagHex, encryptedHex] = parts;
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const key = getMasterKey();

    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error("[Crypto] Decryption failed for payload");
    return "";
  }
}

/**
 * Mask secret string for safe browser display:
 * Shows "••••" followed by the last 4 characters.
 * Server MUST NEVER return the unmasked secret to client.
 */
export function maskSecret(value: string): string {
  if (!value) return "";
  const clean = value.trim();
  if (clean.length <= 4) {
    return "••••";
  }
  const last4 = clean.slice(-4);
  return `••••${last4}`;
}

/**
 * Hash password with PBKDF2 (100,000 iterations, 64 bytes)
 */
export function hashPassword(password: string, salt = "camcu_salt_secure_2026"): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
}

export function verifyPassword(password: string, hash: string, salt = "camcu_salt_secure_2026"): boolean {
  const testHash = hashPassword(password, salt);
  try {
    return crypto.timingSafeEqual(Buffer.from(testHash, "hex"), Buffer.from(hash, "hex"));
  } catch {
    return false;
  }
}
