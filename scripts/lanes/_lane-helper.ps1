function New-Lane {
  param([Parameter(Mandatory=$true)][string]$Name,[Parameter(Mandatory=$true)][string]$Summary)
  $lanePath = "ai/out/LANE_{0}.md" -f $Name
  @"
# Lane: $Name
Date: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

Summary:
$Summary

Checks:
- Placeholder pass

Result: ${Name}_OK
"@ | Set-Content $lanePath
}

