# ===============================================================================
# CASH-BOOK FULL DEPLOYMENT SCRIPT (Frontend + Backend)
# ===============================================================================
# This script contains the complete logic for deploying both the Frontend (IIS Port 8001)
# and the Backend (PM2 + IIS Proxy Port 5001) without external script dependencies.
# ===============================================================================

#Requires -RunAsAdministrator

# -----------------------------------------------------------------------------
# Helper: Verify Administrator Privileges
# -----------------------------------------------------------------------------
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Error "ERROR: This script must be run as Administrator! Right-click PowerShell -> Run as Administrator."
    Exit 1
}

# ===========================================================================
# SECTION 1 – FRONTEND DEPLOYMENT (IIS Port 8001)
# ===========================================================================
Write-Host "\n===== Deploying Frontend (Port 8001) =====" -ForegroundColor Cyan
# 1. Enable Required IIS Features
Write-Host "`n[1/5] Enabling IIS Web Features..." -ForegroundColor Yellow
$clientFeatures = @(
    "IIS-WebServerRole",
    "IIS-WebServer",
    "IIS-CommonHttpFeatures",
    "IIS-StaticContent",
    "IIS-DefaultDocument",
    "IIS-HttpErrors",
    "IIS-ApplicationDevelopment",
    "IIS-WebSockets",
    "IIS-ManagementConsole"
)
foreach ($feature in $clientFeatures) { Enable-WindowsOptionalFeature -Online -FeatureName $feature -All -NoRestart -ErrorAction SilentlyContinue | Out-Null }

