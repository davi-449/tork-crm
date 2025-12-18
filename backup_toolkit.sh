#!/bin/bash
#===============================================================================
# TORK BACKUP TOOLKIT - Automated Backup System
# Compatible: Linux/WSL | Docker Containers
# Storage Constraint: Optimized for 20GB environments
#===============================================================================

set -e  # Exit on error

#-------------------------------------------------------------------------------
# CONFIGURATION
#-------------------------------------------------------------------------------
BACKUP_DIR="./backups"
LOG_FILE="$BACKUP_DIR/backup.log"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DATE_ONLY=$(date +%Y-%m-%d)

# Container Names
POSTGRES_CONTAINER="tork-postgres-1"
RAILS_CONTAINER="bot-chatwoot-rails-1"

# Backup Retention (days)
DB_RETENTION_DAYS=7
IMAGE_RETENTION_DAYS=30

# Postgres Configuration
POSTGRES_USER="postgres"
POSTGRES_DB="chatwoot"

#-------------------------------------------------------------------------------
# INITIALIZE
#-------------------------------------------------------------------------------
mkdir -p "$BACKUP_DIR"/{db,images}
echo "=============================================" >> "$LOG_FILE"
echo "[$(date)] Backup started" >> "$LOG_FILE"

#-------------------------------------------------------------------------------
# FUNCTION: Database Backup (PostgreSQL + gzip compression)
#-------------------------------------------------------------------------------
backup_database() {
    echo "[$(date)] Starting database backup..." | tee -a "$LOG_FILE"
    
    local TEMP_SQL="/tmp/chatwoot_backup_$TIMESTAMP.sql"
    local BACKUP_FILE="$BACKUP_DIR/db/chatwoot_$DATE_ONLY.sql.gz"
    
    # Export database (skip pgvector extension errors)
    if docker exec "$POSTGRES_CONTAINER" pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
        --no-owner --no-acl -f "$TEMP_SQL" 2>&1 | grep -v "could not access file" | tee -a "$LOG_FILE"; then
        
        # Compress and copy to host
        docker exec "$POSTGRES_CONTAINER" gzip -f "$TEMP_SQL"
        docker cp "$POSTGRES_CONTAINER:${TEMP_SQL}.gz" "$BACKUP_FILE"
        
        # Cleanup temp file in container
        docker exec "$POSTGRES_CONTAINER" rm -f "${TEMP_SQL}.gz"
        
        local SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
        echo "[$(date)] ✓ Database backup completed: $BACKUP_FILE ($SIZE)" | tee -a "$LOG_FILE"
    else
        echo "[$(date)] ✗ Database backup FAILED" | tee -a "$LOG_FILE"
        return 1
    fi
}

#-------------------------------------------------------------------------------
# FUNCTION: Image Backup (FazerAI Custom Image)
#-------------------------------------------------------------------------------
backup_fazerai_image() {
    echo "[$(date)] Starting FazerAI image backup..." | tee -a "$LOG_FILE"
    
    local IMAGE_NAME="backup-tork-fazerai-emergency"
    local BACKUP_FILE="$BACKUP_DIR/images/fazerai_custom_latest.tar.gz"
    
    # Check if backup image exists
    if ! docker images --format "{{.Repository}}" | grep -q "^$IMAGE_NAME$"; then
        echo "[$(date)] ⚠ Backup image not found. Creating snapshot..." | tee -a "$LOG_FILE"
        docker commit "$RAILS_CONTAINER" "$IMAGE_NAME" >> "$LOG_FILE" 2>&1
    fi
    
    # Export and compress (overwrite previous to save space)
    echo "[$(date)] Exporting image (this may take 5-10 minutes)..." | tee -a "$LOG_FILE"
    docker save "$IMAGE_NAME" | gzip > "$BACKUP_FILE"
    
    local SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo "[$(date)] ✓ Image backup completed: $BACKUP_FILE ($SIZE)" | tee -a "$LOG_FILE"
}

#-------------------------------------------------------------------------------
# FUNCTION: Cleanup Old Backups
#-------------------------------------------------------------------------------
cleanup_old_backups() {
    echo "[$(date)] Cleaning up old backups..." | tee -a "$LOG_FILE"
    
    # Remove database backups older than retention period
    find "$BACKUP_DIR/db" -name "*.sql.gz" -type f -mtime +$DB_RETENTION_DAYS -delete 2>/dev/null || true
    
    # Count remaining backups
    local DB_COUNT=$(find "$BACKUP_DIR/db" -name "*.sql.gz" -type f | wc -l)
    echo "[$(date)] Database backups retained: $DB_COUNT files (last $DB_RETENTION_DAYS days)" | tee -a "$LOG_FILE"
}

#-------------------------------------------------------------------------------
# FUNCTION: Storage Report
#-------------------------------------------------------------------------------
storage_report() {
    echo "[$(date)] Storage usage:" | tee -a "$LOG_FILE"
    du -sh "$BACKUP_DIR"/* 2>/dev/null | tee -a "$LOG_FILE" || echo "No backups yet" | tee -a "$LOG_FILE"
    df -h "$BACKUP_DIR" | tail -1 | awk '{print "Disk available: " $4}' | tee -a "$LOG_FILE"
}

#-------------------------------------------------------------------------------
# MAIN EXECUTION
#-------------------------------------------------------------------------------
echo "🔒 Tork Backup Toolkit - Starting backup routine..."

# Execute backups
backup_database
backup_fazerai_image

# Cleanup and report
cleanup_old_backups
storage_report

echo "[$(date)] ✓ Backup completed successfully" | tee -a "$LOG_FILE"
echo "=============================================" >> "$LOG_FILE"
echo ""
echo "✅ Backup finished! Check $LOG_FILE for details."
