# One-time developer setup for Pharmacards (Windows PowerShell).
# No admin rights and no global installs. Run from anywhere:
#   powershell -ExecutionPolicy Bypass -File scripts/setup.ps1
$ErrorActionPreference = "Stop"
Set-Location (Join-Path $PSScriptRoot "..")

# 1. Node.js 20 or newer
$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
    Write-Host "Node.js is not installed. Get version 20 or newer from https://nodejs.org" -ForegroundColor Red
    exit 1
}
$major = [int](((& node -p "process.versions.node") -split "\.")[0])
if ($major -lt 20) {
    Write-Host "Node.js $major found, but 20 or newer is needed. Get it from https://nodejs.org" -ForegroundColor Red
    exit 1
}
Write-Host "Node.js $(node -v) OK"

# 2. Install packages (clean install when a lockfile exists)
if (Test-Path "package-lock.json") { npm ci } else { npm install }
if ($LASTEXITCODE -ne 0) { Write-Host "npm install failed." -ForegroundColor Red; exit 1 }

# 3. Check content and run tests
npm run validate:content
if ($LASTEXITCODE -ne 0) { Write-Host "Content validation failed." -ForegroundColor Red; exit 1 }
npm test
if ($LASTEXITCODE -ne 0) { Write-Host "Tests failed." -ForegroundColor Red; exit 1 }

Write-Host ""
Write-Host "Setup complete. Next commands:" -ForegroundColor Green
Write-Host "  npm run dev     start the app at http://localhost:3000"
Write-Host "  npm run build   create the static site in out/"
