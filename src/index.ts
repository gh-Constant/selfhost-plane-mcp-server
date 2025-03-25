#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import dotenv from "dotenv";

import { PlaneApiClient } from "./api.js";

// Load environment variables from .env file
dotenv.config();

// Retrieve the Plane API key from environment variables
const PLANE_API_KEY = process.env.PLANE_API_KEY;
const PLANE_BASE_URL = process.env.PLANE_BASE_URL;
const PLANE_WORKSPACE_SLUG = process.env.PLANE_WORKSPACE_SLUG;

if (!PLANE_API_KEY) {
  console.error("Error: PLANE_API_KEY environment variable is required");
  process.exit(1);
}

if (!PLANE_BASE_URL) {
  console.error("Error: PLANE_BASE_URL environment variable is required");
  process.exit(1);
}

if (!PLANE_WORKSPACE_SLUG) {
  console.error("Error: PLANE_WORKSPACE_SLUG environment variable is required");
  process.exit(1);
}

// Initialize the Plane API client
const planeClient = new PlaneApiClient({
  apiKey: PLANE_API_KEY,
  baseUrl: PLANE_BASE_URL,
  workspaceSlug: PLANE_WORKSPACE_SLUG,
});

// Initialize the MCP server with metadata
const server = new McpServer({
  name: "plane-mcp-server",
  version: "1.0.0"
});

// Workspace tools
server.tool(
  "list-workspaces",
  {},
  async () => {
    const workspaces = await planeClient.listWorkspaces();
    return {
      content: [{ type: "text", text: JSON.stringify(workspaces, null, 2) }]
    };
  }
);

server.tool(
  "get-workspace",
  {},
  async () => {
    const workspace = await planeClient.getWorkspace();
    return {
      content: [{ type: "text", text: JSON.stringify(workspace, null, 2) }]
    };
  }
);

// Project tools
server.tool(
  "list-projects",
  {},
  async () => {
    const projects = await planeClient.listProjects();
    return {
      content: [{ type: "text", text: JSON.stringify(projects, null, 2) }]
    };
  }
);

server.tool(
  "get-project",
  {
    project_id: z.string().describe("ID of the project to retrieve")
  },
  async ({ project_id }) => {
    const project = await planeClient.getProject(project_id);
    return {
      content: [{ type: "text", text: JSON.stringify(project, null, 2) }]
    };
  }
);

// State tools
server.tool(
  "get-project-states",
  {
    project_id: z.string().describe("ID of the project to get states from")
  },
  async ({ project_id }) => {
    const states = await planeClient.getProjectStates(project_id);
    return {
      content: [{ type: "text", text: JSON.stringify(states, null, 2) }]
    };
  }
);

// Cycle tools
server.tool(
  "list-cycles",
  {
    project_id: z.string().describe("ID of the project to get cycles from")
  },
  async ({ project_id }) => {
    const cycles = await planeClient.listCycles(project_id);
    return {
      content: [{ type: "text", text: JSON.stringify(cycles, null, 2) }]
    };
  }
);

server.tool(
  "get-cycle",
  {
    project_id: z.string().describe("ID of the project containing the cycle"),
    cycle_id: z.string().describe("ID of the cycle to retrieve")
  },
  async ({ project_id, cycle_id }) => {
    const cycle = await planeClient.getCycle(project_id, cycle_id);
    return {
      content: [{ type: "text", text: JSON.stringify(cycle, null, 2) }]
    };
  }
);

// Module tools
server.tool(
  "list-modules",
  {
    project_id: z.string().describe("ID of the project to get modules from")
  },
  async ({ project_id }) => {
    const modules = await planeClient.listModules(project_id);
    return {
      content: [{ type: "text", text: JSON.stringify(modules, null, 2) }]
    };
  }
);

server.tool(
  "get-module",
  {
    project_id: z.string().describe("ID of the project containing the module"),
    module_id: z.string().describe("ID of the module to retrieve")
  },
  async ({ project_id, module_id }) => {
    const module = await planeClient.getModule(project_id, module_id);
    return {
      content: [{ type: "text", text: JSON.stringify(module, null, 2) }]
    };
  }
);

// Issue tools
server.tool(
  "list-issues",
  {
    project_id: z.string().describe("ID of the project to get issues from"),
    state_id: z.string().optional().describe("Filter by state ID (optional)"),
    priority: z.enum(["urgent", "high", "medium", "low", "none"]).optional().describe("Filter by priority (optional)"),
    cycle_id: z.string().optional().describe("Filter by cycle ID (optional)"),
    module_id: z.string().optional().describe("Filter by module ID (optional)"),
    assignee_id: z.string().optional().describe("Filter by assignee ID (optional)"),
    created_by: z.string().optional().describe("Filter by creator ID (optional)"),
    search: z.string().optional().describe("Search term to filter issues (optional)"),
    limit: z.number().optional().describe("Maximum number of issues to return (default: 50)")
  },
  async (args) => {
    const { project_id, ...filters } = args;
    const issues = await planeClient.listIssues(project_id, filters);
    return {
      content: [{ type: "text", text: JSON.stringify(issues, null, 2) }]
    };
  }
);

