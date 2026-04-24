/**
 * Secure Multi-Language Sandbox (fixed stdout + safer execution)
 */

const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const { spawn } = require("child_process");

const app = express();
app.disable("x-powered-by");
app.use(cors());
app.use(express.json({ limit: "64kb" }));

// ── CONFIG ─────────────────────────────────────
const PORT = process.env.PORT || 4000;
const TIMEOUT_MS = 10000;

const DOCKER_FLAGS = [
  "run",
  "--rm",
  "-i",
  "--network",
  "none",
  "--read-only",
  "--tmpfs",
  "/tmp:rw,noexec,nosuid,size=64m",
  "--tmpfs",
  "/tmp/out:rw,exec,nosuid,size=32m",
  "--workdir",
  "/tmp",
  "--user",
  "1000:1000",
  "--memory",
  "128m",
  "--cpus",
  "0.5",
  "--pids-limit",
  "64",
  "--security-opt",
  "no-new-privileges",
];

// ── LANGUAGES ─────────────────────────────────────
const LANGUAGES = {
  python: {
    image: "python:3.12-alpine",
    args: ["python3", "-u", "-c", "import sys; exec(sys.stdin.read())"],
  },

  nodejs: {
    image: "node:18-alpine",
    args: [
      "node",
      "-e",
      `
process.stdin.setEncoding('utf8');
let code = '';
process.stdin.on('data', c => code += c);
process.stdin.on('end', () => {
  try {
    eval(code);
  } catch (e) {
    console.error(e.toString());
  }
});
      `,
    ],
  },

  php: {
    image: "php:8.3-cli-alpine",
    args: ["php"],
  },

  ruby: {
    image: "ruby:3-alpine",
    args: ["ruby", "-e", "eval(STDIN.read)"],
  },

  bash: {
    image: "bash:5-alpine3.20",
    args: ["bash", "-s"],
  },

  c: {
    image: "gcc:13",
    args: [
      "sh",
      "-c",
      "cat > /tmp/main.c && gcc /tmp/main.c -o /tmp/out/a.out && /tmp/out/a.out",
    ],
  },

  cpp: {
    image: "gcc:13",
    args: [
      "sh",
      "-c",
      "cat > /tmp/main.cpp && g++ /tmp/main.cpp -o /tmp/out/a.out && /tmp/out/a.out",
    ],
  },

  java: {
    image: "eclipse-temurin:21-jdk",
    args: [
      "sh",
      "-c",
      "cat > /tmp/Main.java && javac -d /tmp/out /tmp/Main.java && java -cp /tmp/out Main",
    ],
  },

  sql: {
    image: "keinos/sqlite3",
    args: [
      "sh",
      "-c",
      "cat > /tmp/query.sql && sqlite3 :memory: < /tmp/query.sql",
    ],
  },
};

// ── ROUTE ───────────────────────────────────────
app.post("/run", async (req, res) => {
  const { language, code } = req.body || {};

  if (!LANGUAGES[language]) {
    return res.status(400).json({ error: "Unsupported language" });
  }

  if (!code || typeof code !== "string") {
    return res.status(400).json({ error: "No code provided" });
  }

  try {
    const result = await runDocker({
      image: LANGUAGES[language].image,
      args: LANGUAGES[language].args,
      stdin: code,
      id: crypto.randomBytes(8).toString("hex"),
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DOCKER RUNNER ───────────────────────────────
function runDocker({ image, args, stdin, id }) {
  return new Promise((resolve) => {
    const proc = spawn("docker", [
      ...DOCKER_FLAGS,
      "--name",
      `sandbox-${id}`,
      image,
      ...args,
    ]);

    let stdout = "";
    let stderr = "";

    proc.stdout.setEncoding("utf8");
    proc.stderr.setEncoding("utf8");

    proc.stdout.on("data", (d) => (stdout += d));
    proc.stderr.on("data", (d) => (stderr += d));

    if (stdin) {
      proc.stdin.write(stdin);
      proc.stdin.end();
    }

    const timeout = setTimeout(() => {
      proc.kill("SIGKILL");
      resolve({
        stdout,
        stderr: "Timeout exceeded",
        exitCode: 1,
      });
    }, TIMEOUT_MS);

    proc.on("error", (err) => {
      clearTimeout(timeout);
      resolve({
        stdout: "",
        stderr: err.message,
        exitCode: 1,
      });
    });

    proc.on("close", (code) => {
      clearTimeout(timeout);
      resolve({
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        exitCode: code ?? 0,
      });
    });
  });
}

// ── START ───────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🐳 Sandbox running on http://localhost:${PORT}`);
});
