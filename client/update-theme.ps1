# PowerShell script to update color theme across all JSX files
# Run this from the client/src directory

$files = Get-ChildItem -Path "." -Include *.jsx -Recurse

# Color mappings (old -> new)
$colorMappings = @{
    # Background colors
    '#0A0F1F' = '#0D0D0D'
    '#11182B' = '#222222'
    
    # Text colors
    '#E2E8F0' = '#F5F5F5'
    '#94A3B8' = '#D1D5DB'
    '#64748B' = '#6B7280'
    
    # Border colors
    '#1E293B' = '#2E2E2E'
    '#334155' = '#2E2E2E'
    
    # Primary Blue (replacing indigo/purple)
    '#4F46E5' = '#1D4ED8'
    '#4338CA' = '#1E40AF'
    '#3B82F6' = '#1D4ED8'
    
    # Success Green -> Blue
    '#10B981' = '#1D4ED8'
    '#059669' = '#1E40AF'
    
    # Danger Red -> Grey
    '#EF4444' = '#6B7280'
    '#DC2626' = '#4B5563'
    
    # Warning Orange -> Grey
    '#F59E0B' = '#6B7280'
    '#D97706' = '#4B5563'
    
    # Other greys
    '#475569' = '#4B5563'
}

$totalReplacements = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    foreach ($oldColor in $colorMappings.Keys) {
        $newColor = $colorMappings[$oldColor]
        $content = $content -replace [regex]::Escape($oldColor), $newColor
    }
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Updated: $($file.Name)" -ForegroundColor Green
        $totalReplacements++
    }
}

Write-Host "`nTotal files updated: $totalReplacements" -ForegroundColor Cyan
Write-Host "Theme migration complete!" -ForegroundColor Green
