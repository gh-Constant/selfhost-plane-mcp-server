#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import { PlaneApiClient } from "./api.js";

// Load environment variables from .env file
dotenv.config();

// Retrieve the Plane API key from environment variables
const PLANE_API_KEY = process.env.PLANE_API_KEY;
const PLANE_BASE_URL = process.env.PLANE_BASE_URL;
const PLANE_WORKSPACE_SLUG = process.env.PLANE_WORKSPACE_SLUG;

// Create MCP server and API client only when needed
function createServer() {
  // Initialize the MCP server with metadata
  const server = new McpServer({
    name: "plane-mcp-server",
    version: "1.0.0"
  });

  // Only initialize API client if credentials are provided
  let planeClient: PlaneApiClient | null = null;
  
  // Helper to get or initialize API client
  const getClient = () => {
    if (!planeClient) {
      if (!PLANE_API_KEY) {
        throw new Error("PLANE_API_KEY environment variable is required");
      }
      if (!PLANE_BASE_URL) {
        throw new Error("PLANE_BASE_URL environment variable is required");
      }
      if (!PLANE_WORKSPACE_SLUG) {
        throw new Error("PLANE_WORKSPACE_SLUG environment variable is required");
      }
      
      planeClient = new PlaneApiClient({
        apiKey: PLANE_API_KEY,
        baseUrl: PLANE_BASE_URL,
        workspaceSlug: PLANE_WORKSPACE_SLUG,
      });
    }
    
    return planeClient;
  };

  // Workspace tools
  server.tool(
    "list-workspaces",
    {},
    async () => {
      const workspaces = await getClient().listWorkspaces();
      return {
        content: [{ type: "text", text: JSON.stringify(workspaces, null, 2) }]
      };
    }
  );

  server.tool(
    "get-workspace",
    {},
    async () => {
      const workspace = await getClient().getWorkspace();
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
      const projects = await getClient().listProjects();
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
      const project = await getClient().getProject(project_id);
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
      const states = await getClient().getProjectStates(project_id);
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
      const cycles = await getClient().listCycles(project_id);
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
      const cycle = await getClient().getCycle(project_id, cycle_id);
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
      const modules = await getClient().listModules(project_id);
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
      const module = await getClient().getModule(project_id, module_id);
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
      const issues = await getClient().listIssues(project_id, filters);
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
      const issue = await getClient().getIssue(project_id, issue_id);
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
      const newIssue = await getClient().createIssue(project_id, issueData);
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
      const updatedIssue = await getClient().updateIssue(project_id, issue_id, updateData);
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
      const result = await getClient().deleteIssue(project_id, issue_id);
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
      const comments = await getClient().listIssueComments(project_id, issue_id);
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
      const comment = await getClient().addIssueComment(project_id, issue_id, commentData);
      return {
        content: [{ type: "text", text: JSON.stringify(comment, null, 2) }]
      };
    }
  );

  return server;
}

/**
 * Initializes and runs the MCP server
 */
async function runServer() {
  try {
    const server = createServer();
    
    // Check if we're running in a Smithery environment
    const port = process.env.PORT;
    
    if (port) {
      // Set up Express with SSE for Smithery
      console.error(`Starting server on port ${port}`);
      const app = express();
      
      // Enable CORS
      app.use(cors());
      
      // Add session support
      const sessions = new Map();
      
      // SSE endpoint
      app.get("/sse", async (req, res) => {
        // Set SSE headers
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        
        // Generate session ID (use query param or generate a new one)
        const sessionId = req.query.sessionId?.toString() || Math.random().toString(36).substring(2, 15);
        
        // Create SSE transport
        const transport = new SSEServerTransport("/messages", res);
        
        // Store session
        sessions.set(sessionId, { transport, server });
        
        // Connect server to transport
        await server.connect(transport);
        
        // Clean up when connection closes
        req.on("close", () => {
          sessions.delete(sessionId);
        });
      });
      
      // Messages endpoint to receive client messages
      app.post("/messages", express.json(), async (req, res) => {
        const sessionId = req.query.sessionId?.toString();
        
        if (!sessionId || !sessions.has(sessionId)) {
          return res.status(404).json({ error: "Session not found" });
        }
        
        const { transport } = sessions.get(sessionId);
        
        try {
          await transport.handlePostMessage(req, res);
        } catch (error) {
          console.error("Error handling message:", error);
          res.status(500).json({ error: "Internal server error" });
        }
      });
      
      // Start the server
      app.listen(parseInt(port), () => {
        console.error(`Plane MCP Server running on port ${port}`);
      });
    } else {
      // Stdio transport for local development
      const transport = new StdioServerTransport();
      await server.connect(transport);
      console.error("Plane MCP Server running on stdio");
    }
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