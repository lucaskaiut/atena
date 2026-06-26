import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";

const API_BASE = process.env.ATENA_API_URL || "http://localhost:8000/api";
const API_TOKEN = process.env.ATENA_API_TOKEN || "";

async function api(path: string, options: RequestInit = {}): Promise<unknown> {
  const url = `${API_BASE}${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };
  if (API_TOKEN) {
    headers["Authorization"] = `Bearer ${API_TOKEN}`;
  }
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API error ${res.status}: ${body}`);
  }
  return res.json();
}

const tools: Tool[] = [
  {
    name: "dashboard_stats",
    description: "Get dashboard statistics: total projects, total tasks, hours worked, hours estimated, active sprints",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "list_projects",
    description: "List all projects with search and pagination",
    inputSchema: {
      type: "object",
      properties: {
        search: { type: "string", description: "Search term" },
        page: { type: "number", description: "Page number", default: 1 },
        client_id: { type: "number", description: "Filter by client ID" },
        status_id: { type: "number", description: "Filter by status ID" },
      },
    },
  },
  {
    name: "get_project",
    description: "Get a project by ID with tasks, sprints, and indicators",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "number", description: "Project ID" },
      },
      required: ["id"],
    },
  },
  {
    name: "list_tasks",
    description: "List tasks with filters. Supports filtering by project, status, priority, sprint, and search.",
    inputSchema: {
      type: "object",
      properties: {
        search: { type: "string", description: "Search term" },
        page: { type: "number", default: 1 },
        project_id: { type: "number" },
        status_id: { type: "number" },
        priority: { type: "string", enum: ["low", "medium", "high", "critical"] },
        sprint_id: { type: "number" },
        per_page: { type: "number", default: 15 },
      },
    },
  },
  {
    name: "get_task",
    description: "Get task details by ID, including subtasks, comments, time entries, and history",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "number", description: "Task ID" },
      },
      required: ["id"],
    },
  },
  {
    name: "create_task",
    description: "Create a new task",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string", description: "Task title" },
        description: { type: "string", description: "Task description" },
        project_id: { type: "number", description: "Project ID" },
        priority: { type: "string", enum: ["low", "medium", "high", "critical"], default: "medium" },
        status_id: { type: "number", description: "Status ID" },
        estimated_hours: { type: "number", description: "Estimated hours" },
        sprint_id: { type: "number", description: "Sprint ID" },
      },
      required: ["title", "project_id"],
    },
  },
  {
    name: "update_task_status",
    description: "Move a task to a different status (e.g. kanban move)",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "number", description: "Task ID" },
        status_id: { type: "number", description: "New status ID" },
      },
      required: ["id", "status_id"],
    },
  },
  {
    name: "list_statuses",
    description: "List available statuses (kanban columns) for tasks or projects",
    inputSchema: {
      type: "object",
      properties: {
        type: { type: "string", enum: ["task", "project"], description: "Filter by type" },
      },
    },
  },
  {
    name: "list_sprints",
    description: "List all sprints with search and pagination",
    inputSchema: {
      type: "object",
      properties: {
        search: { type: "string" },
        page: { type: "number", default: 1 },
        project_id: { type: "number" },
      },
    },
  },
  {
    name: "get_sprint",
    description: "Get sprint details by ID with tasks and indicators",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "number", description: "Sprint ID" },
      },
      required: ["id"],
    },
  },
  {
    name: "create_time_entry",
    description: "Create a manual time entry (retroactive) on a task. Provide start and end times.",
    inputSchema: {
      type: "object",
      properties: {
        task_id: { type: "number", description: "Task ID" },
        start_time: { type: "string", description: "Start datetime (ISO format)" },
        end_time: { type: "string", description: "End datetime (ISO format)" },
        description: { type: "string", description: "What was done" },
      },
      required: ["task_id", "start_time", "end_time"],
    },
  },
  {
    name: "get_time_entries",
    description: "Get time entries for a task",
    inputSchema: {
      type: "object",
      properties: {
        task_id: { type: "number", description: "Task ID" },
      },
      required: ["task_id"],
    },
  },
  {
    name: "get_kanban",
    description: "Get kanban board view: all columns with their tasks",
    inputSchema: {
      type: "object",
      properties: {
        project_id: { type: "number", description: "Filter by project" },
        sprint_id: { type: "number", description: "Filter by sprint" },
      },
    },
  },
  {
    name: "list_clients",
    description: "List all clients",
    inputSchema: {
      type: "object",
      properties: {
        search: { type: "string" },
        page: { type: "number", default: 1 },
      },
    },
  },
  {
    name: "list_users",
    description: "List all users in the company",
    inputSchema: {
      type: "object",
      properties: {
        search: { type: "string" },
        page: { type: "number", default: 1 },
      },
    },
  },
];