# 2. Install IIS URL Rewrite Module 2.1 if missing
Write-Host "`n[2/5] Verifying IIS URL Rewrite Module..." -ForegroundColor Yellow
Import-Module WebAdministration -ErrorAction SilentlyContinue
$tempDir = [System.IO.Path]::GetTempPath()
$rewriteModule = Get-WebGlobalModule | Where-Object { $_.Name -eq "RewriteModule" }
if (-not $rewriteModule) {
    $urlRewriteMsi = Join-Path $tempDir "rewrite_amd64_en-US.msi"
    try {
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        Invoke-WebRequest -Uri "https://download.microsoft.com/download/1/2/8/128E2E22-C1B9-44A4-BE2A-5859ED1D4592/rewrite_amd64_en-US.msi" -OutFile $urlRewriteMsi
        Start-Process msiexec.exe -ArgumentList "/i `"$urlRewriteMsi`" /quiet /norestart" -Wait
        Write-Host "IIS URL Rewrite 2.1 installed!" -ForegroundColor Green
    } catch { Write-Warning "Could not auto-download URL Rewrite. Install manually if needed." }
} else { Write-Host "IIS URL Rewrite Module is active." -ForegroundColor Green }

# 3. Build Frontend Vite Application
Write-Host "`n[3/5] Building Frontend Production Dist..." -ForegroundColor Yellow
$frontendDir = Join-Path $PSScriptRoot "Frontend"
$frontendDist = Join-Path $frontendDir "dist"
Push-Location $frontendDir
try { npm run build; Write-Host "Frontend build completed!" -ForegroundColor Green } catch { Write-Error "Failed to build Frontend app." }
finally { Pop-Location }
if (-not (Test-Path $frontendDist)) { New-Item -ItemType Directory -Path $frontendDist -Force | Out-Null }

# 4. Configure IIS Frontend Site on Port 8001
Write-Host "`n[4/5] Configuring IIS Site: CashBook_Frontend (Port 8001)..." -ForegroundColor Yellow
$siteName = "CashBook_Frontend"
if (Get-Website -Name $siteName -ErrorAction SilentlyContinue) {
    Set-ItemProperty "IIS:\Sites\$siteName" -Name physicalPath -Value $frontendDist
    if (-not (Get-WebBinding -Name $siteName -Port 8001 -ErrorAction SilentlyContinue)) {
        New-WebBinding -Name $siteName -IP "*" -Port 8001 -Protocol "http" | Out-Null
    }
} else {
    New-Website -Name $siteName -Port 8001 -PhysicalPath $frontendDist -ApplicationPool "DefaultAppPool" | Out-Null
}
Start-Website -Name $siteName -ErrorAction SilentlyContinue
# Firewall rule for 8001
Remove-NetFirewallRule -DisplayName "CashBook Frontend Port 8001" -ErrorAction SilentlyContinue
New-NetFirewallRule -DisplayName "CashBook Frontend Port 8001" -Direction Inbound -LocalPort 8001 -Protocol TCP -Action Allow -Profile Any | Out-Null
Write-Host "Frontend deployed successfully!" -ForegroundColor Green

# ===========================================================================
# SECTION 2 – BACKEND DEPLOYMENT (IIS Proxy Port 5001, PM2 internal 5002)
# ===========================================================================
Write-Host "\n===== Deploying Backend (Port 5001) =====" -ForegroundColor Cyan
# 1. Verify/Install IIS ARR 3.0 and enable proxy
Write-Host "`n[1/4] Verifying IIS ARR 3.0 Module & Proxy..." -ForegroundColor Yellow
$arrModule = Get-WebGlobalModule | Where-Object { $_.Name -eq "ApplicationRequestRouting" }
if (-not $arrModule) {
    $arrMsi = Join-Path $tempDir "requestRouter_amd64.msi"
    try {
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        Invoke-WebRequest -Uri "https://download.microsoft.com/download/E/9/8/E9849167-2E14-4FA5-A7A2-7711B860714E/requestRouter_amd64.msi" -OutFile $arrMsi
        Start-Process msiexec.exe -ArgumentList "/i `"$arrMsi`" /quiet /norestart" -Wait
        Write-Host "IIS ARR 3.0 installed!" -ForegroundColor Green
    } catch { Write-Warning "Could not auto-download ARR 3.0. Install manually if needed." }
} else { Write-Host "IIS ARR 3.0 Module is active." -ForegroundColor Green }
# Enable proxy
try { Set-WebConfigurationProperty -pspath 'MACHINE/WEBROOT/APPHOST' -filter 'system.webServer/proxy' -name 'enabled' -value 'True' -ErrorAction Stop; Write-Host "IIS ARR Reverse Proxy enabled." -ForegroundColor Green } catch {}

# 2. Start Backend via PM2 on internal port 5002
Write-Host "`n[2/4] Starting Backend Node Server via PM2 (Port 5002)..." -ForegroundColor Yellow
$backendDir = Join-Path $PSScriptRoot "Backend"
Push-Location $backendDir
try {
    pm2 delete cashbook-backend -ErrorAction SilentlyContinue | Out-Null
    pm2 start ecosystem.config.cjs
    pm2 save
    Write-Host "PM2 process 'cashbook-backend' is online on internal port 5002!" -ForegroundColor Green
} catch { Write-Warning "PM2 execution failed. Ensure pm2 is installed globally." }
finally { Pop-Location }

# 3. Register Task Scheduler auto‑start for PM2
Write-Host "`n[3/4] Registering PM2 Auto‑Start Task..." -ForegroundColor Yellow
$pm2Cmd = (Get-Command pm2 -ErrorAction SilentlyContinue).Source
if ($pm2Cmd) {
    $action = New-ScheduledTaskAction -Execute $pm2Cmd -Argument "resurrect"
    $trigger = New-ScheduledTaskTrigger -AtStartup
    $principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest
    Register-ScheduledTask -TaskName "CashBook_PM2_AutoStart" -Action $action -Trigger $trigger -Principal $principal -Force | Out-Null
    Write-Host "Task Scheduler auto‑start registered!" -ForegroundColor Green
}

# 4. Configure IIS Backend Proxy Site on Port 5001
Write-Host "`n[4/4] Configuring IIS Site: CashBook_Backend (Port 5001)..." -ForegroundColor Yellow
$siteName = "CashBook_Backend"
if (Get-Website -Name $siteName -ErrorAction SilentlyContinue) {
    Set-ItemProperty "IIS:\Sites\$siteName" -Name physicalPath -Value $backendDir
    if (-not (Get-WebBinding -Name $siteName -Port 5001 -ErrorAction SilentlyContinue)) {
        New-WebBinding -Name $siteName -IP "*" -Port 5001 -Protocol "http" | Out-Null
    }
} else {
    New-Website -Name $siteName -Port 5001 -PhysicalPath $backendDir -ApplicationPool "DefaultAppPool" | Out-Null
}
Start-Website -Name $siteName -ErrorAction SilentlyContinue
# Firewall rule for 5001
Remove-NetFirewallRule -DisplayName "CashBook Backend Port 5001" -ErrorAction SilentlyContinue
New-NetFirewallRule -DisplayName "CashBook Backend Port 5001" -Direction Inbound -LocalPort 5001 -Protocol TCP -Action Allow -Profile Any | Out-Null
Write-Host "Backend deployed successfully!" -ForegroundColor Green

# ===========================================================================
Write-Host "\n==================================================" -ForegroundColor Cyan
Write-Host "   CASH-BOOK FULL DEPLOYMENT FINISHED"          -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
# Pause when launched via .bat
Read-Host -Prompt "Press Enter to exit"
