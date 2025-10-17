export async function summarize(
  _env: unknown,
  params: { title?: string; participants?: string[]; chunks: string[] }
) {
  const { chunks } = params;
  // Placeholder summarization: return first sentence of each chunk as a bullet
  const bullets: string[] = chunks.map((c) => {
    const s = c.trim().split(/[.\n]/)[0];
    return s ? s.trim() : "(no content)";
  });
  return bullets.slice(0, 5);
}
