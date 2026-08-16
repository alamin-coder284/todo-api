const express = require("express");
const db = require("../data/db");

const router = express.Router();

// Helper: parse the ":id" param and reject anything that isn't a positive
// integer before we even touch the database.
function parseTaskId(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Task id must be a positive integer" });
  }
  req.taskId = id;
  next();
}

/**
 * GET /tasks
 * Supports optional query params:
 *   - search: case-insensitive substring match on title
 *   - done: "true" or "false" to filter by completion status
 */
router.get("/", (req, res) => {
  let tasks = db.getAllTasks();
  const { search, done } = req.query;

  if (search !== undefined) {
    const term = String(search).toLowerCase();
    tasks = tasks.filter((task) => task.title.toLowerCase().includes(term));
  }

  if (done !== undefined) {
    if (done !== "true" && done !== "false") {
      return res
        .status(400)
        .json({ error: "'done' query param must be 'true' or 'false'" });
    }
    const isDone = done === "true";
    tasks = tasks.filter((task) => task.done === isDone);
  }

  res.status(200).json({ count: tasks.length, tasks });
});

/**
 * POST /tasks
 * Body: { title: string, done?: boolean }
 */
router.post("/", (req, res) => {
  const { title, done } = req.body ?? {};

  if (typeof title !== "string" || title.trim() === "") {
    return res
      .status(400)
      .json({ error: "'title' is required and must be a non-empty string" });
  }

  if (done !== undefined && typeof done !== "boolean") {
    return res.status(400).json({ error: "'done' must be a boolean" });
  }

  const task = db.createTask({ title: title.trim(), done });
  res.status(201).json(task);
});

/**
 * GET /tasks/:id
 */
router.get("/:id", parseTaskId, (req, res) => {
  const task = db.getTaskById(req.taskId);
  if (!task) {
    return res.status(404).json({ error: `Task with id ${req.taskId} not found` });
  }
  res.status(200).json(task);
});

/**
 * PUT /tasks/:id
 * Body: { title?: string, done?: boolean }
 */
router.put("/:id", parseTaskId, (req, res) => {
  const { title, done } = req.body ?? {};

  if (title === undefined && done === undefined) {
    return res.status(400).json({
      error: "Provide at least one of 'title' or 'done' to update",
    });
  }

  if (title !== undefined && (typeof title !== "string" || title.trim() === "")) {
    return res.status(400).json({ error: "'title' must be a non-empty string" });
  }

  if (done !== undefined && typeof done !== "boolean") {
    return res.status(400).json({ error: "'done' must be a boolean" });
  }

  const updates = {};
  if (title !== undefined) updates.title = title.trim();
  if (done !== undefined) updates.done = done;

  const task = db.updateTask(req.taskId, updates);
  if (!task) {
    return res.status(404).json({ error: `Task with id ${req.taskId} not found` });
  }

  res.status(200).json(task);
});

/**
 * DELETE /tasks/:id
 */
router.delete("/:id", parseTaskId, (req, res) => {
  const deleted = db.deleteTask(req.taskId);
  if (!deleted) {
    return res.status(404).json({ error: `Task with id ${req.taskId} not found` });
  }
  res.status(204).send();
});

module.exports = router;