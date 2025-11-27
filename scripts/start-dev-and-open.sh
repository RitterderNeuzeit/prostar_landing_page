#!/bin/bash
# Start development server and open browser

echo "🚀 Starting ProStar Development Server..."

# Kill any existing server
pkill -f "tsx watch" 2>/dev/null

# Wait for port to be free
sleep 2

# Start server in background
pnpm dev &
SERVER_PID=$!

echo "⏳ Waiting for server to start..."

# Wait for server to be ready (max 30 seconds)
for i in {1..30}; do
  if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Server is ready!"
    sleep 2
    open http://localhost:3000
    echo "🌐 Browser opened at http://localhost:3000"
    exit 0
  fi
  sleep 1
done

echo "❌ Server failed to start within 30 seconds"
kill $SERVER_PID 2>/dev/null
exit 1