server.tool(
  "get-issue",
  {
    project_id: z.string().describe("ID of the project containing the issue"),
    issue_id: z.string().describe("ID of the issue to retrieve")
  },
  async ({ project_id, issue_id }) => {
    const issue = await planeClient.getIssue(project_id, issue_id);
    return {
      content: [{ type: "text", text: JSON.stringify(issue, null, 2) }]
    };
  }
);

server.tool(
  "create-issue",
  {
    project_id: z.string().describe("ID of the project where the issue should be created"),
    name: z.string().describe("Title of the issue"),
    description_html: z.string().optional().describe("HTML description of the issue"),
    priority: z.enum(["urgent", "high", "medium", "low", "none"]).optional().describe("Priority of the issue"),
    state_id: z.string().optional().describe("ID of the state for this issue (optional)"),
    assignees: z.array(z.string()).optional().describe("Array of user IDs to assign to this issue (optional)"),
    cycle_id: z.string().optional().describe("ID of the cycle to associate with this issue (optional)"),
    module_id: z.string().optional().describe("ID of the module to associate with this issue (optional)"),
    labels: z.array(z.string()).optional().describe("Array of label IDs to add to this issue (optional)")
  },
  async (args) => {
    const { project_id, ...issueData } = args;
    const newIssue = await planeClient.createIssue(project_id, issueData);
    return {
      content: [{ type: "text", text: JSON.stringify(newIssue, null, 2) }]
    };
  }
);

server.tool(
  "update-issue",
  {
    project_id: z.string().describe("ID of the project containing the issue"),
    issue_id: z.string().describe("ID of the issue to update"),
    name: z.string().optional().describe("Updated title of the issue (optional)"),
    description_html: z.string().optional().describe("Updated HTML description of the issue (optional)"),
    priority: z.enum(["urgent", "high", "medium", "low", "none"]).optional().describe("Updated priority of the issue (optional)"),
    state_id: z.string().optional().describe("Updated state ID of the issue (optional)"),
    assignees: z.array(z.string()).optional().describe("Updated array of user IDs to assign to this issue (optional)"),
    cycle_id: z.string().optional().describe("Updated cycle ID for this issue (optional)"),
    module_id: z.string().optional().describe("Updated module ID for this issue (optional)"),
    labels: z.array(z.string()).optional().describe("Updated array of label IDs for this issue (optional)")
  },
  async (args) => {
    const { project_id, issue_id, ...updateData } = args;
    const updatedIssue = await planeClient.updateIssue(project_id, issue_id, updateData);
    return {
      content: [{ type: "text", text: JSON.stringify(updatedIssue, null, 2) }]
    };
  }
);

server.tool(
  "delete-issue",
  {
    project_id: z.string().describe("ID of the project containing the issue"),
    issue_id: z.string().describe("ID of the issue to delete")
  },
  async ({ project_id, issue_id }) => {
    const result = await planeClient.deleteIssue(project_id, issue_id);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
    };
  }
);

// Comment tools
server.tool(
  "list-issue-comments",
  {
    project_id: z.string().describe("ID of the project containing the issue"),
    issue_id: z.string().describe("ID of the issue to get comments from")
  },
  async ({ project_id, issue_id }) => {
    const comments = await planeClient.listIssueComments(project_id, issue_id);
    return {
      content: [{ type: "text", text: JSON.stringify(comments, null, 2) }]
    };
  }
);

server.tool(
  "add-issue-comment",
  {
    project_id: z.string().describe("ID of the project containing the issue"),
    issue_id: z.string().describe("ID of the issue to add comment to"),
    comment_html: z.string().describe("HTML content of the comment")
  },
  async ({ project_id, issue_id, comment_html }) => {
    const commentData = { comment_html };
    const comment = await planeClient.addIssueComment(project_id, issue_id, commentData);
    return {
      content: [{ type: "text", text: JSON.stringify(comment, null, 2) }]
    };
  }
);

/**
 * Initializes and runs the MCP server using stdio for communication
 */
async function runServer() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Plane MCP Server running on stdio");
  } catch (error) {
    console.error("Fatal error running server:", error);
    process.exit(1);
  }
}

// Start the server
runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
}); 