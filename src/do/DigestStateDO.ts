interface DigestState {
  summaries: unknown[];
  actions: unknown[];
  topics: string[];
  approved: boolean;
  sent: boolean;
  updatedAt: number;
}

interface DurableObjectState {
  storage: {
    get(key: string): Promise<unknown>;
    put(key: string, value: unknown): Promise<void>;
  };
}

export class DigestStateDO {
  state: DurableObjectState;
  env: Record<string, unknown>;

  constructor(state: DurableObjectState, env: Record<string, unknown>) {
    this.state = state;
    this.env = env;
  }

  async fetch(req: Request) {
    const url = new URL(req.url || `https://do/${Math.random()}`);
    switch (url.pathname) {
      case "/append":
        return this.append(req);
      case "/get":
        return this.get(req);
      case "/approve":
        return this.approve(req);
      default:
        return new Response("Not found", { status: 404 });
    }
  }

  async append(req: Request) {
    const body = await req.text();
    const obj = JSON.parse(body || "{}") as Partial<DigestState>;
    const current: DigestState = ((await this.state.storage.get(
      "digest"
    )) as DigestState) || {
      summaries: [],
      actions: [],
      topics: [],
      approved: false,
      sent: false,
      updatedAt: Date.now()
    };
    // merge naive
    current.summaries = (current.summaries || []).concat(obj.summaries || []);
    current.actions = (current.actions || []).concat(obj.actions || []);
    current.topics = Array.from(
      new Set([...(current.topics || []), ...(obj.topics || [])])
    );
    current.approved = current.approved || false;
    current.sent = current.sent || false;
    current.updatedAt = Date.now();
    await this.state.storage.put("digest", current);
    return new Response(JSON.stringify({ ok: true }));
  }

  async get(_req: Request) {
    const v = await this.state.storage.get("digest");
    return new Response(JSON.stringify(v || null), {
      headers: { "content-type": "application/json" }
    });
  }

  async approve(req: Request) {
    const body = await req.text();
    const { edits } = JSON.parse(body || "{}") as {
      edits?: Partial<DigestState>;
    };
    const current: DigestState = ((await this.state.storage.get(
      "digest"
    )) as DigestState) || {
      summaries: [],
      actions: [],
      topics: [],
      approved: false,
      sent: false,
      updatedAt: Date.now()
    };
    Object.assign(current, edits || {});
    current.approved = true;
    current.updatedAt = Date.now();
    await this.state.storage.put("digest", current);
    return new Response(JSON.stringify({ ok: true }));
  }
}
