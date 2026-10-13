import crypto from "crypto";

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

/**
 * Generate a random Base32 secret string (160-bit / 32 chars)
 */
export function generateTotpSecret(): string {
  const bytes = crypto.randomBytes(20);
  let secret = "";
  for (let i = 0; i < bytes.length; i++) {
    secret += BASE32_ALPHABET[bytes[i] % 32];
  }
  return secret;
}

/**
 * Decode Base32 string to Buffer
 */
function base32Decode(base32: string): Buffer {
  const clean = base32.toUpperCase().replace(/=+$/, "").replace(/[^A-Z2-7]/g, "");
  let bits = "";
  for (let i = 0; i < clean.length; i++) {
    const val = BASE32_ALPHABET.indexOf(clean[i]);
    if (val === -1) continue;
    bits += val.toString(2).padStart(5, "0");
  }

  const bytes: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.substring(i, i + 8), 2));
  }
  return Buffer.from(bytes);
}

/**
 * Generate TOTP code for a given secret at timestamp
 */
export function generateTotpCode(secret: string, timestampMs = Date.now(), stepSeconds = 30): string {
  const key = base32Decode(secret);
  const timeStep = Math.floor(timestampMs / 1000 / stepSeconds);

  const buf = Buffer.alloc(8);
  buf.writeBigInt64BE(BigInt(timeStep));

  const hmac = crypto.createHmac("sha1", key);
  hmac.update(buf);
  const digest = hmac.digest();

  const offset = digest[digest.length - 1] & 0xf;
  const binary =
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff);

  const otp = binary % 1000000;
  return otp.toString().padStart(6, "0");
}

/**
 * Verify a 6-digit TOTP code against a secret with window of +/- 1 step
 */
export function verifyTotpCode(secret: string, token: string, window = 1): boolean {
  if (!secret || !token || token.length !== 6) return false;
  const now = Date.now();
  const stepMs = 30 * 1000;

  for (let i = -window; i <= window; i++) {
    const testTime = now + i * stepMs;
    const expected = generateTotpCode(secret, testTime);
    if (expected === token.trim()) {
      return true;
    }
  }
  return false;
}

/**
 * Generate 5 one-time alphanumeric recovery codes
 */
export function generateRecoveryCodes(count = 5): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const part1 = crypto.randomBytes(2).toString("hex").toUpperCase();
    const part2 = crypto.randomBytes(2).toString("hex").toUpperCase();
    codes.push(`${part1}-${part2}`);
  }
  return codes;
}

/**
 * Generate Key URI for Authenticator apps (Google Authenticator, 1Password, Authy)
 */
export function getTotpUri(secret: string, accountName = "admin@camcuhouse.online", issuer = "Cẩm Cù House"): string {
  const encodedIssuer = encodeURIComponent(issuer);
  const encodedAccount = encodeURIComponent(accountName);
  return `otpauth://totp/${encodedIssuer}:${encodedAccount}?secret=${secret}&issuer=${encodedIssuer}&algorithm=SHA1&digits=6&period=30`;
}
