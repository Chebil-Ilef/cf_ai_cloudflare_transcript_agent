/**
 * Tool definitions for the Job Search AI Agent
 * Tools can either require human confirmation or execute automatically
 */
import { tool, type ToolSet } from "ai";
import { z } from "zod/v3";

import type { Chat } from "./server";
import { getCurrentAgent } from "agents";
import { scheduleSchema } from "agents/schedule";

/**
 * Job search tool that searches for jobs based on CV and preferences
 * Returns top 10 matching job opportunities
 */
const searchJobs = tool({
  description: "Search for job opportunities based on CV content and job preferences. Returns top 10 best matching jobs.",
  inputSchema: z.object({
    cvContent: z.string().describe("The content of the user's CV/resume"),
    jobTitle: z.string().optional().describe("Desired job title or role"),
    location: z.string().optional().describe("Preferred job location"),
    experience: z.string().optional().describe("Years of experience or level (junior, mid, senior)"),
    skills: z.array(z.string()).optional().describe("Relevant skills to match"),
    industry: z.string().optional().describe("Preferred industry or sector"),
    salaryRange: z.string().optional().describe("Expected salary range"),
    remote: z.boolean().optional().describe("Whether remote work is preferred")
  })
  // Omitting execute function makes this tool require human confirmation
});

/**
 * Generate custom cover letter based on job description
 * Creates personalized cover letter content
 */
const generateCoverLetter = tool({
  description: "Generate a custom cover letter based on job description and CV",
  inputSchema: z.object({
    cvContent: z.string().describe("The content of the user's CV/resume"),
    jobDescription: z.string().describe("The job description to tailor the cover letter for"),
    companyName: z.string().describe("Name of the company"),
    jobTitle: z.string().describe("Title of the job position"),
    recruiterName: z.string().optional().describe("Name of the recruiter or hiring manager"),
    tone: z.enum(["professional", "friendly", "formal"]).optional().describe("Tone of the cover letter")
  })
  // Requires confirmation before generating
});

/**
 * Generate PDF cover letter
 * Creates a PDF version of the cover letter
 */
const generatePDFCoverLetter = tool({
  description: "Generate a PDF version of the cover letter",
  inputSchema: z.object({
    coverLetterContent: z.string().describe("The cover letter content to convert to PDF"),
    applicantName: z.string().describe("Name of the job applicant"),
    applicantEmail: z.string().optional().describe("Email of the applicant"),
    applicantPhone: z.string().optional().describe("Phone number of the applicant")
  })
  // Requires confirmation before generating PDF
});

/**
 * Send application email automatically
 * Sends CV and cover letter to recruiter via email
 */
const sendApplicationEmail = tool({
  description: "Send job application email with CV and cover letter to recruiter",
  inputSchema: z.object({
    recruiterEmail: z.string().describe("Email address of the recruiter"),
    recruiterName: z.string().optional().describe("Name of the recruiter"),
    subject: z.string().describe("Email subject line"),
    emailBody: z.string().describe("Email body content"),
    cvAttachment: z.string().describe("Path or content of CV to attach"),
    coverLetterAttachment: z.string().describe("Path or content of cover letter to attach"),
    applicantName: z.string().describe("Name of the applicant"),
    applicantEmail: z.string().describe("Sender's email address")
  })
  // Requires confirmation before sending email
});

/**
 * Analyze job market trends
 * Provides insights about job market for specific roles/locations
 */
const analyzeJobMarket = tool({
  description: "Analyze job market trends for specific roles, skills, or locations",
  inputSchema: z.object({
    jobTitle: z.string().describe("Job title or role to analyze"),
    location: z.string().optional().describe("Location to analyze"),
    timeframe: z.enum(["1month", "3months", "6months", "1year"]).optional().describe("Timeframe for analysis")
  }),
  execute: async ({ jobTitle, location, timeframe = "3months" }) => {
    console.log(`Analyzing job market for ${jobTitle} in ${location || "all locations"} over ${timeframe}`);
    
    // Mock job market analysis data
    const marketData = {
      jobTitle,
      location: location || "Global",
      timeframe,
      totalJobs: Math.floor(Math.random() * 5000) + 1000,
      averageSalary: `$${(Math.random() * 50000 + 50000).toFixed(0)}`,
      topSkills: ["JavaScript", "React", "Node.js", "Python", "AWS"],
      growthTrend: Math.random() > 0.5 ? "increasing" : "stable",
      competitionLevel: ["Low", "Medium", "High"][Math.floor(Math.random() * 3)],
      topCompanies: ["TechCorp", "InnovateLab", "StartupXYZ", "BigTech Inc", "ScaleUp Co"],
      insights: [
        "Remote opportunities are increasing",
        "Full-stack skills are in high demand",
        "AI/ML knowledge is becoming more valuable",
        "Startup sector is growing rapidly"
      ]
    };
    
    return JSON.stringify(marketData, null, 2);
  }
});

