# 🔒 Tork Backup System - Setup Guide

## Overview
Automated backup system optimized for **20GB storage environments**. Features intelligent rotation and compression to minimize disk usage.

---

## 📦 What Gets Backed Up?

1. **Database (Daily)**
   - PostgreSQL database dump (compressed with gzip)
   - Retention: 7 days
   - Average size: ~5-50MB (compressed)

2. **FazerAI Custom Image (Weekly/On-demand)**
   - Docker image snapshot
   - Retention: Latest only (overwrites previous)
   - Size: ~800MB-2GB (compressed)

---

## 🚀 Quick Start

### 1. Make the Script Executable

```bash
chmod +x backup_toolkit.sh
```

### 2. Test Manual Backup

```bash
./backup_toolkit.sh
```

**Expected output:**
```
🔒 Tork Backup Toolkit - Starting backup routine...
[2025-12-17] Starting database backup...
[2025-12-17] ✓ Database backup completed: ./backups/db/chatwoot_2025-12-17.sql.gz (15M)
[2025-12-17] Starting FazerAI image backup...
[2025-12-17] ✓ Image backup completed: ./backups/images/fazerai_custom_latest.tar.gz (1.2G)
✅ Backup finished!
```

---

## ⏰ Automated Backups (Cron)

### For Linux/WSL

1. **Open crontab editor:**
   ```bash
   crontab -e
   ```

2. **Add this line** (runs daily at 3:00 AM):
   ```bash
   0 3 * * * cd /absolute/path/to/tork-crm && ./backup_toolkit.sh >> ./backups/cron.log 2>&1
   ```
   
   > **Important:** Replace `/absolute/path/to/tork-crm` with your actual project path.
   > You can get it by running: `pwd` inside the project folder.

3. **Save and exit** (Ctrl+X, then Y, then Enter in nano)

4. **Verify cron is active:**
   ```bash
   crontab -l
   ```

### For Windows (Task Scheduler)

1. Open **Task Scheduler**
2. Create Basic Task → Name: "Tork Backup"
3. Trigger: Daily at 3:00 AM
4. Action: **Start a Program**
   - Program: `wsl`
   - Arguments: `bash -c "cd /mnt/c/Users/User/Desktop/vscode/tork-crm && ./backup_toolkit.sh"`
5. Finish

---

## 📂 Backup Structure

```
tork-crm/
├── backups/
│   ├── db/
│   │   ├── chatwoot_2025-12-17.sql.gz
│   │   ├── chatwoot_2025-12-16.sql.gz
│   │   └── ... (last 7 days)
│   ├── images/
│   │   └── fazerai_custom_latest.tar.gz  (always overwrites)
│   └── backup.log
└── backup_toolkit.sh
```

---

## 🔄 Restoration Guide

### Restore Database

```bash
# 1. Extract the backup
gunzip backups/db/chatwoot_2025-12-17.sql.gz

# 2. Stop the Rails container (to avoid conflicts)
docker stop bot-chatwoot-rails-1

# 3. Restore to PostgreSQL
docker exec -i tork-postgres-1 psql -U postgres -d chatwoot < backups/db/chatwoot_2025-12-17.sql

# 4. Restart Rails
docker start bot-chatwoot-rails-1
```

### Restore FazerAI Image

```bash
# 1. Load the image back into Docker
docker load < backups/images/fazerai_custom_latest.tar.gz

# 2. Verify it's loaded
docker images | grep backup-tork-fazerai-emergency

# 3. If needed, tag and use it
docker tag backup-tork-fazerai-emergency:latest chatwoot/fazerai:recovery
```

---

## 🛡️ GitHub Integration

Your `.gitignore` is already configured to exclude:
- ✅ `backups/` folder
- ✅ `*.sql`, `*.sql.gz`, `*.tar.gz` files
- ✅ Log files

**Safe to commit:**
- ✅ `backup_toolkit.sh`
- ✅ `docker-compose.prod.yml`
- ✅ `Dockerfile`
- ✅ `BACKUP_SETUP.md` (this file)

---

## 📊 Monitoring

### Check Backup Status

```bash
# View last backup log
tail -n 50 backups/backup.log

# Check disk usage
du -sh backups/*
```

### View Backup History

```bash
# List all database backups
ls -lh backups/db/

# Check oldest backup (will be deleted next)
find backups/db/ -name "*.sql.gz" -mtime +6
```

---

## ⚙️ Configuration

Edit `backup_toolkit.sh` to customize:

```bash
# Retention periods
DB_RETENTION_DAYS=7        # Keep database backups for 7 days
IMAGE_RETENTION_DAYS=30    # Image backup policy

# Container names (if different)
POSTGRES_CONTAINER="tork-postgres-1"
RAILS_CONTAINER="bot-chatwoot-rails-1"
```

---

## 🚨 Troubleshooting

### "No space left on device"

```bash
# Clean up old Docker images
docker image prune -a

# Manually delete old backups
find backups/db/ -name "*.sql.gz" -mtime +3 -delete
```

### "Permission denied"

```bash
# Fix script permissions
chmod +x backup_toolkit.sh

# Fix backup folder permissions
sudo chown -R $USER:$USER backups/
```

### Backup not running automatically

```bash
# Check if cron service is running
sudo service cron status

# Check cron logs
grep CRON /var/log/syslog | tail -20
```

---

## 📈 Storage Planning

**Expected monthly usage (default config):**
- Database backups: ~100-350MB (7 days × ~15-50MB)
- Image backup: ~1.2GB (1 snapshot, overwrites)
- **Total: ~1.3-1.5GB**

**Available for 20GB constraint:** ✅ Safe margin!

---

## 🎯 Best Practices

1. **Test restores monthly** - Don't wait for disaster!
2. **Monitor logs** - Check `backup.log` weekly
3. **Off-site backup** - Copy `backups/` to external drive monthly
4. **Before major changes** - Run manual backup first

---

## 📞 Support

If backups fail consistently, check:
1. Docker containers are running: `docker ps`
2. Postgres is healthy: `docker logs tork-postgres-1 --tail 20`
3. Disk space available: `df -h`
