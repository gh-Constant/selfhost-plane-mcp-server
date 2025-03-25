# Plane MCP Server

An MCP (Model Context Protocol) server that provides tools for AI assistants to interact with the Plane project management platform.

## Features

- List workspaces, projects, cycles, modules, and issues
- Create, update and delete issues
- Add comments to issues
- Filter issues by various criteria
- Get details of Plane entities (projects, cycles, etc.)

## Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create an `.env` file based on `.env.example` with your Plane credentials:
   ```
   PLANE_API_KEY=your_api_key
   PLANE_BASE_URL=https://plane.yourdomain.com
   PLANE_WORKSPACE_SLUG=your_workspace_slug
   ```
4. Build the TypeScript code:
   ```
   npm run build
   ```
5. Run the server:
   ```
   npm start
   ```

## Running in development mode

For development with automatic reloading:

```
npm run dev
```

## Publishing on Smithery.ai

1. Make sure your code is ready to be published
2. Log in to Smithery.ai
3. Follow the instructions to publish your MCP server
4. Use the following environment variables:
   - `PLANE_API_KEY`: Your Plane API key
   - `PLANE_BASE_URL`: URL of your Plane instance
   - `PLANE_WORKSPACE_SLUG`: Your workspace slug in Plane

## Available Tools

The MCP server provides the following tools:

### Workspace Tools
- `list-workspaces`: List all workspaces
- `get-workspace`: Get details about the current workspace

### Project Tools
- `list-projects`: List all projects
- `get-project`: Get details of a specific project

### State Tools
- `get-project-states`: Get all states in a project

### Cycle Tools
- `list-cycles`: List all cycles in a project
- `get-cycle`: Get details of a specific cycle

### Module Tools
- `list-modules`: List all modules in a project
- `get-module`: Get details of a specific module

### Issue Tools
- `list-issues`: List issues in a project with optional filtering
- `get-issue`: Get details of a specific issue
- `create-issue`: Create a new issue
- `update-issue`: Update an existing issue
- `delete-issue`: Delete an issue

### Comment Tools
- `list-issue-comments`: List all comments on an issue
- `add-issue-comment`: Add a comment to an issue

## License

MIT 