const server = new Server(
  { name: "atena-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "dashboard_stats": {
        const data = await api("/dashboard/stats");
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
      }

      case "list_projects": {
        const params = new URLSearchParams();
        if (args?.search) params.set("search", String(args.search));
        if (args?.page) params.set("page", String(args.page));
        if (args?.client_id) params.set("client_id", String(args.client_id));
        if (args?.status_id) params.set("status_id", String(args.status_id));
        const data = await api(`/projects?${params}`);
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
      }

      case "get_project": {
        const data = await api(`/projects/${args?.id}`);
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
      }

      case "list_tasks": {
        const params = new URLSearchParams();
        if (args?.search) params.set("search", String(args.search));
        if (args?.page) params.set("page", String(args.page));
        if (args?.project_id) params.set("project_id", String(args.project_id));
        if (args?.status_id) params.set("status_id", String(args.status_id));
        if (args?.priority) params.set("priority", String(args.priority));
        if (args?.sprint_id) params.set("sprint_id", String(args.sprint_id));
        if (args?.per_page) params.set("per_page", String(args.per_page));
        const data = await api(`/tasks?${params}`);
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
      }

      case "get_task": {
        const data = await api(`/tasks/${args?.id}`);
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
      }

      case "create_task": {
        const data = await api("/tasks", {
          method: "POST",
          body: JSON.stringify(args),
        });
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
      }

      case "update_task_status": {
        const data = await api(`/tasks/${args?.id}/status`, {
          method: "PATCH",
          body: JSON.stringify({ status_id: args?.status_id }),
        });
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
      }

      case "list_statuses": {
        const params = new URLSearchParams();
        if (args?.type) params.set("type", String(args.type));
        const data = await api(`/statuses?${params}`);
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
      }

      case "list_sprints": {
        const params = new URLSearchParams();
        if (args?.search) params.set("search", String(args.search));
        if (args?.page) params.set("page", String(args.page));
        if (args?.project_id) params.set("project_id", String(args.project_id));
        const data = await api(`/sprints?${params}`);
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
      }

      case "get_sprint": {
        const data = await api(`/sprints/${args?.id}`);
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
      }

      case "create_time_entry": {
        const { task_id, ...payload } = args as Record<string, unknown>;
        const data = await api(`/tasks/${task_id}/time-entries`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
      }

      case "get_time_entries": {
        const data = await api(`/tasks/${args?.task_id}/time-entries`);
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
      }

      case "get_kanban": {
        const params = new URLSearchParams();
        if (args?.project_id) params.set("project_id", String(args.project_id));
        if (args?.sprint_id) params.set("sprint_id", String(args.sprint_id));
        const data = await api(`/kanban?${params}`);
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
      }

      case "list_clients": {
        const params = new URLSearchParams();
        if (args?.search) params.set("search", String(args.search));
        if (args?.page) params.set("page", String(args.page));
        const data = await api(`/clients?${params}`);
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
      }

      case "list_users": {
        const params = new URLSearchParams();
        if (args?.search) params.set("search", String(args.search));
        if (args?.page) params.set("page", String(args.page));
        const data = await api(`/users?${params}`);
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: "text", text: `Error: ${message}` }],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
