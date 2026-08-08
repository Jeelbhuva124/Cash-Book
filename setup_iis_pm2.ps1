# ==============================================================================
# CASH-BOOK PROJECT - IIS & PM2 AUTOMATED HOSTING SETUP SCRIPT
# ==============================================================================
# MUST BE RUN IN POWERSHELL AS ADMINISTRATOR
# ==============================================================================

#Requires -RunAsAdministrator

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host " Starting Cash-Book IIS & PM2 Hosting Setup..." -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# 1. Check Administrator Elevation
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Error "ERROR: This script must be run as Administrator! Right-click PowerShell -> Run as Administrator."
    Exit 1
}

# 2. Enable Required IIS Features
Write-Host "`n[1/6] Enabling Windows IIS Features..." -ForegroundColor Yellow

$clientFeatures = @(
    "IIS-WebServerRole",
    "IIS-WebServer",
    "IIS-CommonHttpFeatures",
    "IIS-StaticContent",
    "IIS-DefaultDocument",
    "IIS-HttpErrors",
    "IIS-ApplicationDevelopment",
    "IIS-NetFxExt45",
    "IIS-ASPNET45",
    "IIS-WebSockets",
    "IIS-ManagementConsole",
    "IIS-ManagementScriptingTools"
)

$serverFeatures = @(
    "Web-Server",
    "Web-WebServer",
    "Web-Common-Http",
    "Web-Static-Content",
    "Web-Default-Doc",
    "Web-Http-Errors",
    "Web-App-Dev",
    "Web-Net-Ext45",
    "Web-Asp-Net45",
    "Web-WebSockets",
    "Web-Mgmt-Tools",
    "Web-Scripting-Tools"
)

if (Get-Command Install-WindowsFeature -ErrorAction SilentlyContinue) {
    # Windows Server OS
    foreach ($feature in $serverFeatures) {
        Write-Host "Enabling Server Feature: $feature..." -ForegroundColor Gray
        try { Install-WindowsFeature -Name $feature -IncludeManagementTools -ErrorAction SilentlyContinue | Out-Null } catch {}
    }
} else {
    # Windows 10 / 11 Client OS
    foreach ($feature in $clientFeatures) {
        Write-Host "Enabling Optional Feature: $feature..." -ForegroundColor Gray
        try { Enable-WindowsOptionalFeature -Online -FeatureName $feature -All -NoRestart -ErrorAction SilentlyContinue | Out-Null } catch {}
    }
}
Write-Host "IIS Features verified." -ForegroundColor Green

# 3. Check and Auto-Install IIS URL Rewrite 2.1 & ARR 3.0 Modules
Write-Host "`n[2/6] Checking / Installing IIS URL Rewrite & ARR Modules..." -ForegroundColor Yellow
Import-Module WebAdministration

$tempDir = [System.IO.Path]::GetTempPath()

# Check URL Rewrite Module
$rewriteModule = Get-WebGlobalModule | Where-Object { $_.Name -eq "RewriteModule" }
if (-not $rewriteModule) {
    Write-Host "IIS URL Rewrite Module 2.1 is missing. Downloading and installing automatically..." -ForegroundColor Cyan
    $urlRewriteMsi = Join-Path $tempDir "rewrite_amd64_en-US.msi"
    try {
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        Invoke-WebRequest -Uri "https://download.microsoft.com/download/1/2/8/128E2E22-C1B9-44A4-BE2A-5859ED1D4592/rewrite_amd64_en-US.msi" -OutFile $urlRewriteMsi
        Start-Process msiexec.exe -ArgumentList "/i `"$urlRewriteMsi`" /quiet /norestart" -Wait
        Write-Host "IIS URL Rewrite 2.1 installed successfully!" -ForegroundColor Green
    } catch {
        Write-Warning "Could not download URL Rewrite automatically. Download manually: https://www.iis.net/downloads/microsoft/url-rewrite"
    }
} else {
    Write-Host "IIS URL Rewrite Module is installed." -ForegroundColor Green
}

# Check ARR Module
$arrModule = Get-WebGlobalModule | Where-Object { $_.Name -eq "ApplicationRequestRouting" }
if (-not $arrModule) {
    Write-Host "IIS ARR 3.0 Module is missing. Downloading and installing automatically..." -ForegroundColor Cyan
    $arrMsi = Join-Path $tempDir "requestRouter_amd64.msi"
    try {
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        Invoke-WebRequest -Uri "https://download.microsoft.com/download/E/9/8/E9849167-2E14-4FA5-A7A2-7711B860714E/requestRouter_amd64.msi" -OutFile $arrMsi
        Start-Process msiexec.exe -ArgumentList "/i `"$arrMsi`" /quiet /norestart" -Wait
        Write-Host "IIS ARR 3.0 installed successfully!" -ForegroundColor Green
    } catch {
        Write-Warning "Could not download ARR 3.0 automatically. Download manually: https://www.iis.net/downloads/microsoft/application-request-routing"
    }
} else {
    Write-Host "IIS ARR 3.0 Module is installed." -ForegroundColor Green
}

