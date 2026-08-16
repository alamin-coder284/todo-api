// In-memory "database" for tasks.
// Since this resets on server restart, we keep a pristine copy of the
// initial data around so /reset can restore it on demand.

const initialTasks = [
  { id: 1, title: "Learn Node.js", done: true },
  { id: 2, title: "Build a Todo API", done: false },
  { id: 3, title: "Add Swagger docs", done: false },
];

// The live, mutable dataset the app reads/writes.
let tasks = initialTasks.map((task) => ({ ...task }));

// Tracks the next id to hand out so ids never collide, even after deletes.
let nextId = initialTasks.length + 1;

function getAllTasks() {
  return tasks;
}

function getTaskById(id) {
  return tasks.find((task) => task.id === id);
}

function createTask({ title, done = false }) {
  const newTask = { id: nextId++, title, done };
  tasks.push(newTask);
  return newTask;
}

function updateTask(id, updates) {
  const task = getTaskById(id);
  if (!task) return null;

  if (updates.title !== undefined) task.title = updates.title;
  if (updates.done !== undefined) task.done = updates.done;

  return task;
}

function deleteTask(id) {
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) return false;

  tasks.splice(index, 1);
  return true;
}

function resetTasks() {
  tasks = initialTasks.map((task) => ({ ...task }));
  nextId = initialTasks.length + 1;
  return tasks;
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  resetTasks,
};