# Transcripts Agent

**AI-powered meeting transcript processing and daily digest generation** built with [Cloudflare Agents SDK](https://github.com/cloudflare/agents-sdk) and deployed on Cloudflare Workers.

Transform your meeting transcripts into actionable insights with automated summarization, action item extraction, and team-based daily digest delivery.

---

## Features

### Transcript Processing

- **Multi-source ingestion**: Support for Zoom, Google Meet, Teams, webhooks, and manual uploads
- **Automatic summarization**: AI-powered bullet-point summaries highlighting decisions and outcomes
- **Action item extraction**: Identify tasks, owners, and due dates from meeting discussions
- **Topic tagging**: Categorize meetings with relevant tags (billing, infrastructure, security, etc.)
- **PII redaction**: Optional privacy protection by removing sensitive information

### Daily Digest Generation

- **Team-based organization**: Separate digests for different teams
- **Automated compilation**: Daily aggregation of all meetings with summaries and action items
- **Human-in-the-loop approval**: Review and edit digests before sending
- **Email delivery**: Send approved digests to team members and stakeholders

### Workflow Automation

- **Scheduled processing**: Set up daily digest finalization at specific times
- **Real-time processing**: Process transcripts as they're received via webhooks
- **Approval workflows**: Require human confirmation for sensitive operations
- **Persistent storage**: Maintain digest history using Cloudflare Durable Objects and KV

### Enterprise Ready

- **Scalable architecture**: Built on Cloudflare's global edge network
- **Security first**: HMAC signature verification for webhooks
- **Privacy protection**: Optional PII redaction before AI processing
- **Audit trail**: Complete history of transcript processing and digest approvals

---

## Quick Start

### 1. Clone and Setup

```bash
npm install
```

### 2. Configure Environment

```bash
# Copy example environment file
cp .dev.vars.example .dev.vars

# Edit .dev.vars with your settings
OPENAI_API_KEY=your_openai_api_key_here
WEBHOOK_SECRET=your_webhook_secret
DEFAULT_RECIPIENTS=team@company.com
```

### 3. Deploy to Cloudflare

```bash
# Login to Cloudflare (if not already)
npx wrangler login

# Deploy to production
npm run deploy
```

### 4. Set Production Secrets

```bash
# Upload your environment variables as secrets
npx wrangler secret bulk .dev.vars
```

---

## How to Use

### Processing Transcripts

1. **Upload transcript**: Provide meeting details and transcript text
2. **AI Processing**: Automatic summarization and action item extraction
3. **Review results**: Check generated summaries and extracted action items
4. **Confirm processing**: Approve the processing to add to daily digest

### Managing Daily Digests

1. **View digest**: Check the daily compilation of all processed meetings
2. **Review content**: Verify summaries, action items, and topic tags
3. **Edit if needed**: Make adjustments before approval
4. **Approve digest**: Mark digest as ready for sending
5. **Send to team**: Deliver via email to configured recipients

### Setting Up Automation

1. **Configure webhooks**: Set up meeting platforms to send transcripts automatically
2. **Schedule digests**: Set daily finalization times (e.g., 8:00 AM)
3. **Team organization**: Configure separate teams with different recipients
4. **Approval workflows**: Set up human-in-the-loop confirmation processes

### Example Conversations

**Processing a Transcript**:

```
You: "I have a meeting transcript to process from our sprint planning session"
Agent: "I'll help you process that transcript! Please provide the meeting details and transcript content, and I'll generate summaries and extract action items."
```

**Viewing Daily Digest**:

```
You: "Show me today's digest for the engineering team"
Agent: "Here's today's digest with 3 meetings processed, including 5 action items and summaries organized by topics."
```

**Approving and Sending**:

```
You: "Approve and send today's digest to the team"
Agent: "I'll mark the digest as approved and send it to the configured team recipients. Please confirm this action."
```

---

## Project Structure

```
├── src/
│   ├── app.tsx                    # Main chat UI
│   ├── server.ts                  # AI agent logic
│   ├── tools.ts                   # Transcript processing tools
│   ├── utils.ts                   # Helper functions
│   ├── agent/
│   │   └── TranscriptsAgent.ts    # Main agent implementation
│   ├── do/
│   │   └── DigestStateDO.ts       # Durable Object for state management
│   ├── tools/
│   │   ├── ingest.ts              # Transcript ingestion
│   │   ├── chunk.ts               # Text chunking
│   │   ├── summarize.ts           # AI summarization
│   │   ├── extractActions.ts      # Action item extraction
│   │   ├── tagTopics.ts           # Topic tagging
│   │   ├── redact.ts              # PII redaction
│   │   └── persist.ts             # Data persistence
│   ├── components/
│   │   ├── transcript-display/    # Transcript viewer
│   │   ├── digest-display/        # Digest viewer
│   │   └── ...                    # UI components
│   └── styles.css                 # Styling
├── wrangler.jsonc                 # Cloudflare configuration
├── package.json                   # Dependencies
└── README.md                      # This file
```

---

## Configuration

### Cloudflare Bindings (wrangler.jsonc)

```jsonc
{
  "name": "transcripts-agent",
  "main": "src/server.ts",

  "ai": { "binding": "AI" },

  "kv_namespaces": [{ "binding": "IDX_KV", "id": "your_kv_namespace_id" }],

  "durable_objects": {
    "bindings": [{ "name": "DIGEST_STATE", "class_name": "DigestStateDO" }]
  },

  "email": { "binding": "EMAIL" },

  "vars": {
    "WEBHOOK_SECRET": "your_webhook_secret",
    "DEFAULT_RECIPIENTS": "team@company.com"
  }
}
```

### Available Tools

| Tool                         | Type                  | Description                                            |
| ---------------------------- | --------------------- | ------------------------------------------------------ |
| `ingestMeetingTranscript`    | Confirmation Required | Process meeting transcripts into summaries and actions |
| `getDailyDigest`             | Auto-Execute          | Retrieve daily digest for specific team and date       |
| `approveDailyDigest`         | Confirmation Required | Approve daily digest for sending                       |
| `sendApprovedDigest`         | Confirmation Required | Send approved digest via email                         |
| `scheduleDigestFinalization` | Auto-Execute          | Schedule daily digest compilation                      |

### Environment Variables

| Variable             | Required | Description                                |
| -------------------- | -------- | ------------------------------------------ |
| `OPENAI_API_KEY`     | Yes      | OpenAI API key for AI processing           |
| `WEBHOOK_SECRET`     | Yes      | HMAC secret for webhook verification       |
| `DEFAULT_RECIPIENTS` | No       | Default email recipients (comma-separated) |

