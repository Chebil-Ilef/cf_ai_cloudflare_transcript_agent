import { Agent } from "agents";
// import { ingestTranscript } from "../tools/ingest";
import { chunkTranscript } from "../tools/chunk";
import { summarize } from "../tools/summarize";
import { extractActions } from "../tools/extractActions";
import { tagTopics } from "../tools/tagTopics";
import { redactPII } from "../tools/redact";
import {
  persistDigest,
  getDigest,
  approveDigest,
  sendDigestEmail
} from "../tools/persist";
import { verifyHmac } from "../utils/crypto";

interface TranscriptsEnv {
  WEBHOOK_SECRET?: string;
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

export class TranscriptsAgent extends Agent<
  TranscriptsEnv,
  Record<string, unknown>
> {
  onStart() {
    // schedule daily finalize (example)
    try {
      this.schedule("daily at 08:00", "finalizeYesterday");
    } catch {}
  }

  async httpIngest(req: Request) {
    const body = await req.text();
    const sig =
      req.headers.get("x-signature") || req.headers.get("X-Signature") || "";
    if (!verifyHmac(body, sig, this.env?.WEBHOOK_SECRET || "")) {
      return new Response(
        JSON.stringify({ ok: false, error: "bad signature" }),
        { status: 401, headers: { "content-type": "application/json" } }
      );
    }
    const payload = JSON.parse(body);
    const out = await this.ingest(payload).catch((e) => ({
      ok: false,
      error: String(e)
    }));
    return new Response(JSON.stringify(out, null, 2), {
      headers: { "content-type": "application/json" }
    });
  }

  async httpGetDigest(url: URL) {
    const teamId = url.searchParams.get("team") || "default";
    const dateISO =
      url.searchParams.get("date") || new Date().toISOString().slice(0, 10);
    const dig = await getDigest(this.env, { teamId, dateISO });
    return new Response(JSON.stringify(dig ?? { note: "No digest" }, null, 2), {
      headers: { "content-type": "application/json" }
    });
  }

  async httpApprove(req: Request) {
    const body = (await req.json()) as {
      teamId?: string;
      dateISO?: string;
      edits?: Record<string, unknown>;
    };
    const out = await approveDigest(this.env, {
      teamId: body.teamId,
      dateISO: body.dateISO,
      edits: body.edits
    });
    return new Response(JSON.stringify(out, null, 2), {
      headers: { "content-type": "application/json" }
    });
  }

  async httpSend(req: Request) {
    const body = (await req.json()) as {
      teamId?: string;
      dateISO?: string;
      to?: string;
    };
    const out = await sendDigestEmail(this.env, {
      teamId: body.teamId,
      dateISO: body.dateISO,
      to: body.to
    });
    return new Response(JSON.stringify(out, null, 2), {
      headers: { "content-type": "application/json" }
    });
  }

  // @unstable_callable()
  async ingest(transcript: {
    teamId?: string;
    dateISO?: string;
    title?: string;
    participants?: string[];
    text?: string;
    meetingId?: string;
  }) {
    const teamId = transcript.teamId || "default";
    const dateISO = transcript.dateISO || new Date().toISOString().slice(0, 10);
    // Basic pipeline using tool stubs
    const cleaned = await redactPII(this.env, {
      text: transcript.text || ""
    });
    const chunks = await chunkTranscript(this.env, {
      text: cleaned.text
    });
    const bullets = await summarize(this.env, {
      title: transcript.title,
      participants: transcript.participants,
      chunks
    });
    const actions = await extractActions(this.env, {
      text: transcript.text,
      participants: transcript.participants
    });
    const topics = await tagTopics(this.env, { text: transcript.text });
    const persisted = await persistDigest(this.env, {
      teamId,
      dateISO,
      bullets,
      actions,
      topics
    });
    return { ok: true, persisted };
  }

  // @unstable_callable()
  async finalizeYesterday() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const dateISO = d.toISOString().slice(0, 10);
    return { ok: true, dateISO };
  }
}
