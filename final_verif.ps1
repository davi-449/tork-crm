$body = @{
    name = "Final User"
    email = "sso.fixed@davicode.me"
    password = "Password123!"
}
try {
    Write-Host "Sending Request..."
    $response = Invoke-RestMethod -Method Post -Uri "http://localhost:4000/api/auth/register" -ContentType "application/json" -Body ($body | ConvertTo-Json)
    Write-Host "Success! Response:"
    Write-Host ($response | ConvertTo-Json -Depth 5)
} catch {
    Write-Host "Error Code: $($_.Exception.Response.StatusCode)"
    Write-Host "Error Details:"
    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    Write-Host $reader.ReadToEnd()
}
