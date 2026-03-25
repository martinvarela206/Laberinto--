#!/usr/bin/env bash

PORT=${1:-8000}

is_port_in_use() {
  local port="$1"

  if command -v ss >/dev/null; then
    ss -ltn 2>/dev/null | awk '{print $4}' | grep -Eq "(^|:)$port$"
    return $?
  fi

  if command -v lsof >/dev/null; then
    lsof -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1
    return $?
  fi

  # If we cannot verify, assume free and let the server command fail with details.
  return 1
}

pick_available_port() {
  local candidate="$1"
  local max_attempts=20
  local attempts=0

  while is_port_in_use "$candidate"; do
    attempts=$((attempts + 1))
    if [ "$attempts" -ge "$max_attempts" ]; then
      return 1
    fi
    candidate=$((candidate + 1))
  done

  PORT="$candidate"
  return 0
}

open_browser() {
  URL="http://localhost:$PORT"
  if command -v xdg-open >/dev/null; then
    xdg-open "$URL" >/dev/null 2>&1 &
  elif command -v open >/dev/null; then
    open "$URL" >/dev/null 2>&1 &
  fi
}

echo "Intentando iniciar servidor en puerto $PORT..."

if ! pick_available_port "$PORT"; then
  echo "No se encontró un puerto libre entre $PORT y $((PORT + 19))."
  exit 1
fi

if [ "$PORT" != "${1:-8000}" ]; then
  echo "Puerto ocupado detectado. Usando puerto alternativo: $PORT"
fi

# Python
if command -v python3 >/dev/null; then
  echo "Servidor en http://localhost:$PORT"
  open_browser
  python3 -m http.server "$PORT" --bind 127.0.0.1
  exit 0
elif command -v python >/dev/null; then
  echo "Servidor en http://localhost:$PORT"
  open_browser
  python -m http.server "$PORT" --bind 127.0.0.1
  exit 0
fi

# PHP
if command -v php >/dev/null; then
  echo "Servidor en http://localhost:$PORT"
  open_browser
  php -S localhost:"$PORT"
  exit 0
fi

# Node
if command -v npx >/dev/null; then
  echo "Servidor en http://localhost:$PORT"
  open_browser
  npx serve -l "$PORT"
  exit 0
elif command -v node >/dev/null; then
  TMP="/tmp/server.js"

  cat > "$TMP" <<EOF
const http = require('http');
const fs = require('fs');
const path = require('path');

const port = $PORT;
const base = process.cwd();

http.createServer((req,res)=>{
  let file = path.join(base, req.url === '/' ? 'index.html' : req.url);
  fs.readFile(file,(e,d)=>{
    if(e){res.writeHead(404);res.end('404 Not Found');}
    else{res.writeHead(200);res.end(d);}
  });
}).listen(port, ()=>console.log("Servidor en http://localhost:"+port));
EOF

  echo "Servidor en http://localhost:$PORT"
  open_browser
  node "$TMP"
  exit 0
fi

# Fallback netcat
if command -v nc >/dev/null; then
  echo "Servidor en http://localhost:$PORT"
  open_browser

  while true; do
    {
      read req
      echo -e "HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\n\r\nServidor bash activo"
    } | nc -l -p "$PORT" -q 1
  done
fi

echo "No se encontró ninguna herramienta disponible."
exit 1