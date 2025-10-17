export async function tagTopics(_env: unknown, params: { text?: string }) {
  // very small heuristic: return some tokens
  const tags = new Set<string>();
  const lowers = (params.text || "").toLowerCase();
  if (lowers.includes("bill")) tags.add("billing");
  if (lowers.includes("deploy")) tags.add("deploy");
  if (lowers.includes("security")) tags.add("security");
  if (lowers.includes("infra")) tags.add("infra");
  return Array.from(tags).slice(0, 5);
}
