param(
    [int]$Port = 8000
)

function Command-Exists($cmd) {
    return Get-Command $cmd -ErrorAction SilentlyContinue
}

function Open-Browser($url) {
    Start-Process $url
}

function Start-DotNetServer($Port) {
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$Port/")
    $listener.Start()

    $basePath = Get-Location

    Write-Host "Servidor en http://localhost:$Port" -ForegroundColor Green
    Open-Browser "http://localhost:$Port"

    $mimeTypes = @{
        ".html"="text/html"
        ".css" ="text/css"
        ".js"  ="application/javascript"
        ".json"="application/json"
        ".png" ="image/png"
        ".jpg" ="image/jpeg"
        ".jpeg"="image/jpeg"
        ".gif" ="image/gif"
        ".svg" ="image/svg+xml"
        ".txt" ="text/plain"
    }

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $path = $request.Url.LocalPath.TrimStart("/")
        if ($path -eq "") { $path = "index.html" }

        $fullPath = Join-Path $basePath $path

        if (Test-Path $fullPath) {
            $ext = [System.IO.Path]::GetExtension($fullPath).ToLower()
            $type = $mimeTypes[$ext]
            if (-not $type) { $type = "application/octet-stream" }

            $bytes = [System.IO.File]::ReadAllBytes($fullPath)
            $response.ContentType = $type
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes,0,$bytes.Length)
        } else {
            $msg = "404 Not Found"
            $bytes = [Text.Encoding]::UTF8.GetBytes($msg)
            $response.StatusCode = 404
            $response.OutputStream.Write($bytes,0,$bytes.Length)
        }

        $response.OutputStream.Close()
    }
}

Write-Host "Intentando iniciar servidor en puerto $Port..."

# Python
if (Command-Exists "python") {
    Write-Host "Servidor en http://localhost:$Port" -ForegroundColor Green
    Open-Browser "http://localhost:$Port"
    python -m http.server $Port --bind 127.0.0.1
    exit
}
elseif (Command-Exists "python3") {
    Write-Host "Servidor en http://localhost:$Port" -ForegroundColor Green
    Open-Browser "http://localhost:$Port"
    python3 -m http.server $Port --bind 127.0.0.1
    exit
}

# PHP
if (Command-Exists "php") {
    Write-Host "Servidor en http://localhost:$Port" -ForegroundColor Green
    Open-Browser "http://localhost:$Port"
    php -S localhost:$Port
    exit
}

# Node
if (Command-Exists "npx") {
    Write-Host "Servidor en http://localhost:$Port" -ForegroundColor Green
    Open-Browser "http://localhost:$Port"
    npx serve -l $Port
    exit
}
elseif (Command-Exists "node") {
    $script = @"
const http = require('http');
const fs = require('fs');
const path = require('path');

const port = $Port;
const base = process.cwd();

http.createServer((req,res)=>{
    let file = path.join(base, req.url === '/' ? 'index.html' : req.url);
    fs.readFile(file,(e,d)=>{
        if(e){res.writeHead(404);res.end('404 Not Found');}
        else{res.writeHead(200);res.end(d);}
    });
}).listen(port, ()=>console.log("Servidor en http://localhost:"+port));
"@

    $tmp = "$env:TEMP\server.js"
    $script | Out-File $tmp -Encoding utf8

    Write-Host "Servidor en http://localhost:$Port" -ForegroundColor Green
    Open-Browser "http://localhost:$Port"
    node $tmp
    exit
}

# fallback
Start-DotNetServer $Port