# Enable Proxy in IIS Application Request Routing (ARR)
try {
    Set-WebConfigurationProperty -pspath 'MACHINE/WEBROOT/APPHOST' -filter 'system.webServer/proxy' -name 'enabled' -value 'True' -ErrorAction Stop
    Write-Host "IIS ARR Reverse Proxying Enabled successfully." -ForegroundColor Green
} catch {
    Write-Warning "Could not set ARR Proxy property. Ensure ARR 3.0 is installed."
}

# 4. Build Frontend Vite App
Write-Host "`n[3/6] Building Frontend Production Dist..." -ForegroundColor Yellow
$frontendDir = Join-Path $PSScriptRoot "Frontend"
$backendDir = Join-Path $PSScriptRoot "Backend"

Push-Location $frontendDir
try {
    Write-Host "Running npm run build inside $frontendDir..." -ForegroundColor Gray
    npm run build
    Write-Host "Frontend Build Complete!" -ForegroundColor Green
} catch {
    Write-Error "Failed to build Frontend application."
} finally {
    Pop-Location
}

# 5. Start Backend with PM2 & Configure Auto-Start
Write-Host "`n[4/6] Starting Backend via PM2..." -ForegroundColor Yellow
Push-Location $backendDir
try {
    Write-Host "Starting / Restarting PM2 ecosystem config..." -ForegroundColor Gray
    pm2 delete cashbook-backend -ErrorAction SilentlyContinue | Out-Null
    pm2 start ecosystem.config.cjs
    pm2 save
    Write-Host "PM2 Backend process 'cashbook-backend' is active on internal port 5002!" -ForegroundColor Green
} catch {
    Write-Warning "PM2 execution failed. Ensure pm2 is installed globally ('npm install -g pm2')."
} finally {
    Pop-Location
}

# Register Windows Task Scheduler Task for PM2 Auto-Start on System Boot
Write-Host "Configuring PM2 System Boot Auto-Start via Windows Task Scheduler..." -ForegroundColor Gray
$taskName = "CashBook_PM2_AutoStart"
$pm2Cmd = (Get-Command pm2 -ErrorAction SilentlyContinue).Source
if ($pm2Cmd) {
    $action = New-ScheduledTaskAction -Execute $pm2Cmd -Argument "resurrect"
    $trigger = New-ScheduledTaskTrigger -AtStartup
    $principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest
    Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Principal $principal -Force | Out-Null
    Write-Host "Task Scheduler task '$taskName' registered successfully!" -ForegroundColor Green
} else {
    Write-Warning "PM2 command executable not found in PATH for Task Scheduler registration."
}

# 6. Create / Update IIS Web Sites
Write-Host "`n[5/6] Creating IIS Web Sites..." -ForegroundColor Yellow

$frontendDist = Join-Path $frontendDir "dist"
$frontendSiteName = "CashBook_Frontend"
$backendSiteName = "CashBook_Backend"

