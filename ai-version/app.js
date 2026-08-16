const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger/swaggerSpec");
const db = require("./data/db");
const tasksRouter = require("./routes/tasks");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Reject malformed JSON bodies with a clean 400 instead of a stack trace.
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON in request body" });
  }
  next(err);
});

const availableEndpoints = {
  root: "GET /",
  health: "GET /health",
  docs: "GET /docs",
  listTasks: "GET /tasks",
  createTask: "POST /tasks",
  getTask: "GET /tasks/:id",
  updateTask: "PUT /tasks/:id",
  deleteTask: "DELETE /tasks/:id",
  stats: "GET /stats",
  reset: "POST /reset",
};

app.get("/", (req, res) => {
  res.status(200).json({
    name: "Todo API",
    version: "1.0.0",
    endpoints: availableEndpoints,
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/tasks", tasksRouter);

app.get("/stats", (req, res) => {
  const tasks = db.getAllTasks();
  const completed = tasks.filter((task) => task.done).length;

  res.status(200).json({
    total: tasks.length,
    completed,
    pending: tasks.length - completed,
  });
});

app.post("/reset", (req, res) => {
  const tasks = db.resetTasks();
  res.status(200).json({ message: "Database reset to initial state", tasks });
});

// 404 handler for any route that isn't matched above.
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
});

// Centralized error handler — catches anything thrown/passed via next(err)
// in route handlers so the server never crashes on an unexpected error.
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Todo API running at http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/docs`);
});

module.exports = app;