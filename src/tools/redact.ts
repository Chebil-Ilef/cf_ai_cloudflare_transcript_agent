export async function redactPII(_env: unknown, { text }: { text: string }) {
  let t = text || "";
  // mask emails
  t = t.replace(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    "[redacted-email]"
  );
  // mask simple phones
  t = t.replace(/\+?\d[\d\s\-()]{7,}\d/g, "[redacted-phone]");
  return { text: t, replaced: 0 };
}
