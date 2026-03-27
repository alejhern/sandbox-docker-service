# 🐳 Multi-Language Secure Sandbox

A secure sandbox based on Node.js + Docker to execute code in multiple programming languages in an isolated manner.

## 🚀 Features

- 🔒 Isolated execution with Docker (no network)
- ⚡ Supports multiple languages
- ⏱️ Automatic timeout
- 🧠 CPU, RAM and process limits
- 📦 Simple REST API
- 🧪 Ideal for online editors, educational platforms or LeetCode-like judges

## 🧑‍💻 Supported Languages

| Language | Emoji |
|----------|-------|
| Python | 🐍 |
| Node.js | 🟢 |
| PHP | 🐘 |
| Ruby | 💎 |
| C | 🧠 |
| C++ | ⚙️ |
| Java | ☕ |
| SQL (SQLite) | 🗄️ |

## 📡 API

### Execute code

**Endpoint:** `POST /run`

**Body:**
```json
{
    "language": "python",
    "code": "print('Hello world')"
}
```

**Response:**
```json
{
    "stdout": "Hello world",
    "stderr": "",
    "exitCode": 0
}
```

### Examples with curl

```bash
# Python
curl -X POST http://localhost:4000/run \
    -H "Content-Type: application/json" \
    --data-binary '{"language":"python","code":"print(\"Hello world\")"}'

# Node.js
curl -X POST http://localhost:4000/run \
    -H "Content-Type: application/json" \
    --data-binary '{"language":"nodejs","code":"console.log(\"Hello world\")"}'

# PHP
curl -X POST http://localhost:4000/run \
    -H "Content-Type: application/json" \
    --data-binary '{"language":"php","code":"<?php echo \"Hello world\"; ?>"}'

# Ruby
curl -X POST http://localhost:4000/run \
    -H "Content-Type: application/json" \
    --data-binary '{"language":"ruby","code":"puts \"Hello world\""}'

# C
curl -X POST http://localhost:4000/run \
    -H "Content-Type: application/json" \
    --data-binary '{"language":"c","code":"#include <stdio.h>\nint main(){printf(\"Hello world\");}"}'

# C++
curl -X POST http://localhost:4000/run \
    -H "Content-Type: application/json" \
    --data-binary '{"language":"cpp","code":"#include <iostream>\nint main(){std::cout << \"Hello world\";}"}'

# Java
curl -X POST http://localhost:4000/run \
    -H "Content-Type: application/json" \
    --data-binary '{"language":"java","code":"public class Main { public static void main(String[] args){ System.out.println(\"Hello world\"); } }"}'

# SQL
curl -X POST http://localhost:4000/run \
    -H "Content-Type: application/json" \
    --data-binary '{"language":"sql","code":"SELECT \"Hello world\";"}'
```

## 🧱 Architecture

```
Client
    ↓
Express API (/run)
    ↓
Docker Spawn (isolated container)
    ↓
Execution (language runtime)
    ↓
stdout / stderr
```

## 🔒 Security

This sandbox applies several restrictions:

- 🚫 No network (`--network none`)
- 📁 Read-only filesystem
- 🧼 Isolated `/tmp` with tmpfs
- 👤 Non-root user (1000:1000)
- 💾 128MB RAM per container
- 🧵 Limited CPU (0.5 cores)
- 🔥 Execution timeout (10s)
- 🚫 Process limit (pids)

> ⚠️ **Warning:** This is an educational/experimental sandbox. It is not designed to execute untrusted code in production without additional audit.

## 🛠️ Installation

```bash
git clone https://github.com/youruser/sandbox
cd sandbox
npm install
npm run prepare
```

## ▶️ Execution

```bash
node server.js
```

**Endpoint:** `http://localhost:4000/run`

## 💡 Future Ideas

- Real-time stdout streaming
- Execution queue (Redis/BullMQ)
- API key authentication
- Per-user limits
- Support for more languages (Go, Rust, TypeScript)
- Replit/LeetCode runner-like UI

## 🧑‍🚀 Author

Made with ❤️ using Node.js + Docker