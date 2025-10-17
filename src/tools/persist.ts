interface PersistEnv {
  DIGEST_STATE?: {
    idFromName(name: string): unknown;
    get(id: unknown): {
      fetch(
        path: string,
        options?: { method?: string; body?: string }
      ): Promise<Response>;
    };
  };
  IDX_KV?: {
    put(key: string, value: string): Promise<void>;
    get(key: string): Promise<string | null>;
  };
  EMAIL?: unknown;
}

interface DigestData {
  teamId?: string;
  dateISO?: string;
  bullets?: unknown[];
  actions?: unknown[];
  topics?: string[];
}

// Simple persist layer: prefer Durable Object (DIGEST_STATE), fallback to KV (IDX_KV)
export async function persistDigest(
  env: PersistEnv,
  { teamId, dateISO, bullets, actions, topics }: DigestData
) {
  const key = `digest:${teamId}:${dateISO}`;
  const digest = {
    dateISO,
    teamId,
    summaries: bullets || [],
    actions: actions || [],
    topics: topics || [],
    approved: false,
    sent: false,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  try {
    if (env.DIGEST_STATE) {
      const id = env.DIGEST_STATE.idFromName(`${teamId}:${dateISO}`);
      const stub = env.DIGEST_STATE.get(id);
      const res = await stub.fetch("/append", {
        method: "POST",
        body: JSON.stringify(digest)
      });
      return { ok: true, from: "do", resp: await res.text() };
    }
  } catch (_e) {}

  if (env.IDX_KV) {
    await env.IDX_KV.put(key, JSON.stringify(digest));
    return { ok: true, from: "kv" };
  }
  return { ok: false, error: "no storage bound" };
}

export async function getDigest(
  env: PersistEnv,
  { teamId, dateISO }: { teamId?: string; dateISO?: string }
) {
  try {
    if (env.DIGEST_STATE) {
      const id = env.DIGEST_STATE.idFromName(`${teamId}:${dateISO}`);
      const stub = env.DIGEST_STATE.get(id);
      const res = await stub.fetch("/get");
      if (res.status === 200) return res.json();
    }
  } catch (_e) {}
  if (env.IDX_KV) {
    const val = await env.IDX_KV.get(`digest:${teamId}:${dateISO}`);
    return val ? JSON.parse(val) : null;
  }
  return null;
}

export async function approveDigest(
  env: PersistEnv,
  {
    teamId,
    dateISO,
    edits
  }: { teamId?: string; dateISO?: string; edits?: Record<string, unknown> }
) {
  try {
    if (env.DIGEST_STATE) {
      const id = env.DIGEST_STATE.idFromName(`${teamId}:${dateISO}`);
      const stub = env.DIGEST_STATE.get(id);
      const res = await stub.fetch("/approve", {
        method: "POST",
        body: JSON.stringify({ edits })
      });
      return {
        ok: res.status === 200,
        status: res.status,
        text: await res.text()
      };
    }
  } catch (_e) {}
  return { ok: false, error: "no do" };
}

export async function sendDigestEmail(
  env: PersistEnv,
  {
    teamId: _teamId,
    dateISO: _dateISO,
    to: _to
  }: { teamId?: string; dateISO?: string; to?: string }
) {
  // placeholder: if EMAIL binding exists, call it
  if (env.EMAIL) {
    // Not implemented: adapt to your email worker API
    return { ok: false, error: "email integration not implemented in stub" };
  }
  return { ok: false, error: "no email binding" };
}