/**
 * Job application tracker
 * Keeps track of job applications and their status
 */
const trackApplication = tool({
  description: "Track job application status and manage application pipeline",
  inputSchema: z.object({
    action: z.enum(["add", "update", "list", "delete"]).describe("Action to perform"),
    applicationId: z.string().optional().describe("ID of the application (for update/delete)"),
    companyName: z.string().optional().describe("Name of the company"),
    jobTitle: z.string().optional().describe("Job title"),
    status: z.enum(["applied", "screening", "interview", "offer", "rejected", "accepted"]).optional().describe("Application status"),
    applicationDate: z.string().optional().describe("Date when application was submitted"),
    notes: z.string().optional().describe("Additional notes about the application")
  }),
  execute: async ({ action, applicationId, companyName, jobTitle, status, applicationDate, notes }) => {
    const { agent } = getCurrentAgent<Chat>();
    
    // In a real implementation, this would interact with a database
    // For now, we'll use a simple in-memory storage simulation
    switch (action) {
      case "add":
        const newId = `app_${Date.now()}`;
        const application = {
          id: newId,
          companyName,
          jobTitle,
          status: status || "applied",
          applicationDate: applicationDate || new Date().toISOString().split('T')[0],
          notes: notes || ""
        };
        return `Application added successfully: ${JSON.stringify(application, null, 2)}`;
      
      case "list":
        // Mock list of applications
        const mockApplications = [
          {
            id: "app_1",
            companyName: "TechCorp",
            jobTitle: "Software Engineer",
            status: "interview",
            applicationDate: "2024-01-15",
            notes: "Second round interview scheduled"
          },
          {
            id: "app_2",
            companyName: "StartupXYZ",
            jobTitle: "Full Stack Developer",
            status: "applied",
            applicationDate: "2024-01-18",
            notes: "Applied through LinkedIn"
          }
        ];
        return JSON.stringify(mockApplications, null, 2);
      
      case "update":
        return `Application ${applicationId} updated with status: ${status}`;
      
      case "delete":
        return `Application ${applicationId} removed from tracking`;
      
      default:
        return "Invalid action specified";
    }
  }
});

const scheduleTask = tool({
  description: "A tool to schedule a task to be executed at a later time",
  inputSchema: scheduleSchema,
  execute: async ({ when, description }) => {
    // we can now read the agent context from the ALS store
    const { agent } = getCurrentAgent<Chat>();

    function throwError(msg: string): string {
      throw new Error(msg);
    }
    if (when.type === "no-schedule") {
      return "Not a valid schedule input";
    }
    const input =
      when.type === "scheduled"
        ? when.date // scheduled
        : when.type === "delayed"
          ? when.delayInSeconds // delayed
          : when.type === "cron"
            ? when.cron // cron
            : throwError("not a valid schedule input");
    try {
      agent!.schedule(input!, "executeTask", description);
    } catch (error) {
      console.error("error scheduling task", error);
      return `Error scheduling task: ${error}`;
    }
    return `Task scheduled for type "${when.type}" : ${input}`;
  }
});

/**
 * Tool to list all scheduled tasks
 * This executes automatically without requiring human confirmation
 */
const getScheduledTasks = tool({
  description: "List all tasks that have been scheduled",
  inputSchema: z.object({}),
  execute: async () => {
    const { agent } = getCurrentAgent<Chat>();

    try {
      const tasks = agent!.getSchedules();
      if (!tasks || tasks.length === 0) {
        return "No scheduled tasks found.";
      }
      return tasks;
    } catch (error) {
      console.error("Error listing scheduled tasks", error);
      return `Error listing scheduled tasks: ${error}`;
    }
  }
});

