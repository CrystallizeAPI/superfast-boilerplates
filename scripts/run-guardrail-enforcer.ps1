param([string]$OutDir = $env:GUARDRAIL_OUT_DIR)

if (-not $OutDir) { $OutDir = "ai/out" }

$ErrorActionPreference = "Stop"

if (-not (Test-Path $OutDir)) { New-Item -ItemType Directory -Force -Path $OutDir | Out-Null }

$laneFiles = Get-ChildItem -Path $OutDir -Filter "LANE_*.md" -ErrorAction SilentlyContinue

$results = @()

foreach ($file in $laneFiles) {
  $text = Get-Content $file.FullName -Raw
  $match = [regex]::Match($text, "(?m)^Result:\s*(\S+)")
  if ($match.Success) { $results += [PSCustomObject]@{ Lane = $file.BaseName; Result = $match.Groups[1].Value } }
  else { $results += [PSCustomObject]@{ Lane = $file.BaseName; Result = "UNKNOWN" } }
}

$overall = "RELEASE_GO"

foreach ($r in $results) { if ($r.Result -notmatch "OK|RELEASE_GO") { $overall = "RELEASE_HOLD"; break } }

$report = @"
# Guardrail Enforcer Report

OutDir: $OutDir
Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

Lanes:
$(
  $results | ForEach-Object { "- $($_.Lane): $($_.Result)" } | Out-String
)

Decision: $overall
"@

$reportPath = Join-Path $OutDir "GUARDRAIL_ENFORCER_REPORT.md"
Set-Content -Path $reportPath -Value $report

if ($overall -eq "RELEASE_GO") { exit 0 } else { Write-Error "Release gated: $overall"; exit 1 }

