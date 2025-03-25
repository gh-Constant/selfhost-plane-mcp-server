#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import dotenv from "dotenv";

import { PLANE_TOOLS } from "./tools.js";
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

// Initialize the server with metadata and capabilities
const server = new Server(
  {
    name: "plane-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register handler for listing available tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: PLANE_TOOLS,
}));

// Register handler for calling tools
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args = {} } = request.params;

    // Normalize tool name to handle both hyphen and underscore formats
    const normalizedName = name.replace(/_/g, "-");

    switch (normalizedName) {
      // Workspace tools
      case "list-workspaces": {
        const workspaces = await planeClient.listWorkspaces();
        return {
          content: [{ type: "text", text: JSON.stringify(workspaces, null, 2) }],
          isError: false,
        };
      }

      case "get-workspace": {
        const workspace = await planeClient.getWorkspace();
        return {
          content: [{ type: "text", text: JSON.stringify(workspace, null, 2) }],
          isError: false,
        };
      }

      // Project tools
      case "list-projects": {
        const projects = await planeClient.listProjects();
        return {
          content: [{ type: "text", text: JSON.stringify(projects, null, 2) }],
          isError: false,
        };
      }

      case "get-project": {
        if (!args.project_id) {
          throw new Error("project_id is required");
        }
        const project = await planeClient.getProject(args.project_id);
        return {
          content: [{ type: "text", text: JSON.stringify(project, null, 2) }],
          isError: false,
        };
      }

      // State tools
      case "get-project-states": {
        if (!args.project_id) {
          throw new Error("project_id is required");
        }
        const states = await planeClient.getProjectStates(args.project_id);
        return {
          content: [{ type: "text", text: JSON.stringify(states, null, 2) }],
          isError: false,
        };
      }

      // Cycle tools
      case "list-cycles": {
        if (!args.project_id) {
          throw new Error("project_id is required");
        }
        const cycles = await planeClient.listCycles(args.project_id);
        return {
          content: [{ type: "text", text: JSON.stringify(cycles, null, 2) }],
          isError: false,
        };
      }

      case "get-cycle": {
        if (!args.project_id || !args.cycle_id) {
          throw new Error("project_id and cycle_id are required");
        }
        const cycle = await planeClient.getCycle(args.project_id, args.cycle_id);
        return {
          content: [{ type: "text", text: JSON.stringify(cycle, null, 2) }],
          isError: false,
        };
      }

      // Module tools
      case "list-modules": {
        if (!args.project_id) {
          throw new Error("project_id is required");
        }
        const modules = await planeClient.listModules(args.project_id);
        return {
          content: [{ type: "text", text: JSON.stringify(modules, null, 2) }],
          isError: false,
        };
      }

      case "get-module": {
        if (!args.project_id || !args.module_id) {
          throw new Error("project_id and module_id are required");
        }
        const module = await planeClient.getModule(args.project_id, args.module_id);
        return {
          content: [{ type: "text", text: JSON.stringify(module, null, 2) }],
          isError: false,
        };
      }

      // Issue tools
      case "list-issues": {
        if (!args.project_id) {
          throw new Error("project_id is required");
        }
        
        // Extract filter parameters
        const { project_id, ...filters } = args;
        const issues = await planeClient.listIssues(project_id, filters);
        return {
          content: [{ type: "text", text: JSON.stringify(issues, null, 2) }],
          isError: false,
        };
      }

      case "get-issue": {
        if (!args.project_id || !args.issue_id) {
          throw new Error("project_id and issue_id are required");
        }
        const issue = await planeClient.getIssue(args.project_id, args.issue_id);
        return {
          content: [{ type: "text", text: JSON.stringify(issue, null, 2) }],
          isError: false,
        };
      }

      case "create-issue": {
        if (!args.project_id || !args.name) {
          throw new Error("project_id and name are required");
        }
        
        // Extract issue data
        const { project_id, ...issueData } = args;
        const newIssue = await planeClient.createIssue(project_id, issueData);
        return {
          content: [{ type: "text", text: JSON.stringify(newIssue, null, 2) }],
          isError: false,
        };
      }

      case "update-issue": {
        if (!args.project_id || !args.issue_id) {
          throw new Error("project_id and issue_id are required");
        }
        
        // Extract update data
        const { project_id, issue_id, ...updateData } = args;
        const updatedIssue = await planeClient.updateIssue(project_id, issue_id, updateData);
        return {
          content: [{ type: "text", text: JSON.stringify(updatedIssue, null, 2) }],
          isError: false,
        };
      }

      case "delete-issue": {
        if (!args.project_id || !args.issue_id) {
          throw new Error("project_id and issue_id are required");
        }
        const result = await planeClient.deleteIssue(args.project_id, args.issue_id);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
          isError: false,
        };
      }

      // Comment tools
      case "list-issue-comments": {
        if (!args.project_id || !args.issue_id) {
          throw new Error("project_id and issue_id are required");
        }
        const comments = await planeClient.listIssueComments(args.project_id, args.issue_id);
        return {
          content: [{ type: "text", text: JSON.stringify(comments, null, 2) }],
          isError: false,
        };
      }

      case "add-issue-comment": {
        if (!args.project_id || !args.issue_id || !args.comment_html) {
          throw new Error("project_id, issue_id, and comment_html are required");
        }
        const commentData = { comment_html: args.comment_html };
        const comment = await planeClient.addIssueComment(args.project_id, args.issue_id, commentData);
        return {
          content: [{ type: "text", text: JSON.stringify(comment, null, 2) }],
          isError: false,
        };
      }

      default:
        return {
          content: [{ type: "text", text: `Unknown tool: ${name}` }],
          isError: true,
        };
    }
  } catch (error) {
    // Handle any errors that occur during API calls
    console.error("Error:", error);
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

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