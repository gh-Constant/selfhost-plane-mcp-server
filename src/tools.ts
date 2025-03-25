import { Tool } from "@modelcontextprotocol/sdk/types.js";

// Workspaces
export const LIST_WORKSPACES_TOOL: Tool = {
  name: "list-workspaces",
  description: "List all workspaces the API key has access to",
  inputSchema: {
    type: "object",
    properties: {},
    required: [],
  },
};

export const GET_WORKSPACE_TOOL: Tool = {
  name: "get-workspace",
  description: "Get details about the current workspace",
  inputSchema: {
    type: "object",
    properties: {},
    required: [],
  },
};

// Projects
export const LIST_PROJECTS_TOOL: Tool = {
  name: "list-projects",
  description: "List all projects in the workspace",
  inputSchema: {
    type: "object",
    properties: {},
    required: [],
  },
};

export const GET_PROJECT_TOOL: Tool = {
  name: "get-project",
  description: "Get detailed information about a specific project",
  inputSchema: {
    type: "object",
    properties: {
      project_id: {
        type: "string",
        description: "ID of the project to retrieve",
      },
    },
    required: ["project_id"],
  },
};

// States
export const GET_PROJECT_STATES_TOOL: Tool = {
  name: "get-project-states",
  description: "Get all states available in a project",
  inputSchema: {
    type: "object",
    properties: {
      project_id: {
        type: "string",
        description: "ID of the project to get states from",
      },
    },
    required: ["project_id"],
  },
};

// Cycles
export const LIST_CYCLES_TOOL: Tool = {
  name: "list-cycles",
  description: "List all cycles in a project",
  inputSchema: {
    type: "object",
    properties: {
      project_id: {
        type: "string",
        description: "ID of the project to get cycles from",
      },
    },
    required: ["project_id"],
  },
};

export const GET_CYCLE_TOOL: Tool = {
  name: "get-cycle",
  description: "Get detailed information about a specific cycle",
  inputSchema: {
    type: "object",
    properties: {
      project_id: {
        type: "string",
        description: "ID of the project containing the cycle",
      },
      cycle_id: {
        type: "string",
        description: "ID of the cycle to retrieve",
      },
    },
    required: ["project_id", "cycle_id"],
  },
};

// Modules
export const LIST_MODULES_TOOL: Tool = {
  name: "list-modules",
  description: "List all modules in a project",
  inputSchema: {
    type: "object",
    properties: {
      project_id: {
        type: "string",
        description: "ID of the project to get modules from",
      },
    },
    required: ["project_id"],
  },
};

export const GET_MODULE_TOOL: Tool = {
  name: "get-module",
  description: "Get detailed information about a specific module",
  inputSchema: {
    type: "object",
    properties: {
      project_id: {
        type: "string",
        description: "ID of the project containing the module",
      },
      module_id: {
        type: "string",
        description: "ID of the module to retrieve",
      },
    },
    required: ["project_id", "module_id"],
  },
};

// Issues
export const LIST_ISSUES_TOOL: Tool = {
  name: "list-issues",
  description: "List issues from a project with optional filtering",
  inputSchema: {
    type: "object",
    properties: {
      project_id: {
        type: "string",
        description: "ID of the project to get issues from",
      },
      state_id: {
        type: "string",
        description: "Filter by state ID (optional)",
      },
      priority: {
        type: "string",
        description: "Filter by priority (optional)",
        enum: ["urgent", "high", "medium", "low", "none"],
      },
      cycle_id: {
        type: "string",
        description: "Filter by cycle ID (optional)",
      },
      module_id: {
        type: "string",
        description: "Filter by module ID (optional)",
      },
      assignee_id: {
        type: "string",
        description: "Filter by assignee ID (optional)",
      },
      created_by: {
        type: "string",
        description: "Filter by creator ID (optional)",
      },
      labels: {
        type: "array",
        items: {
          type: "string"
        },
        description: "Filter by labels (optional)"
      },
      search: {
        type: "string",
        description: "Search term to filter issues (optional)",
      },
      limit: {
        type: "number",
        description: "Maximum number of issues to return (default: 50)",
      },
    },
    required: ["project_id"],
  },
};

export const GET_ISSUE_TOOL: Tool = {
  name: "get-issue",
  description: "Get detailed information about a specific issue",
  inputSchema: {
    type: "object",
    properties: {
      project_id: {
        type: "string",
        description: "ID of the project containing the issue",
      },
      issue_id: {
        type: "string",
        description: "ID of the issue to retrieve",
      },
    },
    required: ["project_id", "issue_id"],
  },
};

