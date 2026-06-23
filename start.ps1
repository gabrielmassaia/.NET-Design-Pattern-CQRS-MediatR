#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Starts the full Painel de Obrigações stack and shows status.
.PARAMETER Logs
    Automatically tail logs after startup.
.PARAMETER NoBuild
    Skip --build flag.
#>

param(
    [switch]$Logs,
    [switch]$NoBuild
)

$BuildFlag = if ($NoBuild) { "" } else { "--build" }

Write-Host ""
Write-Host "  CleanArchReference" -ForegroundColor Cyan
Write-Host "  ───────────────────────────────" -ForegroundColor Cyan
Write-Host ""

# Step 1: docker compose up
Write-Host "  ▸ Subindo containers..." -ForegroundColor Yellow
$upArgs = @("compose", "up", "-d") + @($BuildFlag -split " " | Where-Object { $_ -ne "" })
& docker $upArgs 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0 -and $LASTEXITCODE -ne $null) {
    Write-Host "  ✘ ERRO: docker compose up falhou (código $LASTEXITCODE)" -ForegroundColor Red
    exit 1
}
Write-Host "  ✔ Containers criados" -ForegroundColor Green
Write-Host ""

# Step 2: Wait for healthy services
Write-Host "  ▸ Aguardando serviços ficarem saudáveis..." -ForegroundColor Yellow

$services = @("cleanref_db", "cleanref_redis", "cleanref_meili")
$timeout = 40
$elapsed = 0

while ($elapsed -lt $timeout) {
    $allHealthy = $true
    foreach ($svc in $services) {
        $status = docker inspect --format='{{.State.Health.Status}}' $svc 2>$null
        if ($LASTEXITCODE -eq 0 -and $status -ne "healthy") {
            $allHealthy = $false
        }
    }
    if ($allHealthy) { break }
    Start-Sleep -Seconds 2
    $elapsed += 2
}

Write-Host "  ✔ Banco de dados (PostgreSQL)" -ForegroundColor Green
Write-Host "  ✔ Cache (Redis)" -ForegroundColor Green
Write-Host "  ✔ Busca textual (Meilisearch)" -ForegroundColor Green

# Wait for API (has start_period so may still be "starting")
Write-Host "  ▸ Aguardando API .NET iniciar..." -ForegroundColor Yellow
$apiTimeout = 60
$apiElapsed = 0
while ($apiElapsed -lt $apiTimeout) {
    $apiStatus = docker inspect --format='{{.State.Health.Status}}' cleanref_api 2>$null
    if ($apiStatus -eq "healthy" -or $apiStatus -eq "starting") {
        break
    }
    Start-Sleep -Seconds 2
    $apiElapsed += 2
}
Write-Host "  ✔ API (.NET 9)" -ForegroundColor Green

# Wait for Web
Write-Host "  ▸ Aguardando Frontend..." -ForegroundColor Yellow
$webTimeout = 30
$webElapsed = 0
while ($webElapsed -lt $webTimeout) {
    $webStatus = docker inspect --format='{{.State.Status}}' cleanref_web 2>$null
    if ($webStatus -eq "running") {
        break
    }
    Start-Sleep -Seconds 2
    $webElapsed += 2
}
Write-Host "  ✔ Frontend (React + Nginx)" -ForegroundColor Green
Write-Host ""

# Step 3: Display URLs
Write-Host "  ───────────────────────────────" -ForegroundColor Cyan
Write-Host "  Stack pronta!" -ForegroundColor Green
Write-Host ""
Write-Host "    Frontend:     http://localhost:3000" -ForegroundColor Green
Write-Host "    API (Swagger): http://localhost:8080/swagger" -ForegroundColor Green
Write-Host "    Meilisearch:   http://localhost:7700" -ForegroundColor Green
Write-Host ""
Write-Host "  ───────────────────────────────" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Comandos:" -ForegroundColor Gray
Write-Host "    docker compose ps              Status" -ForegroundColor Gray
Write-Host "    docker compose logs -f api     Logs da API" -ForegroundColor Gray
Write-Host "    docker compose logs -f web     Logs do frontend" -ForegroundColor Gray
Write-Host "    docker compose down -v         Parar + limpar volumes" -ForegroundColor Gray
Write-Host ""

# Optional: tail logs
if ($Logs) {
    Write-Host "  Exibindo logs (Ctrl+C para sair)..." -ForegroundColor Yellow
    & docker compose logs -f
}
