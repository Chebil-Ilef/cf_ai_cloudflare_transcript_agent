# Transcripts Agent - Example Workflows

This document shows example conversations and workflows with the Transcripts AI Agent.

## 📄 Transcript Processing Workflow

### Processing a Single Meeting Transcript

```
User: "I have a meeting transcript from our weekly standup to process"

Agent: "I'll help you process that meeting transcript! To get started, I need:

1. Meeting details (title, date, participants)
2. The full transcript text
3. Source platform (Zoom, Google Meet, Teams, etc.)

Please provide the meeting information and transcript content."

User: "Here's the meeting info:
Title: Engineering Weekly Standup
Date: 2025-01-15
Participants: Alice (Engineering Manager), Bob (Senior Dev), Charlie (Junior Dev)
Source: Zoom

Transcript:
Alice: Good morning everyone, let's start with our weekly standup...
Bob: I completed the authentication module this week...
Charlie: I'm working on the user dashboard, should be done by Friday..."

Agent: "I'll process this transcript to extract summaries and action items. Let me analyze the content..."

*[Uses ingestMeetingTranscript tool]*

"Processing complete! Here's what I extracted:

**Summary:**
• Weekly standup covering authentication module completion and user dashboard progress
• Authentication module completed by Bob this week
• User dashboard development in progress, targeting Friday completion

**Action Items:**
• Charlie: Complete user dashboard by Friday
• Alice: Review authentication module (confidence: 85%)

**Topics:** engineering, standup, development

Would you like me to add this to today's digest?"

User: "Yes, add it to the digest"

Agent: "Added to daily digest for engineering team on 2025-01-15!"
```

### Batch Processing Multiple Transcripts

```
User: "I have 3 meeting transcripts from today to process"

Agent: "I can help process multiple transcripts! You can either:
1. Process them one by one for detailed review
2. Batch process them all at once

Which would you prefer? Also, please provide the transcript details."

User: "Batch process them all. Here are the meetings:
1. Morning standup (engineering team)
2. Product review meeting
3. Client feedback session"

Agent: *[Processes each transcript using ingestMeetingTranscript tool]*

"Successfully processed all 3 transcripts! Here's the summary:

**Morning Standup:** 4 action items extracted, topics: engineering, sprint
**Product Review:** 2 action items extracted, topics: product, design
**Client Feedback:** 6 action items extracted, topics: customer, feedback, priorities

All have been added to today's digest. Total: 12 action items identified across 3 meetings."
```

## 📊 Daily Digest Management Workflow

### Viewing and Approving Daily Digest

```
User: "Show me today's digest for the engineering team"

Agent: *[Uses getDailyDigest tool]*

"Here's today's digest for engineering team (2025-01-15):

**Meetings Processed:** 3
- Engineering Weekly Standup
- Architecture Review Session
- Sprint Planning Meeting

**Key Summaries:**
• Authentication module completed and ready for review
• New microservice architecture approved for Q2 implementation
• Sprint goals defined with 15 story points committed

**Action Items (8 total):**
• Charlie: Complete user dashboard by Friday
• Bob: Set up CI/CD pipeline for new service by next week
• Alice: Schedule architecture review with senior staff
• Team: Begin sprint tasks as assigned in Jira

**Topics:** engineering, sprint, architecture, authentication

**Status:** ⏳ Pending Approval

Would you like me to approve and send this digest?"

User: "Yes, approve and send it to the team"

Agent: "I'll approve this digest and send it to the engineering team. Please confirm:"

*[Uses approveDailyDigest tool - requires confirmation]*

User: "Confirmed"

Agent: "Digest approved! Now sending to team..."

*[Uses sendApprovedDigest tool - requires confirmation]*

"Daily digest sent successfully to engineering team members!"
```

### Editing Digest Before Approval

```
User: "Show me today's digest but I want to edit it before sending"

Agent: *[Shows current digest]*

"Here's today's digest. What would you like to edit?"

User: "The action item for Charlie should be due Monday, not Friday, and add a note that the authentication module needs security review"

Agent: "I'll update the digest with your edits:
- Changed Charlie's due date from Friday to Monday
- Added note about security review requirement for authentication module

Would you like to approve the updated digest?"

*[Uses approveDailyDigest tool with edits]*
```

## 🔄 Automation and Scheduling Workflow

### Setting Up Daily Digest Automation

```
User: "Set up automatic daily digest generation for 8:00 AM"

Agent: "I'll set up daily digest finalization for 8:00 AM. This will:

1. Compile all transcripts processed the previous day
2. Generate the daily digest summary
3. Prepare it for review and approval

*[Uses scheduleDigestFinalization tool]*

Automation configured! Every day at 8:00 AM, I'll:
- Compile previous day's transcripts into a digest
- Notify you for review and approval
- Keep the digest ready for sending once approved

You'll still need to manually approve and send each digest for quality control."

User: "Can I change this to 9:00 AM instead?"

Agent: "Absolutely! I'll update the daily digest finalization to 9:00 AM."

*[Updates schedule]*

"Updated! Daily digest finalization now scheduled for 9:00 AM."
```

## 🔗 Webhook Integration Workflow

### Setting Up Meeting Platform Integration

````
User: "How do I set up automatic transcript processing from Zoom?"

Agent: "To set up automatic Zoom transcript processing:

