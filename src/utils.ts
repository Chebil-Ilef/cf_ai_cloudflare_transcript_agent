// via https://github.com/vercel/ai/blob/main/examples/next-openai/app/api/use-chat-human-in-the-loop/utils.ts

import type {
  UIMessage,
  UIMessageStreamWriter,
  ToolSet,
  ToolCallOptions
} from "ai";
import { convertToModelMessages, isToolUIPart } from "ai";
import { APPROVAL } from "./shared";

function isValidToolName<K extends PropertyKey, T extends object>(
  key: K,
  obj: T
): key is K & keyof T {
  return key in obj;
}

/**
 * Processes tool invocations where human input is required, executing tools when authorized.
 */
export async function processToolCalls<Tools extends ToolSet>({
  dataStream,
  messages,
  executions
}: {
  tools: Tools; // used for type inference
  dataStream: UIMessageStreamWriter;
  messages: UIMessage[];
  executions: Record<
    string,
    // biome-ignore lint/suspicious/noExplicitAny: needs a better type
    (args: any, context: ToolCallOptions) => Promise<unknown>
  >;
}): Promise<UIMessage[]> {
  // Process all messages, not just the last one
  const processedMessages = await Promise.all(
    messages.map(async (message) => {
      const parts = message.parts;
      if (!parts) return message;

      const processedParts = await Promise.all(
        parts.map(async (part) => {
          // Only process tool UI parts
          if (!isToolUIPart(part)) return part;

          const toolName = part.type.replace(
            "tool-",
            ""
          ) as keyof typeof executions;

          // Only process tools that require confirmation (are in executions object) and are in 'input-available' state
          if (!(toolName in executions) || part.state !== "output-available")
            return part;

          let result: unknown;

          if (part.output === APPROVAL.YES) {
            // User approved the tool execution
            if (!isValidToolName(toolName, executions)) {
              return part;
            }

            const toolInstance = executions[toolName];
            if (toolInstance) {
              result = await toolInstance(part.input, {
                messages: convertToModelMessages(messages),
                toolCallId: part.toolCallId
              });
            } else {
              result = "Error: No execute function found on tool";
            }
          } else if (part.output === APPROVAL.NO) {
            result = "Error: User denied access to tool execution";
          } else {
            // If no approval input yet, leave the part as-is for user interaction
            return part;
          }

          // Forward updated tool result to the client.
          dataStream.write({
            type: "tool-output-available",
            toolCallId: part.toolCallId,
            output: result
          });

          // Return updated tool part with the actual result.
          return {
            ...part,
            output: result
          };
        })
      );

      return { ...message, parts: processedParts };
    })
  );

  return processedMessages;
}

/**
 * Clean up incomplete tool calls from messages before sending to API
 * Prevents API errors from interrupted or failed tool executions
 */
export function cleanupMessages(messages: UIMessage[]): UIMessage[] {
  return messages.filter((message) => {
    if (!message.parts) return true;

    // Filter out messages with incomplete tool calls
    const hasIncompleteToolCall = message.parts.some((part) => {
      if (!isToolUIPart(part)) return false;
      // Remove tool calls that are still streaming or awaiting input without results
      return (
        part.state === "input-streaming" ||
        (part.state === "input-available" && !part.output && !part.errorText)
      );
    });

    return !hasIncompleteToolCall;
  });
}

/**
 * Job Search Utility Functions
 */

/**
 * Extract key skills from CV content
 */
export function extractSkillsFromCV(cvContent: string): string[] {
  const commonSkills = [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "Java",
    "C++",
    "C#",
    "HTML",
    "CSS",
    "Angular",
    "Vue.js",
    "PHP",
    "Ruby",
    "Go",
    "Rust",
    "Swift",
    "AWS",
    "Azure",
    "Google Cloud",
    "Docker",
    "Kubernetes",
    "Git",
    "SQL",
    "MongoDB",
    "PostgreSQL",
    "MySQL",
    "Redis",
    "GraphQL",
    "REST API",
    "Microservices",
    "Machine Learning",
    "AI",
    "Data Science",
    "DevOps",
    "CI/CD",
    "Jenkins",
    "Terraform",
    "Ansible",
    "Linux",
    "Agile",
    "Scrum",
    "Project Management"
  ];

  const foundSkills = commonSkills.filter((skill) =>
    cvContent.toLowerCase().includes(skill.toLowerCase())
  );

  return foundSkills;
}

/**
 * Generate email subject line for job application
 */
export function generateEmailSubject(
  jobTitle: string,
  _companyName: string,
  applicantName: string
): string {
  return `Application for ${jobTitle} Position - ${applicantName}`;
}

/**
 * Generate professional email body for job application
 */
export function generateApplicationEmailBody(
  jobTitle: string,
  companyName: string,
  recruiterName?: string
): string {
  const greeting = recruiterName
    ? `Dear ${recruiterName},`
    : "Dear Hiring Manager,";

  return `${greeting}

I hope this email finds you well. I am writing to submit my application for the ${jobTitle} position at ${companyName}.

I have attached my resume and cover letter for your review. I am excited about the opportunity to contribute to ${companyName} and believe my skills and experience align well with the requirements for this role.

I would welcome the opportunity to discuss my qualifications further and am available for an interview at your convenience.

Thank you for considering my application. I look forward to hearing from you.

Best regards,
[Your Name]`;
}

/**
 * Calculate job match score based on skills overlap
 */
export function calculateJobMatchScore(
  cvSkills: string[],
  jobRequirements: string[]
): number {
  if (jobRequirements.length === 0) return 0;

  const matchingSkills = cvSkills.filter((skill) =>
    jobRequirements.some(
      (req) =>
        req.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(req.toLowerCase())
    )
  );

  return Math.round((matchingSkills.length / jobRequirements.length) * 100);
}

/**
 * Format salary range for display
 */
export function formatSalaryRange(
  min: number,
  max: number,
  currency = "$"
): string {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K`;
    }
    return num.toString();
  };

  return `${currency}${formatNumber(min)} - ${currency}${formatNumber(max)}`;
}

/**
 * Generate application tracking ID
 */
export function generateApplicationId(): string {
  return `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
