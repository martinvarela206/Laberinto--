param(
    [int]$Port = 8000
)

function Command-Exists($cmd) {
    return Get-Command $cmd -ErrorAction SilentlyContinue
}

function Start-DotNetServer($Port) {
    $listener = New-Object System.Net.HttpListener
    $prefix = "http://localhost:$Port/"
    $listener.Prefixes.Add($prefix)
    $listener.Start()

    $basePath = Get-Location

    Write-Host "Servidor PowerShell en $prefix" -ForegroundColor Green

    # MIME types básicos
    $mimeTypes = @{
        ".html"="text/html"
        ".htm" ="text/html"
        ".css" ="text/css"
        ".js"  ="application/javascript"
        ".json"="application/json"
        ".png" ="image/png"
        ".jpg" ="image/jpeg"
        ".jpeg"="image/jpeg"
        ".gif" ="image/gif"
        ".svg" ="image/svg+xml"
        ".txt" ="text/plain"
        ".pdf" ="application/pdf"
    }

    while ($listener.IsListening) {
        try {
            $context = $listener.GetContext()
            $request = $context.Request
            $response = $context.Response

            $relativePath = $request.Url.LocalPath.TrimStart("/")
            if ([string]::IsNullOrWhiteSpace($relativePath)) {
                $relativePath = ""
            }

            $fullPath = Join-Path $basePath $relativePath

            Write-Host "$(Get-Date -Format HH:mm:ss) [$($request.HttpMethod)] $relativePath"

            # Si es directorio
            if (Test-Path $fullPath -PathType Container) {
                $indexFile = Join-Path $fullPath "index.html"

                if (Test-Path $indexFile) {
                    $fullPath = $indexFile
                } else {
                    # Listado de directorio
                    $items = Get-ChildItem $fullPath
                    $html = "<h1>Index of /$relativePath</h1><ul>"

                    foreach ($item in $items) {
                        $name = $item.Name
                        if ($item.PSIsContainer) {
                            $name += "/"
                        }
                        $html += "<li><a href='/$relativePath/$name'>$name</a></li>"
                    }

                    $html += "</ul>"

                    $bytes = [System.Text.Encoding]::UTF8.GetBytes($html)
                    $response.ContentType = "text/html"
                    $response.ContentLength64 = $bytes.Length
                    $response.OutputStream.Write($bytes, 0, $bytes.Length)
                    $response.OutputStream.Close()
                    continue
                }
            }

            # Si es archivo
            if (Test-Path $fullPath -PathType Leaf) {
                $ext = [System.IO.Path]::GetExtension($fullPath).ToLower()
                $contentType = $mimeTypes[$ext]

                if (-not $contentType) {
                    $contentType = "application/octet-stream"
                }

                $bytes = [System.IO.File]::ReadAllBytes($fullPath)
                $response.ContentType = $contentType
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } else {
                # 404
                $msg = "<h1>404 Not Found</h1>"
                $bytes = [System.Text.Encoding]::UTF8.GetBytes($msg)
                $response.StatusCode = 404
                $response.ContentType = "text/html"
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            }

            $response.OutputStream.Close()
        } catch {
            Write-Host "Error: $_" -ForegroundColor Red
        }
    }
}

Write-Host "Intentando iniciar servidor en puerto $Port..." -ForegroundColor Cyan

# 1. Python
if (Command-Exists "python") {
    Write-Host "Usando Python" -ForegroundColor Green
    python -m http.server $Port
    exit
}
elseif (Command-Exists "python3") {
    Write-Host "Usando Python3" -ForegroundColor Green
    python3 -m http.server $Port
    exit
}

# 2. PHP
if (Command-Exists "php") {
    Write-Host "Usando PHP" -ForegroundColor Green
    php -S localhost:$Port
    exit
}

# 3. Node
if (Command-Exists "npx") {
    Write-Host "Usando Node (npx serve)" -ForegroundColor Green
    npx serve -l $Port
    exit
}
elseif (Command-Exists "node") {
    Write-Host "Node detectado, usando servidor básico" -ForegroundColor Yellow

    $nodeScript = @"
const http = require('http');
const fs = require('fs');
const path = require('path');

const port = $Port;
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
"@

    $tempFile = "$env:TEMP\simple-server.js"
    $nodeScript | Out-File -Encoding utf8 $tempFile

    node $tempFile
    exit
}

# 4. Fallback
Start-DotNetServer -Port $Port