export const CREATE_ISSUE_TOOL: Tool = {
  name: "create-issue",
  description: "Create a new issue in a project",
  inputSchema: {
    type: "object",
    properties: {
      project_id: {
        type: "string",
        description: "ID of the project where the issue should be created",
      },
      name: {
        type: "string",
        description: "Title of the issue",
      },
      description_html: {
        type: "string",
        description: "HTML description of the issue",
      },
      priority: {
        type: "string",
        description: "Priority of the issue",
        enum: ["urgent", "high", "medium", "low", "none"],
      },
      state_id: {
        type: "string",
        description: "ID of the state for this issue (optional)",
      },
      assignees: {
        type: "array",
        items: {
          type: "string",
        },
        description: "Array of user IDs to assign to this issue (optional)",
      },
      cycle_id: {
        type: "string",
        description: "ID of the cycle to associate with this issue (optional)",
      },
      module_id: {
        type: "string",
        description: "ID of the module to associate with this issue (optional)",
      },
      labels: {
        type: "array",
        items: {
          type: "string",
        },
        description: "Array of label IDs to add to this issue (optional)",
      },
    },
    required: ["project_id", "name"],
  },
};

export const UPDATE_ISSUE_TOOL: Tool = {
  name: "update-issue",
  description: "Update an existing issue in a project",
  inputSchema: {
    type: "object",
    properties: {
      project_id: {
        type: "string",
        description: "ID of the project containing the issue",
      },
      issue_id: {
        type: "string",
        description: "ID of the issue to update",
      },
      name: {
        type: "string",
        description: "Updated title of the issue (optional)",
      },
      description_html: {
        type: "string",
        description: "Updated HTML description of the issue (optional)",
      },
      priority: {
        type: "string",
        description: "Updated priority of the issue (optional)",
        enum: ["urgent", "high", "medium", "low", "none"],
      },
      state_id: {
        type: "string",
        description: "Updated state ID of the issue (optional)",
      },
      assignees: {
        type: "array",
        items: {
          type: "string",
        },
        description: "Updated array of user IDs to assign to this issue (optional)",
      },
      cycle_id: {
        type: "string",
        description: "Updated cycle ID for this issue (optional)",
      },
      module_id: {
        type: "string",
        description: "Updated module ID for this issue (optional)",
      },
      labels: {
        type: "array",
        items: {
          type: "string",
        },
        description: "Updated array of label IDs for this issue (optional)",
      },
    },
    required: ["project_id", "issue_id"],
  },
};

export const DELETE_ISSUE_TOOL: Tool = {
  name: "delete-issue",
  description: "Delete an issue from a project",
  inputSchema: {
    type: "object",
    properties: {
      project_id: {
        type: "string",
        description: "ID of the project containing the issue",
      },
      issue_id: {
        type: "string",
        description: "ID of the issue to delete",
      },
    },
    required: ["project_id", "issue_id"],
  },
};

// Comments
export const LIST_ISSUE_COMMENTS_TOOL: Tool = {
  name: "list-issue-comments",
  description: "List all comments on an issue",
  inputSchema: {
    type: "object",
    properties: {
      project_id: {
        type: "string",
        description: "ID of the project containing the issue",
      },
      issue_id: {
        type: "string",
        description: "ID of the issue to get comments from",
      },
    },
    required: ["project_id", "issue_id"],
  },
};

export const ADD_ISSUE_COMMENT_TOOL: Tool = {
  name: "add-issue-comment",
  description: "Add a comment to an issue",
  inputSchema: {
    type: "object",
    properties: {
      project_id: {
        type: "string",
        description: "ID of the project containing the issue",
      },
      issue_id: {
        type: "string",
        description: "ID of the issue to add comment to",
      },
      comment_html: {
        type: "string",
        description: "HTML content of the comment",
      },
    },
    required: ["project_id", "issue_id", "comment_html"],
  },
};

// Export all tools as an array
export const PLANE_TOOLS: Tool[] = [
  LIST_WORKSPACES_TOOL,
  GET_WORKSPACE_TOOL,
  LIST_PROJECTS_TOOL,
  GET_PROJECT_TOOL,
  GET_PROJECT_STATES_TOOL,
  LIST_CYCLES_TOOL,
  GET_CYCLE_TOOL,
  LIST_MODULES_TOOL,
  GET_MODULE_TOOL,
  LIST_ISSUES_TOOL,
  GET_ISSUE_TOOL,
  CREATE_ISSUE_TOOL,
  UPDATE_ISSUE_TOOL,
  DELETE_ISSUE_TOOL,
  LIST_ISSUE_COMMENTS_TOOL,
  ADD_ISSUE_COMMENT_TOOL,
]; 