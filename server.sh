#!/usr/bin/env bash

PORT=${1:-8000}

echo "Intentando iniciar servidor en puerto $PORT..."

command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# 1. Python
if command_exists python3; then
  echo "Usando Python3"
  python3 -m http.server "$PORT"
  exit 0
elif command_exists python; then
  echo "Usando Python"
  python -m http.server "$PORT"
  exit 0
fi

# 2. PHP
if command_exists php; then
  echo "Usando PHP"
  php -S localhost:"$PORT"
  exit 0
fi

# 3. Node
if command_exists npx; then
  echo "Usando Node (npx serve)"
  npx serve -l "$PORT"
  exit 0
elif command_exists node; then
  echo "Node detectado, usando servidor básico"

  TMP_FILE="/tmp/simple-server.js"

  cat > "$TMP_FILE" <<EOF
const http = require('http');
const fs = require('fs');
const path = require('path');

const port = $PORT;
const base = process.cwd();

http.createServer((req, res) => {
  let filePath = path.join(base, req.url === '/' ? 'index.html' : req.url);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('404 Not Found');
    } else {
      res.writeHead(200);
      res.end(data);
    }
  });
}).listen(port, () => {
  console.log("Servidor Node en http://localhost:" + port);
});
EOF

  node "$TMP_FILE"
  exit 0
fi

# 4. Fallback (sin dependencias): netcat
if command_exists nc; then
  echo "Usando fallback con netcat (muy básico)"

  while true; do
    {
      read request
      echo -e "HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\n\r\nServidor bash activo"
    } | nc -l -p "$PORT" -q 1
  done

  exit 0
fi

echo "No se encontró ninguna herramienta para iniciar servidor."
exit 1