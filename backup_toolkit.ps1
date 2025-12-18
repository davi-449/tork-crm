# ============================================================================
# TORK BACKUP TOOLKIT - PowerShell Version for Windows
# Compatible: Windows 10/11 with Docker Desktop
# Storage Constraint: Optimized for 20GB environments
# ============================================================================

# Configuration
$BACKUP_DIR = ".\backups"
$TIMESTAMP = Get-Date -Format "yyyyMMdd_HHmmss"
$DATE_ONLY = Get-Date -Format "yyyy-MM-dd"

# Container Names
$POSTGRES_CONTAINER = "tork-postgres-1"
$RAILS_CONTAINER = "bot-chatwoot-rails-1"

# Retention (days)
$DB_RETENTION_DAYS = 7

# PostgreSQL Configuration
$POSTGRES_USER = "postgres"
$POSTGRES_DB = "chatwoot"

# ============================================================================
# Initialize
# ============================================================================
New-Item -ItemType Directory -Force -Path "$BACKUP_DIR\db" | Out-Null
New-Item -ItemType Directory -Force -Path "$BACKUP_DIR\images" | Out-Null
$LOG_FILE = "$BACKUP_DIR\backup.log"

"=============================================" | Out-File -Append $LOG_FILE
"[$(Get-Date)] Backup started" | Out-File -Append $LOG_FILE

Write-Host "🔒 Tork Backup Toolkit - Starting backup routine..." -ForegroundColor Cyan

# ============================================================================
# Database Backup
# ============================================================================
Write-Host "[$(Get-Date)] Starting database backup..." -ForegroundColor Yellow
"[$(Get-Date)] Starting database backup..." | Out-File -Append $LOG_FILE

$TEMP_SQL = "/tmp/chatwoot_backup_$TIMESTAMP.sql"
$BACKUP_FILE = "$BACKUP_DIR\db\chatwoot_$DATE_ONLY.sql.gz"

try {
    # Export database
    docker exec $POSTGRES_CONTAINER pg_dump -U $POSTGRES_USER -d $POSTGRES_DB --no-owner --no-acl -f $TEMP_SQL 2>&1 | Out-File -Append $LOG_FILE
    
    # Compress and copy
    docker exec $POSTGRES_CONTAINER gzip -f $TEMP_SQL
    docker cp "${POSTGRES_CONTAINER}:${TEMP_SQL}.gz" $BACKUP_FILE | Out-Null
    
    # Cleanup temp file
    docker exec $POSTGRES_CONTAINER rm -f "${TEMP_SQL}.gz" | Out-Null
    
    $SIZE = (Get-Item $BACKUP_FILE).Length / 1MB
    $SizeFormatted = "{0:N2} MB" -f $SIZE
    Write-Host "✓ Database backup completed: $BACKUP_FILE ($SizeFormatted)" -ForegroundColor Green
    "[$(Get-Date)] ✓ Database backup completed: $BACKUP_FILE ($SizeFormatted)" | Out-File -Append $LOG_FILE
}
catch {
    Write-Host "✗ Database backup FAILED: $_" -ForegroundColor Red
    "[$(Get-Date)] ✗ Database backup FAILED: $_" | Out-File -Append $LOG_FILE
}

# ============================================================================
# Image Backup (FazerAI)
# ============================================================================
Write-Host "[$(Get-Date)] Starting FazerAI image backup..." -ForegroundColor Yellow
"[$(Get-Date)] Starting FazerAI image backup..." | Out-File -Append $LOG_FILE

$IMAGE_NAME = "backup-tork-fazerai-emergency"
$IMAGE_BACKUP_FILE = "$BACKUP_DIR\images\fazerai_custom_latest.tar.gz"

try {
    # Check if backup image exists
    $imageExists = docker images --format "{{.Repository}}" | Select-String -Pattern "^$IMAGE_NAME$"
    
    if (-not $imageExists) {
        Write-Host "⚠ Backup image not found. Creating snapshot..." -ForegroundColor Yellow
        docker commit $RAILS_CONTAINER $IMAGE_NAME | Out-File -Append $LOG_FILE
    }
    
    # Export and compress
    Write-Host "Exporting image (this may take 5-10 minutes)..." -ForegroundColor Yellow
    docker save $IMAGE_NAME | gzip > $IMAGE_BACKUP_FILE
    
    $SIZE = (Get-Item $IMAGE_BACKUP_FILE).Length / 1GB
    $SizeFormatted = "{0:N2} GB" -f $SIZE
    Write-Host "✓ Image backup completed: $IMAGE_BACKUP_FILE ($SizeFormatted)" -ForegroundColor Green
    "[$(Get-Date)] ✓ Image backup completed: $IMAGE_BACKUP_FILE ($SizeFormatted)" | Out-File -Append $LOG_FILE
}
catch {
    Write-Host "✗ Image backup FAILED: $_" -ForegroundColor Red
    "[$(Get-Date)] ✗ Image backup FAILED: $_" | Out-File -Append $LOG_FILE
}

# ============================================================================
# Cleanup Old Backups
# ============================================================================
Write-Host "[$(Get-Date)] Cleaning up old backups..." -ForegroundColor Yellow
"[$(Get-Date)] Cleaning up old backups..." | Out-File -Append $LOG_FILE

$cutoffDate = (Get-Date).AddDays(-$DB_RETENTION_DAYS)
Get-ChildItem "$BACKUP_DIR\db\*.sql.gz" | Where-Object { $_.LastWriteTime -lt $cutoffDate } | Remove-Item -Force

$backupCount = (Get-ChildItem "$BACKUP_DIR\db\*.sql.gz" -ErrorAction SilentlyContinue).Count
Write-Host "Database backups retained: $backupCount files (last $DB_RETENTION_DAYS days)" -ForegroundColor Cyan
"[$(Get-Date)] Database backups retained: $backupCount files" | Out-File -Append $LOG_FILE

# ============================================================================
# Storage Report
# ============================================================================
Write-Host "`n📊 Storage usage:" -ForegroundColor Cyan
"[$(Get-Date)] Storage usage:" | Out-File -Append $LOG_FILE

Get-ChildItem $BACKUP_DIR -Directory | ForEach-Object {
    $size = (Get-ChildItem $_.FullName -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum / 1GB
    $sizeFormatted = "{0:N2} GB" -f $size
    Write-Host "  $($_.Name): $sizeFormatted"
    "  $($_.Name): $sizeFormatted" | Out-File -Append $LOG_FILE
}

$drive = (Get-Item $BACKUP_DIR).PSDrive
$available = (Get-PSDrive $drive.Name).Free / 1GB
$availableFormatted = "{0:N2} GB" -f $available
Write-Host "Disk available: $availableFormatted" -ForegroundColor Green
"Disk available: $availableFormatted" | Out-File -Append $LOG_FILE

# ============================================================================
# Completion
# ============================================================================
"[$(Get-Date)] ✓ Backup completed successfully" | Out-File -Append $LOG_FILE
"=============================================" | Out-File -Append $LOG_FILE

Write-Host "`n✅ Backup finished! Check $LOG_FILE for details.`n" -ForegroundColor Green
