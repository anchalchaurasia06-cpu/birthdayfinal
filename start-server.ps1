# Birthday Website Launcher
# This script starts the server and opens the website in your default browser

Write-Host "🎉 Starting Birthday Website..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

# Set the working directory
Set-Location $PSScriptRoot

# Check if Python is installed
$pythonCheck = python --version 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Python found! Starting server..." -ForegroundColor Green
    Write-Host "📍 Opening: http://localhost:8000" -ForegroundColor Yellow
    
    # Open browser (try Chrome first, then Edge, then default)
    $browsers = @(
        "C:\Program Files\Google\Chrome\Application\chrome.exe",
        "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
    )
    
    $browser = $null
    foreach ($b in $browsers) {
        if (Test-Path $b) {
            $browser = $b
            break
        }
    }
    
    # Start server and open browser
    if ($browser) {
        Start-Process $browser "http://localhost:8000"
        Write-Host "🌐 Browser opened!" -ForegroundColor Green
    } else {
        Start-Process "http://localhost:8000"
        Write-Host "🌐 Browser opened!" -ForegroundColor Green
    }
    
    # Start the HTTP server
    python -m http.server 8000
} else {
    Write-Host "❌ Python not found. Installing from Microsoft Store..." -ForegroundColor Red
    Write-Host "⏳ This may take a few minutes..." -ForegroundColor Yellow
    
    # Try to install Python from Microsoft Store
    try {
        & winget install -e --id Python.Python.3.11 --silent 2>$null
        Write-Host "✅ Python installed! Please restart PowerShell and run this script again." -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Auto-install failed. Please:" -ForegroundColor Yellow
        Write-Host "1. Go to: https://python.org/downloads" -ForegroundColor Cyan
        Write-Host "2. Download Python 3.x" -ForegroundColor Cyan
        Write-Host "3. ✅ Check 'Add Python to PATH'" -ForegroundColor Cyan
        Write-Host "4. Click Install Now" -ForegroundColor Cyan
        Write-Host "5. Restart PowerShell and run this script again" -ForegroundColor Cyan
    }
}

pause
