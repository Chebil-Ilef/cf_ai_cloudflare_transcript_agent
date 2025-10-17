/**
 * Tool definitions for the Transcripts Agent
 * Tools can either require human confirmation or execute automatically
 */
import { tool, type ToolSet } from "ai";
import { z } from "zod/v3";

// Import transcript tool functions
import { ingestTranscript } from "./tools/ingest";
import { chunkTranscript } from "./tools/chunk";
import { summarize } from "./tools/summarize";
import { extractActions } from "./tools/extractActions";
import { tagTopics } from "./tools/tagTopics";
import {
  persistDigest,
  getDigest,
  approveDigest,
  sendDigestEmail
} from "./tools/persist";

/**
 * Ingest meeting transcript for processing
 * Requires human confirmation before processing
 */
const ingestMeetingTranscript = tool({
  description:
    "Ingest and process a meeting transcript to generate summaries and action items",
  inputSchema: z.object({
    transcript: z.object({
      id: z.string().describe("Unique transcript ID"),
      meetingId: z.string().describe("Meeting identifier"),
      title: z.string().describe("Meeting title"),
      dateISO: z.string().describe("Meeting date in YYYY-MM-DD format"),
      participants: z
        .array(z.string())
        .optional()
        .describe("List of meeting participants"),
      language: z
        .string()
        .optional()
        .describe("Transcript language (default: en)"),
      text: z.string().describe("Full meeting transcript text"),
      source: z
        .enum(["zoom", "meet", "teams", "webhook", "manual"])
        .optional()
        .describe("Source of the transcript")
    }),
    teamId: z
      .string()
      .optional()
      .describe("Team identifier (default: 'default')")
  })
  // Requires confirmation before processing
});

/**
 * Get daily digest for a specific team and date
 */
const getDailyDigest = tool({
  description: "Retrieve the daily digest summary for a specific team and date",
  inputSchema: z.object({
    teamId: z.string().default("default").describe("Team identifier"),
    dateISO: z.string().describe("Date in YYYY-MM-DD format")
  }),
  execute: async ({ teamId, dateISO }) => {
    const digest = await getDigest({}, { teamId, dateISO });
    return digest || { message: "No digest found for this date" };
  }
});

/**
 * Approve daily digest
 * Requires human confirmation before approval
 */
const approveDailyDigest = tool({
  description: "Approve a daily digest for sending",
  inputSchema: z.object({
    teamId: z.string().default("default").describe("Team identifier"),
    dateISO: z.string().describe("Date in YYYY-MM-DD format"),
    edits: z
      .record(z.unknown())
      .optional()
      .describe("Optional edits to apply before approval")
  })
  // Requires confirmation before approving
});

/**
 * Send approved digest via email
 * Requires human confirmation before sending
 */
const sendApprovedDigest = tool({
  description: "Send an approved daily digest via email",
  inputSchema: z.object({
    teamId: z.string().default("default").describe("Team identifier"),
    dateISO: z.string().describe("Date in YYYY-MM-DD format"),
    to: z.string().optional().describe("Recipient email address")
  })
  // Requires confirmation before sending
});

/**
 * Schedule daily digest finalization
 */
const scheduleDigestFinalization = tool({
  description: "Schedule daily digest finalization for a specific time",
  inputSchema: z.object({
    time: z
      .string()
      .describe("Time for daily finalization (e.g., '08:00', '9:00 AM')"),
    description: z
      .string()
      .default("Daily digest finalization")
      .describe("Task description")
  }),
  execute: async ({ time, description }) => {
    return `Scheduled "${description}" for ${time} daily. This would set up automatic digest compilation and approval workflow.`;
  }
});

/**
 * Export all available tools
 */
export const tools = {
  ingestMeetingTranscript,
  getDailyDigest,
  approveDailyDigest,
  sendApprovedDigest,
  scheduleDigestFinalization
} satisfies ToolSet;

/**
 * Tool executions for tools that require human confirmation
 */
export const executions = {
  ingestMeetingTranscript: async ({
    transcript,
    teamId
  }: {
    transcript: {
      id: string;
      meetingId: string;
      title: string;
      dateISO: string;
      participants?: string[];
      language?: string;
      text: string;
      source?: "zoom" | "meet" | "teams" | "webhook" | "manual";
    };
    teamId?: string;
  }) => {
    console.log(`Processing transcript for meeting: ${transcript.title}`);

    // Step 1: Ingest transcript
    const ingestResult = await ingestTranscript({}, { transcript });

    // Step 2: Chunk the transcript
    const chunks = await chunkTranscript(
      {},
      { text: transcript.text, maxTokens: 1500 }
    );

    // Step 3: Summarize each chunk and then reduce
    const summaryResult = await summarize(
      {},
      {
        title: transcript.title,
        participants: transcript.participants,
        chunks: chunks
      }
    );

    // Step 4: Extract action items
    const actionsResult = await extractActions(
      {},
      {
        text: transcript.text,
        participants: transcript.participants
      }
    );

    // Step 5: Tag topics (optional)
    const topicsResult = await tagTopics({}, { text: transcript.text });

    // Step 6: Persist the digest
    const persistResult = await persistDigest(
      {},
      {
        teamId: teamId || "default",
        dateISO: transcript.dateISO,
        bullets: summaryResult,
        actions: actionsResult,
        topics: topicsResult
      }
    );

    return {
      success: true,
      message: `Successfully processed transcript "${transcript.title}"`,
      summary: {
        ingest: ingestResult,
        chunks: chunks.length,
        bullets: summaryResult.length,
        actions: actionsResult.length,
        topics: topicsResult.length,
        persisted: persistResult.ok
      }
    };
  },

  approveDailyDigest: async ({
    teamId,
    dateISO,
    edits
  }: {
    teamId: string;
    dateISO: string;
    edits?: Record<string, unknown>;
  }) => {
    console.log(`Approving digest for team ${teamId} on ${dateISO}`);

    const result = await approveDigest({}, { teamId, dateISO, edits });

    return {
      success: result.ok,
      message: result.ok
        ? `Daily digest approved for ${teamId} on ${dateISO}`
        : `Failed to approve digest: ${result.error}`,
      result
    };
  },

  sendApprovedDigest: async ({
    teamId,
    dateISO,
    to
  }: {
    teamId: string;
    dateISO: string;
    to?: string;
  }) => {
    console.log(
      `Sending digest for team ${teamId} on ${dateISO} to ${to || "default recipients"}`
    );

    const result = await sendDigestEmail({}, { teamId, dateISO, to });

    return {
      success: result.ok,
      message: result.ok
        ? `Daily digest sent successfully to ${to || "default recipients"}`
        : `Failed to send digest: ${result.error}`,
      result
    };
  }
};
