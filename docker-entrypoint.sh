#!/bin/sh
set -e
export HOME=/tmp

# Load secrets from file if using Docker Secrets (optional support)
# file_env() { ... }

echo "🚀 Tork CRM - Starting Initialization..."

# Start Application
echo "🟢 Starting Server (Landing Page Only)..."
exec node server.js

# Start Application
echo "🟢 Starting Server..."
exec node server.js
