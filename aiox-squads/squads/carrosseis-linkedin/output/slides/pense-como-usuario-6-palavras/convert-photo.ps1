[Console]::OutputEncoding = [Text.Encoding]::UTF8
$ErrorActionPreference = "Stop"

# Find the photo using wildcard to avoid encoding issues
$photo = Get-ChildItem -Path "d:\01AAntiGravity" -Recurse -Filter "profile-photo.png" | Where-Object { $_.DirectoryName -like "*carrosseis-linkedin*assets*" } | Select-Object -First 1

if (-not $photo) {
    Write-Error "Profile photo not found!"
    exit 1
}

Write-Host "Found photo: $($photo.FullName)"
$bytes = [System.IO.File]::ReadAllBytes($photo.FullName)
Write-Host "Photo size: $($bytes.Length) bytes"

$b64 = [Convert]::ToBase64String($bytes)
Write-Host "Base64 length: $($b64.Length)"

# Write to a file next to this script
$outDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$outFile = Join-Path $outDir "profile-b64.txt"
[System.IO.File]::WriteAllText($outFile, $b64)
Write-Host "Written to: $outFile"