/**
 * Tool to cancel a scheduled task by its ID
 * This executes automatically without requiring human confirmation
 */
const cancelScheduledTask = tool({
  description: "Cancel a scheduled task using its ID",
  inputSchema: z.object({
    taskId: z.string().describe("The ID of the task to cancel")
  }),
  execute: async ({ taskId }) => {
    const { agent } = getCurrentAgent<Chat>();
    try {
      await agent!.cancelSchedule(taskId);
      return `Task ${taskId} has been successfully canceled.`;
    } catch (error) {
      console.error("Error canceling scheduled task", error);
      return `Error canceling task ${taskId}: ${error}`;
    }
  }
});

/**
 * Export all available tools
 * These will be provided to the AI model to describe available capabilities
 */
export const tools = {
  searchJobs,
  generateCoverLetter,
  generatePDFCoverLetter,
  sendApplicationEmail,
  analyzeJobMarket,
  trackApplication,
  scheduleTask,
  getScheduledTasks,
  cancelScheduledTask
} satisfies ToolSet;

/**
 * Implementation of confirmation-required tools
 * This object contains the actual logic for tools that need human approval
 * Each function here corresponds to a tool above that doesn't have an execute function
 */
export const executions = {
  searchJobs: async ({ 
    cvContent, 
    jobTitle, 
    location, 
    experience, 
    skills, 
    industry, 
    salaryRange, 
    remote 
  }: { 
    cvContent: string;
    jobTitle?: string;
    location?: string;
    experience?: string;
    skills?: string[];
    industry?: string;
    salaryRange?: string;
    remote?: boolean;
  }) => {
    console.log(`Searching jobs for: ${jobTitle || "any role"} in ${location || "any location"}`);
    
    // Mock job search results - in a real implementation, this would call job APIs
    const mockJobs = [
      {
        id: "job_1",
        title: "Senior Software Engineer",
        company: "TechCorp Inc",
        location: "San Francisco, CA",
        salary: "$120,000 - $150,000",
        type: "Full-time",
        remote: true,
        description: "We're looking for a senior software engineer with 5+ years experience in React, Node.js, and cloud technologies.",
        requirements: ["React", "Node.js", "AWS", "TypeScript", "5+ years experience"],
        matchScore: 92,
        postedDate: "2024-01-15",
        applicationUrl: "https://techcorp.com/careers/senior-engineer"
      },
      {
        id: "job_2",
        title: "Full Stack Developer",
        company: "StartupXYZ",
        location: "New York, NY",
        salary: "$90,000 - $120,000",
        type: "Full-time",
        remote: true,
        description: "Join our growing startup as a full stack developer. Work with modern technologies and help build innovative products.",
        requirements: ["JavaScript", "React", "Python", "PostgreSQL", "3+ years experience"],
        matchScore: 88,
        postedDate: "2024-01-18",
        applicationUrl: "https://startupxyz.com/jobs/fullstack"
      },
      {
        id: "job_3",
        title: "Frontend Engineer",
        company: "DesignLab",
        location: "Remote",
        salary: "$85,000 - $110,000",
        type: "Full-time",
        remote: true,
        description: "We need a creative frontend engineer to build beautiful user interfaces and exceptional user experiences.",
        requirements: ["React", "TypeScript", "CSS", "Figma", "4+ years experience"],
        matchScore: 85,
        postedDate: "2024-01-20",
        applicationUrl: "https://designlab.com/careers/frontend"
      },
      {
        id: "job_4",
        title: "DevOps Engineer",
        company: "CloudScale",
        location: "Austin, TX",
        salary: "$100,000 - $130,000",
        type: "Full-time",
        remote: false,
        description: "Help us scale our infrastructure and improve deployment processes. Experience with Kubernetes and AWS required.",
        requirements: ["Kubernetes", "AWS", "Docker", "CI/CD", "4+ years experience"],
        matchScore: 82,
        postedDate: "2024-01-22",
        applicationUrl: "https://cloudscale.com/jobs/devops"
      },
      {
        id: "job_5",
        title: "Software Engineer",
        company: "InnovateTech",
        location: "Seattle, WA",
        salary: "$95,000 - $125,000",
        type: "Full-time",
        remote: true,
        description: "Build cutting-edge software solutions in a collaborative environment. Great opportunity for growth.",
        requirements: ["JavaScript", "React", "Node.js", "MongoDB", "3+ years experience"],
        matchScore: 80,
        postedDate: "2024-01-25",
        applicationUrl: "https://innovatetech.com/careers/software-engineer"
      },
      {
        id: "job_6",
        title: "Backend Developer",
        company: "DataFlow Systems",
        location: "Chicago, IL",
        salary: "$90,000 - $115,000",
        type: "Full-time",
        remote: true,
        description: "Work on high-performance backend systems handling millions of requests. Strong problem-solving skills required.",
        requirements: ["Python", "Django", "PostgreSQL", "Redis", "4+ years experience"],
        matchScore: 78,
        postedDate: "2024-01-28",
        applicationUrl: "https://dataflow.com/jobs/backend"
      },
      {
        id: "job_7",
        title: "Mobile App Developer",
        company: "AppVenture",
        location: "Los Angeles, CA",
        salary: "$85,000 - $110,000",
        type: "Full-time",
        remote: true,
        description: "Develop iOS and Android applications using React Native. Join our mobile-first company.",
        requirements: ["React Native", "iOS", "Android", "JavaScript", "3+ years experience"],
        matchScore: 75,
        postedDate: "2024-01-30",
        applicationUrl: "https://appventure.com/careers/mobile"
      },
      {
        id: "job_8",
        title: "QA Engineer",
        company: "TestMaster",
        location: "Boston, MA",
        salary: "$70,000 - $95,000",
        type: "Full-time",
        remote: true,
        description: "Ensure software quality through comprehensive testing strategies. Automation experience preferred.",
        requirements: ["Test Automation", "Selenium", "JavaScript", "Cypress", "3+ years experience"],
        matchScore: 72,
        postedDate: "2024-02-01",
        applicationUrl: "https://testmaster.com/jobs/qa"
      },
      {
        id: "job_9",
        title: "Data Engineer",
        company: "BigData Corp",
        location: "Remote",
        salary: "$105,000 - $135,000",
        type: "Full-time",
        remote: true,
        description: "Build and maintain data pipelines for large-scale analytics. Experience with Spark and Kafka required.",
        requirements: ["Python", "Spark", "Kafka", "AWS", "SQL", "4+ years experience"],
        matchScore: 70,
        postedDate: "2024-02-03",
        applicationUrl: "https://bigdata.com/careers/data-engineer"
      },
      {
        id: "job_10",
        title: "Product Manager",
        company: "ProductFirst",
        location: "San Diego, CA",
        salary: "$110,000 - $140,000",
        type: "Full-time",
        remote: true,
        description: "Lead product development from conception to launch. Technical background with PM experience required.",
        requirements: ["Product Management", "Agile", "Technical Background", "Analytics", "5+ years experience"],
        matchScore: 68,
        postedDate: "2024-02-05",
        applicationUrl: "https://productfirst.com/jobs/pm"
      }
    ];

    // Filter and sort based on preferences
    let filteredJobs = mockJobs;
    
    if (remote !== undefined) {
      filteredJobs = filteredJobs.filter(job => job.remote === remote);
    }
    
    if (location) {
      filteredJobs = filteredJobs.filter(job => 
        job.location.toLowerCase().includes(location.toLowerCase()) || job.remote
      );
    }

    // Sort by match score (descending)
    filteredJobs.sort((a, b) => b.matchScore - a.matchScore);
    
    // Return top 10
    const topJobs = filteredJobs.slice(0, 10);
    
    return {
      totalFound: filteredJobs.length,
      searchCriteria: {
        jobTitle: jobTitle || "any",
        location: location || "any",
        experience: experience || "any",
        skills: skills || [],
        industry: industry || "any",
        salaryRange: salaryRange || "any",
        remote: remote ?? "any"
      },
      jobs: topJobs
    };
  },

  generateCoverLetter: async ({ 
    cvContent, 
    jobDescription, 
    companyName, 
    jobTitle, 
    recruiterName, 
    tone = "professional" 
  }: {
    cvContent: string;
    jobDescription: string;
    companyName: string;
    jobTitle: string;
    recruiterName?: string;
    tone?: "professional" | "friendly" | "formal";
  }) => {
    console.log(`Generating ${tone} cover letter for ${jobTitle} at ${companyName}`);
    
    // In a real implementation, this would use AI to generate a personalized cover letter
    // For now, we'll create a template-based approach
    
    const greeting = recruiterName ? `Dear ${recruiterName},` : "Dear Hiring Manager,";
    
    const coverLetter = `${greeting}

I am writing to express my strong interest in the ${jobTitle} position at ${companyName}. After reviewing the job description, I am excited about the opportunity to contribute to your team with my relevant experience and skills.

Based on my CV and the requirements outlined in your job posting, I believe I would be an excellent fit for this role. My background includes experience that directly aligns with your needs, and I am particularly drawn to ${companyName}'s mission and values.

Key highlights from my experience that match your requirements:
• Strong technical skills that align with the technologies mentioned in the job description
• Proven track record of delivering high-quality results in similar roles
• Collaborative approach to working with cross-functional teams
• Passion for continuous learning and staying current with industry trends

I am excited about the possibility of bringing my expertise to ${companyName} and contributing to your continued success. I would welcome the opportunity to discuss how my background and enthusiasm can benefit your team.

Thank you for considering my application. I look forward to hearing from you.

Best regards,
[Your Name]`;

    return {
      coverLetter,
      metadata: {
        companyName,
        jobTitle,
        tone,
        generatedAt: new Date().toISOString(),
        wordCount: coverLetter.split(' ').length
      }
    };
  },

  generatePDFCoverLetter: async ({ 
    coverLetterContent, 
    applicantName, 
    applicantEmail, 
    applicantPhone 
  }: {
    coverLetterContent: string;
    applicantName: string;
    applicantEmail?: string;
    applicantPhone?: string;
  }) => {
    console.log(`Generating PDF cover letter for ${applicantName}`);
    
    // In a real implementation, this would generate an actual PDF
    // For now, we'll return a formatted version with metadata
    
    const formattedContent = `
${applicantName}
${applicantEmail ? `Email: ${applicantEmail}` : ''}
${applicantPhone ? `Phone: ${applicantPhone}` : ''}
${new Date().toLocaleDateString()}

${coverLetterContent}
    `;
    
    return {
      success: true,
      message: "PDF cover letter generated successfully",
      filename: `cover_letter_${applicantName.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}.pdf`,
      content: formattedContent,
      metadata: {
        applicantName,
        applicantEmail,
        applicantPhone,
        generatedAt: new Date().toISOString(),
        pages: Math.ceil(formattedContent.length / 2000) // Rough estimate
      }
    };
  },

  sendApplicationEmail: async ({ 
    recruiterEmail, 
    recruiterName, 
    subject, 
    emailBody, 
    cvAttachment, 
    coverLetterAttachment, 
    applicantName, 
    applicantEmail 
  }: {
    recruiterEmail: string;
    recruiterName?: string;
    subject: string;
    emailBody: string;
    cvAttachment: string;
    coverLetterAttachment: string;
    applicantName: string;
    applicantEmail: string;
  }) => {
    console.log(`Sending application email to ${recruiterEmail} from ${applicantEmail}`);
    
    // In a real implementation, this would use an email service like SendGrid, AWS SES, etc.
    // For now, we'll simulate the email sending process
    
    const emailData = {
      from: applicantEmail,
      to: recruiterEmail,
      subject,
      body: emailBody,
      attachments: [
        {
          name: "CV.pdf",
          content: cvAttachment
        },
        {
          name: "CoverLetter.pdf",
          content: coverLetterAttachment
        }
      ],
      metadata: {
        applicantName,
        recruiterName,
        sentAt: new Date().toISOString()
      }
    };
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: `Application email sent successfully to ${recruiterEmail}`,
      emailId: `email_${Date.now()}`,
      details: {
        recipient: recruiterEmail,
        subject,
        attachmentCount: 2,
        sentAt: new Date().toISOString()
      }
    };
  }
};
