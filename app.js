const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./openapi.json");

const app = express();
app.use(express.json());

const initialTasks = [
  { id: 1, title: "Buy milk", done: false },
  { id: 2, title: "Learn CRUD", done: true },
  { id: 3, title: "Build API", done: false },
];

let tasks = [...initialTasks];
let nextId = 4;

app.post("/reset", (req, res) => {
  tasks = [...initialTasks];
  nextId = 4;
  res.json({
    message: "Tasks reset to initial state",
    tasks: tasks,
  });
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
  res.json({
    name: "Task API",
    version: "1.0",
    endpoints: ["/tasks"],
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Extras - search & done filtering

app.get("/tasks", (req, res) => {
  let result = tasks;

  // Check if there's a search query
  if (req.query.search) {
    const searchTerm = req.query.search.toLowerCase();
    result = tasks.filter((task) =>
      task.title.toLowerCase().includes(searchTerm),
    );
  }

  // Check if there's a done filter
  if (req.query.done !== undefined) {
    const doneFilter = req.query.done === "true";
    result = result.filter((task) => task.done === doneFilter);
  }

  res.json(result);
});

// stats

app.get("/stats", (req, res) => {
  const total = tasks.length;
  const done = tasks.filter((task) => task.done === true).length;
  const open = tasks.filter((task) => task.done === false).length;

  res.json({
    total: total,
    done: done,
    open: open,
  });
});

app.get("/tasks", (req, res) => {
  res.json(tasks);
});

app.get("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }
  res.json(task);
});

app.post("/tasks", (req, res) => {
  const { title } = req.body;


  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Title is required" });
  }

  const newTask = {
    id: nextId++,
    title: title,
    done: false,
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { title, done } = req.body;

  const task = tasks.find((t) => t.id === id);
  if (!task) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }

  if (title === undefined && done === undefined) {
    return res.status(400).json({ error: "No fields to update" });
  }

  if (title !== undefined) {
    if (title.trim() === "") {
      return res.status(400).json({ error: "Title cannot be empty" });
    }
    task.title = title;
  }
  if (done !== undefined) {
    task.done = done;
  }

  res.json(task);
});

app.delete("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }
  tasks.splice(index, 1);
  res.status(204).send();
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
