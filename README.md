# Todo API

A simple RESTful CRUD API for managing tasks, built with Node.js and Express.js.

## Features

* Create, read, update, and delete tasks
* Request validation
* Proper HTTP status codes
* OpenAPI/Swagger documentation

## Tech Stack

Node.js | Express.js | OpenAPI | Swagger UI

## Getting Started

### Installation

```bash
npm install

```

### Run

```bash
node app.js

```

### Base URL

```text
http://localhost:3000

```

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| **GET** | `/tasks` | Get all tasks |
| **GET** | `/tasks/:id` | Get a task by ID |
| **POST** | `/tasks` | Create a task |
| **PUT** | `/tasks/:id` | Update a task |
| **DELETE** | `/tasks/:id` | Delete a task |

### Status Codes

`200 OK` · `201 Created` · `204 No Content` · `400 Bad Request` · `404 Not Found`

## Example Request & Output

```bash
curl -i http://localhost:3000/tasks

```

Paste the actual output from your working API below:

```text
PASTE YOUR ACTUAL OUTPUT HERE

```

## Swagger UI

Access the interactive documentation:

```text
http://localhost:3000/docs

```

Example: 

![Swagger UI](./swagger.png)


## Optional
### The Mortality Experiment

I tested what happens when the server restarts:

1. Started the server and added 3 new tasks
2. Verified they appeared in `GET /tasks`
3. Stopped the server with `Ctrl+C`
4. Restarted the server
5. Ran `GET /tasks` again — the new tasks were gone!

**What happened:** The tasks were stored in memory (RAM), which is wiped clean when the server process ends. Only the hard-coded initial tasks remained.

**Why this matters:** Real applications need persistent storage. In Week 3, we'll add a database so data survives server restarts — this is the entire reason Week 3 exists.

## Author

**Md Alamin**

Built as part of the FlyRank AI Fluency Program.