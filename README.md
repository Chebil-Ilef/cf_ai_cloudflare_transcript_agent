# 🔍 Job Search AI Agent

An intelligent job search assistant that helps you find perfect job opportunities, generate personalized cover letters, and manage your entire job application process. Built with React, TypeScript, and the Vercel AI SDK.

## ✨ Features

### 🎯 Job Search & Matching
- **Smart Job Search**: Find top 10 best matching jobs based on your CV and preferences
- **AI-Powered Matching**: Advanced algorithm considers skills, experience, location, and salary preferences
- **Real-time Market Analysis**: Get insights on job market trends, salary ranges, and skill demands
- **Remote Work Support**: Filter for remote, hybrid, or on-site positions

### 📝 Cover Letter Generation
- **Personalized Cover Letters**: AI generates custom cover letters tailored to specific job descriptions
- **Multiple Tones**: Choose from professional, friendly, or formal writing styles
- **PDF Export**: Convert cover letters to professional PDF format
- **Edit & Customize**: Built-in editor to refine generated content

### 📧 Application Management
- **Auto Email Sending**: Send applications directly to recruiters with CV and cover letter attachments
- **Application Tracking**: Keep track of all your applications and their status
- **Follow-up Reminders**: Schedule reminders for follow-ups and interviews
- **Status Management**: Track progress from application to offer

### 💼 Additional Tools
- **CV Analysis**: Extract skills and qualifications from your resume
- **Interview Scheduling**: Set reminders for upcoming interviews
- **Market Intelligence**: Analyze competition and opportunities in your field
- **Career Insights**: Get personalized career advice and growth recommendations

## Prerequisites

- Cloudflare account
- OpenAI API key

## Quick Start

1. Create a new project:

```bash
npx create-cloudflare@latest --template cloudflare/agents-starter
```

2. Install dependencies:

```bash
npm install
```

## 🚀 Quick Start

1. **Clone and Install**:
```bash
npm install
```

2. **Set up your environment**:

Create a `.dev.vars` file in the root directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

3. **Run locally**:
```bash
npm start
```

4. **Deploy to Cloudflare**:
```bash
npm run deploy
```

## 📖 How to Use

### 🔍 Job Search
1. **Start a conversation**: "I'm looking for software engineering jobs"
2. **Provide your CV**: Share your resume content or key qualifications
3. **Specify preferences**: Location, salary range, remote work, experience level
4. **Review results**: Get top 10 matching jobs with detailed information
5. **Take action**: Apply directly or generate custom cover letters

### 📝 Cover Letter Generation
1. **Find a job**: Either through search or provide a job description
3. **Generate letter**: AI creates a personalized cover letter
4. **Customize**: Edit the content using the built-in editor
5. **Export**: Download as PDF for professional presentation
6. **Send**: Email directly to recruiters with attachments

### 📊 Application Tracking
1. **Add applications**: Track all your job applications in one place
2. **Update status**: Move applications through the pipeline (applied → screening → interview → offer)
3. **Set reminders**: Schedule follow-ups and interview reminders
4. **View analytics**: See your application success rate and pipeline health

### 💡 Example Conversations

**Job Search**:
```
You: "Help me find remote software engineering jobs paying $80k-120k"
Agent: "I'd be happy to help you find remote software engineering positions! To give you the best matches, could you please share your CV or key qualifications?"
```

**Cover Letter**:
```
You: "Generate a cover letter for this job: [paste job description]"
Agent: "I'll create a personalized cover letter for this position. I'll need your CV content to tailor it properly."
```

**Application Tracking**:
```
You: "Track my application to TechCorp for Senior Developer role"
Agent: "I'll add this to your application tracker. Let me create an entry for your TechCorp Senior Developer application."
```

## 🛠️ Project Structure

```
├── src/
│   ├── app.tsx                    # Main chat UI
│   ├── server.ts                  # AI agent logic
│   ├── tools.ts                   # Job search tools
│   ├── utils.ts                   # Helper functions
│   ├── components/
│   │   ├── job-card/              # Job listing display
│   │   ├── job-search-results/    # Search results UI
│   │   ├── cover-letter-display/  # Cover letter viewer
│   │   ├── application-tracker/   # Application management
│   │   └── ...                    # Other UI components
│   └── styles.css                 # Styling
```

## 🔧 Customization Guide

### Available Tools

The job search agent comes with these pre-built tools:

| Tool | Type | Description |
|------|------|-------------|
| `searchJobs` | Confirmation Required | Search for jobs based on CV and preferences |
| `generateCoverLetter` | Confirmation Required | Generate personalized cover letters |
| `generatePDFCoverLetter` | Confirmation Required | Convert cover letters to PDF |
| `sendApplicationEmail` | Confirmation Required | Send applications via email |
| `analyzeJobMarket` | Auto-Execute | Analyze job market trends and salary data |
| `trackApplication` | Auto-Execute | Manage job application pipeline |

### Adding New Job Search Tools

Add new tools in `tools.ts`:

```typescript
// Example: LinkedIn profile analyzer
const analyzeLinkedInProfile = tool({
  description: "Analyze LinkedIn profile for job search optimization",
  inputSchema: z.object({
    linkedinUrl: z.string().describe("LinkedIn profile URL"),
    targetRole: z.string().optional().describe("Target job role")
  })
  // No execute function = requires confirmation
});

// Example: Salary negotiation advisor  
const getSalaryAdvice = tool({
  description: "Get salary negotiation advice based on market data",
  inputSchema: z.object({
    jobTitle: z.string(),
    location: z.string(),
    experience: z.number(),
    currentSalary: z.number().optional()
  }),
  execute: async ({ jobTitle, location, experience, currentSalary }) => {
    // Auto-executing tool logic here
    return generateSalaryAdvice(jobTitle, location, experience, currentSalary);
  }
});
```

