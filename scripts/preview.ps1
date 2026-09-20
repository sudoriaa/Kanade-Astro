param([int]$Port = 4321)
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path $PSScriptRoot -Parent
if (-not (Test-Path (Join-Path $projectRoot 'dist/index.html'))) { throw 'Run pnpm build first.' }
$listener = Get-NetTCPConnection -State Listen -LocalPort $Port -ErrorAction SilentlyContinue
if ($listener) { throw "Port $Port is occupied. Use: pnpm deploy:local -Port 4322" }
$logRoot = Join-Path $projectRoot '.preview'
New-Item -ItemType Directory -Force -Path $logRoot | Out-Null
$nodePath = (Get-Command node -ErrorAction Stop).Source
$process = Start-Process -FilePath $nodePath -ArgumentList @('node_modules/astro/bin/astro.mjs', 'preview', '--ignore-lock', '--host', '0.0.0.0', '--port', "$Port") -WorkingDirectory $projectRoot -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $logRoot "server-$Port.log") -RedirectStandardError (Join-Path $logRoot "server-$Port.error.log")
@{ pid = $process.Id; port = $Port; url = "http://localhost:$Port/"; started = (Get-Date).ToString('o') } | ConvertTo-Json | Set-Content -Path (Join-Path $logRoot "server-$Port.json") -Encoding utf8
$available = $false
for ($attempt = 0; $attempt -lt 20; $attempt++) {
  Start-Sleep -Milliseconds 500
  if ($process.HasExited) { throw "Preview process exited. Check .preview/server-$Port.error.log" }
  try {
    $response = Invoke-WebRequest -UseBasicParsing -Uri "http://localhost:$Port/" -TimeoutSec 2
    if ($response.StatusCode -eq 200) { $available = $true; break }
  } catch {}
}
if (-not $available) { throw "Preview is not ready. Check .preview/server-$Port.log" }
Write-Output "Production preview: http://localhost:$Port/"
Write-Output "Process ID: $($process.Id)"