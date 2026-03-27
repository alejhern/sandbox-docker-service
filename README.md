# 🐳 Multi-Language Secure Sandbox

Un sandbox seguro basado en Node.js + Docker para ejecutar código en múltiples lenguajes de programación de forma aislada.

## 🚀 Características

- 🔒 Ejecución aislada con Docker (sin red)
- ⚡ Soporta múltiples lenguajes
- ⏱️ Timeout automático
- 🧠 Límite de CPU, RAM y procesos
- 📦 API REST simple
- 🧪 Ideal para editores online, plataformas educativas o judges tipo LeetCode

## 🧑‍💻 Lenguajes soportados

| Lenguaje | Emoji |
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

### Ejecutar código

**Endpoint:** `POST /run`

**Body:**
```json
{
    "language": "python",
    "code": "print('Hola mundo')"
}
```

**Respuesta:**
```json
{
    "stdout": "Hola mundo",
    "stderr": "",
    "exitCode": 0
}
```

### Ejemplos con curl

```bash
# Python
curl -X POST http://localhost:4000/run \
    -H "Content-Type: application/json" \
    --data-binary '{"language":"python","code":"print(\"Hola mundo\")"}'

# Node.js
curl -X POST http://localhost:4000/run \
    -H "Content-Type: application/json" \
    --data-binary '{"language":"nodejs","code":"console.log(\"Hola mundo\")"}'

# PHP
curl -X POST http://localhost:4000/run \
    -H "Content-Type: application/json" \
    --data-binary '{"language":"php","code":"<?php echo \"Hola mundo\"; ?>"}'

# Ruby
curl -X POST http://localhost:4000/run \
    -H "Content-Type: application/json" \
    --data-binary '{"language":"ruby","code":"puts \"Hola mundo\""}'

# C
curl -X POST http://localhost:4000/run \
    -H "Content-Type: application/json" \
    --data-binary '{"language":"c","code":"#include <stdio.h>\nint main(){printf(\"Hola mundo\");}"}'

# C++
curl -X POST http://localhost:4000/run \
    -H "Content-Type: application/json" \
    --data-binary '{"language":"cpp","code":"#include <iostream>\nint main(){std::cout << \"Hola mundo\";}"}'

# Java
curl -X POST http://localhost:4000/run \
    -H "Content-Type: application/json" \
    --data-binary '{"language":"java","code":"public class Main { public static void main(String[] args){ System.out.println(\"Hola mundo\"); } }"}'

# SQL
curl -X POST http://localhost:4000/run \
    -H "Content-Type: application/json" \
    --data-binary '{"language":"sql","code":"SELECT \"Hola mundo\";"}'
```

## 🧱 Arquitectura

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

## 🔒 Seguridad

Este sandbox aplica varias restricciones:

- 🚫 Sin red (`--network none`)
- 📁 Sistema de archivos de solo lectura
- 🧼 `/tmp` aislado con tmpfs
- 👤 Usuario no root (1000:1000)
- 💾 128MB RAM por contenedor
- 🧵 CPU limitada (0.5 cores)
- 🔥 Timeout de ejecución (10s)
- 🚫 Límite de procesos (pids)

> ⚠️ **Advertencia:** Esto es un sandbox educativo/experimental. No está diseñado para ejecutar código no confiable en producción sin auditoría adicional.

## 🛠️ Instalación

```bash
git clone https://github.com/tuusuario/sandbox
cd sandbox
npm install
docker pull python:3.12-alpine
docker pull node:18-alpine
docker pull php:8.3-cli-alpine
docker pull ruby:3-alpine
docker pull gcc:13
docker pull eclipse-temurin:21-jdk
docker pull keinos/sqlite3
```

## ▶️ Ejecución

```bash
node server.js
```

**Endpoint:** `http://localhost:4000/run`

## 💡 Ideas futuras

- Streaming de stdout en tiempo real
- Cola de ejecución (Redis/BullMQ)
- Autenticación con API keys
- Límites por usuario
- Soporte para más lenguajes (Go, Rust, TypeScript)
- UI tipo Replit/LeetCode runner

## 🧑‍🚀 Autor

Hecho con ❤️ usando Node.js + Docker