1. **Configure Zoom Webhook:**
   - Go to Zoom Marketplace → Build App → Webhook Only
   - Set endpoint URL: `https://your-agent.workers.dev/ingest`
   - Subscribe to 'Recording Completed' event
   - Add your webhook secret for security

2. **Webhook Format:**
```json
{
  "transcript": {
    "id": "zoom-meeting-123",
    "meetingId": "zoom-456",
    "title": "Team Meeting",
    "dateISO": "2025-01-15",
    "participants": ["Alice", "Bob"],
    "text": "transcript content...",
    "source": "zoom"
  },
  "teamId": "engineering"
}
````

3. **Security:**
   - Include HMAC signature in `X-Signature` header
   - Use your configured webhook secret

Once configured, transcripts will be automatically processed and added to daily digests!"

User: "What about Google Meet?"

Agent: "For Google Meet, the process is similar but you'll need to:

1. Use Google Meet API or third-party integrations
2. Set up webhook with the same endpoint format
3. Use 'meet' as the source field

The transcript processing will work exactly the same once the webhook delivers the content!"

```

## 💡 Advanced Usage Patterns

### Multi-Team Organization
```

User: "We have separate engineering and marketing teams. How do I organize their digests?"

Agent: "Great! I support multi-team organization. Here's how to set it up:

**When Processing Transcripts:**

- Specify teamId: 'engineering' or 'marketing'
- Each team gets separate digests

**For Daily Digests:**

- Engineering: `getDailyDigest` with teamId: 'engineering'
- Marketing: `getDailyDigest` with teamId: 'marketing'

**Example:**"

_[Shows team-specific digest]_

"Would you like me to process transcripts for a specific team, or show you both teams' digests?"

User: "Show me both teams' digests for today"

Agent: _[Retrieves both team digests]_

"**Engineering Team (5 meetings):**

- 12 action items, focused on sprint planning and technical architecture
- Topics: development, infrastructure, testing

**Marketing Team (3 meetings):**

- 8 action items, focused on campaign planning and content creation
- Topics: campaigns, content, analytics

Both teams have pending digests ready for approval!"

```

### Topic-Based Analysis
```

User: "Show me all meetings tagged with 'security' from this week"

Agent: "I can help analyze security-related meetings! While I don't have a direct search tool yet, I can:

1. Review daily digests from this week
2. Identify meetings with 'security' topic tags
3. Compile security-related action items and decisions

Let me check this week's digests..."

_[Reviews recent digests]_

"Found 3 security-related meetings this week:

**Monday:** Security Review Session

- Action: Implement 2FA by end of sprint (Bob)
- Action: Security audit of API endpoints (Alice)

**Wednesday:** Incident Response Planning

- Action: Update incident playbooks (Security Team)
- Action: Schedule quarterly security training (HR)

**Friday:** Penetration Test Results

- Action: Fix critical vulnerabilities by next week (Dev Team)
- Action: Review access controls (DevOps)

Total: 6 security action items identified this week."

```

## 🔧 Troubleshooting Common Issues

### Processing Errors
```

User: "The transcript processing failed with an error"

Agent: "Let me help troubleshoot the transcript processing issue. Can you tell me:

1. What was the error message?
2. What type of transcript were you processing?
3. How long was the transcript content?

Common issues and solutions:

- **Content too long:** Transcripts over 300KB need to be split into chunks
- **Invalid format:** Make sure all required fields (id, title, dateISO, text) are provided
- **Character encoding:** Ensure transcript text is properly encoded UTF-8

Please share the error details and I'll help resolve it!"

User: "It said 'transcript too long' for a 2-hour meeting"

Agent: "For long transcripts (2+ hours), I recommend:

1. **Split by time segments:** Break into 30-minute chunks
2. **Process separately:** Use multiple transcript entries
3. **Merge results:** I'll combine them in the daily digest

Would you like me to help split and process this long transcript?"

```

### Approval Workflow Issues
```

User: "I approved the digest but it didn't send"

Agent: "Let me check the digest status and help resolve this:

1. **Verify approval status:** Check if digest is marked as approved
2. **Check email configuration:** Ensure email binding is properly configured
3. **Recipient validation:** Verify recipient email addresses are valid

_[Checks digest status]_

Common solutions:

- Re-approve if status isn't updated
- Check Cloudflare Email Worker configuration
- Verify DEFAULT_RECIPIENTS environment variable

Would you like me to attempt sending the digest again?"

```

## 📈 Best Practices

### Effective Transcript Management
```

User: "What are some best practices for managing transcripts?"

Agent: "Here are the best practices I recommend:

**Daily Workflow:**

1. **Morning:** Review overnight webhook deliveries
2. **Midday:** Process any manual transcripts
3. **Evening:** Review and approve daily digest
4. **Send:** Deliver approved digest to teams

**Quality Control:**

- Always review AI-extracted action items for accuracy
- Verify participant names and ownership assignments
- Edit summaries if important context is missing
- Confirm topic tags are relevant and helpful

**Team Organization:**

- Use consistent teamId values (e.g., 'engineering', 'marketing')
- Set up team-specific recipients for targeted delivery
- Configure different approval workflows per team if needed

**Automation Setup:**

- Schedule daily digest finalization for optimal timing
- Set up webhook integrations for automatic processing
- Use HMAC signatures for security
- Monitor webhook delivery success rates

Would you like me to help set up any of these practices for your team?"

```

---

These examples show the full range of capabilities available with the Transcripts Agent, from simple transcript processing to advanced multi-team automation workflows.
```
