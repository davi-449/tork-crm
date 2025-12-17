$body = @{
    name = "UserVerified"
    email = "sso.verified@davicode.me"
    password = "Password123!"
}
try {
    $response = Invoke-RestMethod -Method Post -Uri "http://localhost:4000/api/auth/register" -ContentType "application/json" -Body ($body | ConvertTo-Json)
    Write-Host "Success:"
    Write-Host ($response | ConvertTo-Json -Depth 5)
} catch {
    Write-Host "Error:"
    Write-Host $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "Details:"
        Write-Host $reader.ReadToEnd()
    }
}
