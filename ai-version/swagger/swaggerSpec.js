// Hand-written OpenAPI 3.0 spec. Kept as a plain JS object (no swagger-jsdoc
// dependency needed) so it's easy to read and extend as endpoints grow.

const taskSchema = {
  type: "object",
  properties: {
    id: { type: "integer", example: 1 },
    title: { type: "string", example: "Buy groceries" },
    done: { type: "boolean", example: false },
  },
};

const errorSchema = {
  type: "object",
  properties: {
    error: { type: "string", example: "Task with id 99 not found" },
  },
};

const swaggerSpec = {
  openapi: "3.0.3",
  info: {
    title: "Todo API",
    version: "1.0.0",
    description: "A simple in-memory Todo API built with Node.js and Express.",
  },
  servers: [{ url: "http://localhost:3000", description: "Local server" }],
  tags: [{ name: "Tasks", description: "Task management endpoints" }],
  paths: {
    "/": {
      get: {
        summary: "API info",
        tags: ["Meta"],
        responses: {
          200: {
            description: "App name, version, and available endpoints",
          },
        },
      },
    },
    "/health": {
      get: {
        summary: "Health check",
        tags: ["Meta"],
        responses: {
          200: { description: 'Returns { "status": "ok" }' },
        },
      },
    },
    "/tasks": {
      get: {
        summary: "List tasks",
        tags: ["Tasks"],
        parameters: [
          {
            name: "search",
            in: "query",
            schema: { type: "string" },
            description: "Case-insensitive substring match on task title",
          },
          {
            name: "done",
            in: "query",
            schema: { type: "string", enum: ["true", "false"] },
            description: "Filter by completion status",
          },
        ],
        responses: {
          200: {
            description: "A list of tasks",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    count: { type: "integer" },
                    tasks: { type: "array", items: taskSchema },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Create a task",
        tags: ["Tasks"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title"],
                properties: {
                  title: { type: "string", example: "Buy groceries" },
                  done: { type: "boolean", example: false },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Task created",
            content: { "application/json": { schema: taskSchema } },
          },
          400: {
            description: "Validation error",
            content: { "application/json": { schema: errorSchema } },
          },
        },
      },
    },
    "/tasks/{id}": {
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "integer" },
        },
      ],
      get: {
        summary: "Get a task by id",
        tags: ["Tasks"],
        responses: {
          200: {
            description: "The task",
            content: { "application/json": { schema: taskSchema } },
          },
          404: {
            description: "Task not found",
            content: { "application/json": { schema: errorSchema } },
          },
        },
      },
      put: {
        summary: "Update a task",
        tags: ["Tasks"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string", example: "Buy groceries and cook" },
                  done: { type: "boolean", example: true },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Updated task",
            content: { "application/json": { schema: taskSchema } },
          },
          400: {
            description: "Validation error",
            content: { "application/json": { schema: errorSchema } },
          },
          404: {
            description: "Task not found",
            content: { "application/json": { schema: errorSchema } },
          },
        },
      },
      delete: {
        summary: "Delete a task",
        tags: ["Tasks"],
        responses: {
          204: { description: "Task deleted" },
          404: {
            description: "Task not found",
            content: { "application/json": { schema: errorSchema } },
          },
        },
      },
    },
    "/stats": {
      get: {
        summary: "Task statistics",
        tags: ["Meta"],
        responses: {
          200: {
            description: "Counts of total, completed, and pending tasks",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    total: { type: "integer", example: 3 },
                    completed: { type: "integer", example: 1 },
                    pending: { type: "integer", example: 2 },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/reset": {
      post: {
        summary: "Reset the in-memory database to its initial state",
        tags: ["Meta"],
        responses: {
          200: {
            description: "Database reset",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    tasks: { type: "array", items: taskSchema },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

module.exports = swaggerSpec;