# 🐳 Multi-Language Secure Sandbox

> Execute code in isolated Docker containers via a simple REST API — no network, no root, no surprises.

---

## ✨ Features

- 🔒 **Fully isolated** — each run spawns a fresh, ephemeral container
- 🌐 **No network access** — containers can't make outbound requests
- ⏱️ **Automatic timeout** — kills runaway processes after 10s
- 🧠 **Resource limits** — capped CPU, RAM and process count per container
- 📦 **Simple REST API** — one endpoint, JSON in, JSON out
- 🧪 **Multi-language** — 9 runtimes out of the box

---

## 🧑‍💻 Supported Languages

| Language | Image | Emoji |
|----------|-------|-------|
| Python 3.12 | `python:3.12-alpine` | 🐍 |
| Node.js 18 | `node:18-alpine` | 🟢 |
| PHP 8.3 | `php:8.3-cli-alpine` | 🐘 |
| Ruby 3 | `ruby:3-alpine` | 💎 |
| Bash 5 | `bash:5-alpine3.20` | 🐚 |
| C (GCC 13) | `gcc:13` | 🧠 |
| C++ (GCC 13) | `gcc:13` | ⚙️ |
| Java 21 | `eclipse-temurin:21-jdk` | ☕ |
| SQL (SQLite) | `keinos/sqlite3` | 🗄️ |

---

## 📡 API

### `POST /run`

Executes code in the specified language and returns its output.

**Request body:**
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

| Field | Type | Description |
|-------|------|-------------|
| `stdout` | `string` | Standard output of the program |
| `stderr` | `string` | Standard error (compiler errors, exceptions, etc.) |
| `exitCode` | `number` | Process exit code (`0` = success) |

---

## 🧪 Examples

### 🐍 Python
```bash
curl -X POST http://localhost:4000/run \
  -H "Content-Type: application/json" \
  --data-binary '{
    "language": "python",
    "code": "print(\"Hello world\")"
  }'
```

### 🟢 Node.js
```bash
curl -X POST http://localhost:4000/run \
  -H "Content-Type: application/json" \
  --data-binary '{
    "language": "nodejs",
    "code": "console.log(\"Hello world\")"
  }'
```

### 🐘 PHP
```bash
curl -X POST http://localhost:4000/run \
  -H "Content-Type: application/json" \
  --data-binary '{
    "language": "php",
    "code": "<?php echo \"Hello world\"; ?>"
  }'
```

### 💎 Ruby
```bash
curl -X POST http://localhost:4000/run \
  -H "Content-Type: application/json" \
  --data-binary '{
    "language": "ruby",
    "code": "puts \"Hello world\""
  }'
```

### 🐚 Bash
```bash
curl -X POST http://localhost:4000/run \
  -H "Content-Type: application/json" \
  --data-binary '{
    "language": "bash",
    "code": "echo \"Hello world\""
  }'
```

### 🧠 C
```bash
curl -X POST http://localhost:4000/run \
  -H "Content-Type: application/json" \
  --data-binary '{
    "language": "c",
    "code": "#include <stdio.h>\nint main(){printf(\"Hello world\");}"
  }'
```

### ⚙️ C++
```bash
curl -X POST http://localhost:4000/run \
  -H "Content-Type: application/json" \
  --data-binary '{
    "language": "cpp",
    "code": "#include <iostream>\nint main(){std::cout << \"Hello world\";}"
  }'
```

### ☕ Java
```bash
curl -X POST http://localhost:4000/run \
  -H "Content-Type: application/json" \
  --data-binary '{
    "language": "java",
    "code": "public class Main { public static void main(String[] args){ System.out.println(\"Hello world\"); } }"
  }'
```

### 🗄️ SQL (SQLite)
```bash
curl -X POST http://localhost:4000/run \
  -H "Content-Type: application/json" \
  --data-binary '{
    "language": "sql",
    "code": "SELECT \"Hello world\";"
  }'
```

---

## 🏗️ Architecture

```
Client (HTTP)
     │
     ▼
Express API  ──►  POST /run
     │
     ▼
Docker spawn (isolated container)
     │
     ├── --network none
     ├── --read-only
     ├── --user 1000:1000
     ├── --memory 128m
     └── --pids-limit 64
     │
     ▼
Language runtime (stdin → eval/compile/run)
     │
     ▼
{ stdout, stderr, exitCode }
```

Each request spawns a **fresh, disposable container** that is destroyed immediately after execution. No state is shared between runs.

---

## 🔒 Security model

| Restriction | Mechanism |
|-------------|-----------|
| No network | `--network none` |
| Read-only filesystem | `--read-only` |
| Isolated scratch space | `--tmpfs /tmp:noexec` + `--tmpfs /tmp/out:exec` (for compiled langs) |
| Non-root user | `--user 1000:1000` |
| RAM cap | `--memory 128m` |
| CPU cap | `--cpus 0.5` |
| Process cap | `--pids-limit 64` |
| No privilege escalation | `--security-opt no-new-privileges` |
| Execution timeout | SIGKILL after 10s |

> ⚠️ **Note:** This sandbox is designed for educational and experimental use. Before running untrusted code in production, conduct a thorough security audit and consider additional layers (e.g. gVisor, Firecracker, seccomp profiles).

---

## 🛠️ Installation

**Prerequisites:** Node.js ≥ 18, Docker

```bash
git clone https://github.com/youruser/sandbox
cd sandbox
npm install
```

Pull the runtime images in advance to avoid cold-start delays on first run:

```bash
docker pull python:3.12-alpine
docker pull node:18-alpine
docker pull php:8.3-cli-alpine
docker pull ruby:3-alpine
docker pull bash:5-alpine3.20
docker pull gcc:13
docker pull eclipse-temurin:21-jdk
docker pull keinos/sqlite3
```

---

## ▶️ Running

```bash
node server.js
# 🐳 Sandbox running on http://localhost:4000
```

---

## 🧑‍🚀 Author

Made with ❤️ using Node.js + Docker