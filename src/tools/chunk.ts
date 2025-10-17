export async function chunkTranscript(
  _env: unknown,
  { text, maxTokens = 1500 }: { text: string; maxTokens?: number }
) {
  // naive sentence splitter into fixed-size chunks (by characters)
  const approxChars = maxTokens * 4; // rough
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += approxChars) {
    chunks.push(text.slice(i, i + approxChars));
  }
  return chunks;
}
