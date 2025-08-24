#!/bin/bash

# CodeGod Backend Docker Runner Script

echo "🚀 Starting CodeGod Backend with Docker..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create a .env file with your environment variables."
    echo "You can copy from .sample.env and update the values."
    exit 1
fi

# Function to stop containers
stop_containers() {
    echo "🛑 Stopping containers..."
    docker-compose down
    exit 0
}

# Trap Ctrl+C to stop containers gracefully
trap stop_containers INT

# Build and start containers
echo "📦 Building and starting containers..."
docker-compose up --build

echo "✅ Application stopped."
