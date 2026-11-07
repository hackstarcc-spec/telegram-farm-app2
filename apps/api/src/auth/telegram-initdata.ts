import { createHmac, timingSafeEqual } from "crypto";

/**
 * Validates Telegram Mini App initData per
 * https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 *
 * Stub-ready: call with BOT_TOKEN from env (never commit the token).
 */
export function validateTelegramInitData(
  initData: string,
  botToken: string,
  maxAgeSec = 86400,
): { ok: true; user: Record<string, unknown>; startParam?: string } | { ok: false; reason: string } {
  if (!botToken) {
    return { ok: false, reason: "BOT_TOKEN not configured" };
  }

  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return { ok: false, reason: "missing hash" };

  params.delete("hash");
  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("\n");

  const secretKey = createHmac("sha256", "WebAppData").update(botToken).digest();
  const computed = createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

  try {
    const a = Buffer.from(computed, "hex");
    const b = Buffer.from(hash, "hex");
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      return { ok: false, reason: "invalid hash" };
    }
  } catch {
    return { ok: false, reason: "invalid hash encoding" };
  }

  const authDate = Number(params.get("auth_date") ?? 0);
  const now = Math.floor(Date.now() / 1000);
  if (!authDate || now - authDate > maxAgeSec) {
    return { ok: false, reason: "auth_date expired" };
  }

  const userRaw = params.get("user");
  let user: Record<string, unknown> = {};
  if (userRaw) {
    try {
      user = JSON.parse(userRaw) as Record<string, unknown>;
    } catch {
      return { ok: false, reason: "invalid user json" };
    }
  }

  const startParam = params.get("start_param") ?? undefined;
  return { ok: true, user, startParam };
}