### Implementing Tool Confirmations

For tools requiring user confirmation, add to the `executions` object:

```typescript
export const executions = {
  analyzeLinkedInProfile: async ({ linkedinUrl, targetRole }) => {
    // Scrape LinkedIn profile (respecting terms of service)
    const profileData = await scrapeLinkedInProfile(linkedinUrl);
    return analyzeProfileForJobSearch(profileData, targetRole);
  },
  
  // Existing job search tools...
  searchJobs: async ({ cvContent, jobTitle, location, ...params }) => {
    // Call job search APIs (Indeed, LinkedIn, Glassdoor, etc.)
    const jobs = await searchJobAPIs(params);
    return rankJobsByMatch(jobs, cvContent);
  }
};
```

### Integrating Real Job APIs

To connect with real job search APIs, update the `searchJobs` execution:

```typescript
// In executions object
searchJobs: async (params) => {
  const jobSources = [
    await searchIndeed(params),
    await searchLinkedIn(params), 
    await searchGlassdoor(params),
    await searchRemoteOK(params)
  ];
  
  const allJobs = jobSources.flat();
  const rankedJobs = rankJobsByRelevance(allJobs, params.cvContent);
  return rankedJobs.slice(0, 10);
}
```

### Email Integration

For real email sending, configure an email service:

```typescript
// Using SendGrid, Mailgun, or similar
sendApplicationEmail: async (emailData) => {
  const emailService = new EmailService(process.env.EMAIL_API_KEY);
  
  return await emailService.send({
    to: emailData.recruiterEmail,
    from: emailData.applicantEmail,
    subject: emailData.subject,
    html: emailData.emailBody,
    attachments: [
      { filename: 'CV.pdf', content: emailData.cvAttachment },
      { filename: 'CoverLetter.pdf', content: emailData.coverLetterAttachment }
    ]
  });
}
```

### Use a different AI model provider

The starting [`server.ts`](https://github.com/cloudflare/agents-starter/blob/main/src/server.ts) implementation uses the [`ai-sdk`](https://sdk.vercel.ai/docs/introduction) and the [OpenAI provider](https://sdk.vercel.ai/providers/ai-sdk-providers/openai), but you can use any AI model provider by:

1. Installing an alternative AI provider for the `ai-sdk`, such as the [`workers-ai-provider`](https://sdk.vercel.ai/providers/community-providers/cloudflare-workers-ai) or [`anthropic`](https://sdk.vercel.ai/providers/ai-sdk-providers/anthropic) provider:
2. Replacing the AI SDK with the [OpenAI SDK](https://github.com/openai/openai-node)
3. Using the Cloudflare [Workers AI + AI Gateway](https://developers.cloudflare.com/ai-gateway/providers/workersai/#workers-binding) binding API directly

For example, to use the [`workers-ai-provider`](https://sdk.vercel.ai/providers/community-providers/cloudflare-workers-ai), install the package:

```sh
npm install workers-ai-provider
```

Add an `ai` binding to `wrangler.jsonc`:

```jsonc
// rest of file
  "ai": {
    "binding": "AI"
  }
// rest of file
```

Replace the `@ai-sdk/openai` import and usage with the `workers-ai-provider`:

```diff
// server.ts
// Change the imports
- import { openai } from "@ai-sdk/openai";
+ import { createWorkersAI } from 'workers-ai-provider';

// Create a Workers AI instance
+ const workersai = createWorkersAI({ binding: env.AI });

// Use it when calling the streamText method (or other methods)
// from the ai-sdk
- const model = openai("gpt-4o-2024-11-20");
+ const model = workersai("@cf/deepseek-ai/deepseek-r1-distill-qwen-32b")
```

Commit your changes and then run the `agents-starter` as per the rest of this README.

### Modifying the UI

The chat interface is built with React and can be customized in `app.tsx`:

- Modify the theme colors in `styles.css`
- Add new UI components in the chat container
- Customize message rendering and tool confirmation dialogs
- Add new controls to the header

### Example Use Cases

1. **Customer Support Agent**
   - Add tools for:
     - Ticket creation/lookup
     - Order status checking
     - Product recommendations
     - FAQ database search

## 🚀 Deployment

Deploy to Cloudflare Workers:

```bash
npm run deploy
```

For production, add your environment variables:

```bash
wrangler secret put OPENAI_API_KEY
wrangler secret put EMAIL_API_KEY
# ... other secrets
```

## 📊 Environment Variables

Create a `.dev.vars` file with these variables:

```env
# Required
OPENAI_API_KEY=your_openai_api_key

# Optional - for real integrations
EMAIL_API_KEY=your_email_service_api_key
LINKEDIN_API_KEY=your_linkedin_api_key
INDEED_API_KEY=your_indeed_api_key
GLASSDOOR_API_KEY=your_glassdoor_api_key

# For PDF generation
PDF_SERVICE_URL=your_pdf_generation_service
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch  
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🔮 Roadmap

- [ ] **Real Job API Integration**: Connect with major job boards
- [ ] **Advanced CV Analysis**: AI-powered resume optimization  
- [ ] **Interview Preparation**: Mock interviews and question practice
- [ ] **Salary Analytics**: Real-time compensation data
- [ ] **Company Research**: Automated company background research
- [ ] **Network Analysis**: LinkedIn connection insights
- [ ] **Mobile App**: React Native companion app
- [ ] **Chrome Extension**: Apply directly from job sites

## 📚 Learn More

- [`agents`](https://github.com/cloudflare/agents/blob/main/packages/agents/README.md)
- [Cloudflare Agents Documentation](https://developers.cloudflare.com/agents/)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)

## 📝 License

MIT License - see LICENSE file for details

---

**🎯 Start your job search journey today!**