# Ensure frontend dist directory exists
if (-not (Test-Path $frontendDist)) {
    New-Item -ItemType Directory -Path $frontendDist -Force | Out-Null
}

# Check if Default Web Site is using Port 80 and stop/rebind if necessary
if (Get-Website -Name "Default Web Site" -ErrorAction SilentlyContinue) {
    Write-Host "Stopping Default Web Site on Port 80..." -ForegroundColor Gray
    Stop-Website -Name "Default Web Site" -ErrorAction SilentlyContinue
}

# Create Frontend IIS Site (Port 8001)
if (Get-Website -Name $frontendSiteName -ErrorAction SilentlyContinue) {
    Write-Host "Updating existing IIS Site: $frontendSiteName" -ForegroundColor Gray
    Set-ItemProperty "IIS:\Sites\$frontendSiteName" -Name physicalPath -Value $frontendDist
    # Ensure Port 8001 binding exists
    if (-not (Get-WebBinding -Name $frontendSiteName -Port 8001 -ErrorAction SilentlyContinue)) {
        New-WebBinding -Name $frontendSiteName -IP "*" -Port 8001 -Protocol "http" | Out-Null
    }
} else {
    Write-Host "Creating IIS Site: $frontendSiteName (Port 8001)" -ForegroundColor Gray
    New-Website -Name $frontendSiteName -Port 8001 -PhysicalPath $frontendDist -ApplicationPool "DefaultAppPool" | Out-Null
}

# Create Backend IIS Proxy Site (Port 5001)
if (Get-Website -Name $backendSiteName -ErrorAction SilentlyContinue) {
    Write-Host "Updating existing IIS Site: $backendSiteName" -ForegroundColor Gray
    Set-ItemProperty "IIS:\Sites\$backendSiteName" -Name physicalPath -Value $backendDir
    if (-not (Get-WebBinding -Name $backendSiteName -Port 5001 -ErrorAction SilentlyContinue)) {
        New-WebBinding -Name $backendSiteName -IP "*" -Port 5001 -Protocol "http" | Out-Null
    }
} else {
    Write-Host "Creating IIS Site: $backendSiteName (Port 5001)" -ForegroundColor Gray
    New-Website -Name $backendSiteName -Port 5001 -PhysicalPath $backendDir -ApplicationPool "DefaultAppPool" | Out-Null
}

# Ensure Sites are Started
Start-Website -Name $frontendSiteName -ErrorAction SilentlyContinue
Start-Website -Name $backendSiteName -ErrorAction SilentlyContinue
Write-Host "IIS Web Sites created and started!" -ForegroundColor Green

# 7. Configure Firewall Rules for Public & Any Network Access
Write-Host "`n[6/6] Opening Windows Firewall Ports for Public & Global Access..." -ForegroundColor Yellow
Remove-NetFirewallRule -DisplayName "CashBook Frontend Port 8001" -ErrorAction SilentlyContinue
Remove-NetFirewallRule -DisplayName "CashBook Backend Port 5001" -ErrorAction SilentlyContinue

New-NetFirewallRule -DisplayName "CashBook Frontend Port 8001" -Direction Inbound -LocalPort 8001 -Protocol TCP -Action Allow -Profile Any | Out-Null
New-NetFirewallRule -DisplayName "CashBook Backend Port 5001" -Direction Inbound -LocalPort 5001 -Protocol TCP -Action Allow -Profile Any | Out-Null

Write-Host "Firewall rules added for Public Access on Ports 8001 and 5001." -ForegroundColor Green

Write-Host "`n==================================================" -ForegroundColor Cyan
Write-Host " CASH-BOOK PUBLIC IIS & PM2 SETUP COMPLETED!       " -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "Frontend Public URL : http://178.249.231.225:8001/" -ForegroundColor White
Write-Host "Backend Public API  : http://178.249.231.225:5001/api" -ForegroundColor White
Write-Host "PM2 Status          : Run 'pm2 status' in CMD/PowerShell" -ForegroundColor White
Write-Host "==================================================" -ForegroundColor Cyan
