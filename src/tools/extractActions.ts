export async function extractActions(
  _env: unknown,
  params: { text?: string; participants?: string[] }
) {
  const { text } = params;
  // Very naive extraction: look for lines starting with a name and a verb
  const lines = (text || "").split(/\n+/);
  const items: { owner: string; task: string }[] = [];
  for (const ln of lines) {
    const m = ln.match(/^\s*(\w+):?\s+(.*)$/);
    if (m) items.push({ owner: m[1], task: m[2].slice(0, 200) });
  }
  return items.slice(0, 20);
}
