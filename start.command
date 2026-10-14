#!/bin/zsh
# ── Eleniyan Motors — Start Both Servers ──────────────────────────
cd "$(dirname "$0")"

echo ""
echo "  🚗  Eleniyan Motors — Starting servers..."
echo ""

# Kill anything on ports 3000 and 4000 first
lsof -ti:3000,4000 | xargs kill -9 2>/dev/null

# Start API in background
npm run dev:api &
API_PID=$!

# Wait a moment then start web
sleep 3
npm run dev:web &
WEB_PID=$!

echo ""
echo "  ✅  API running at  → http://localhost:4000"
echo "  ✅  Website running → http://localhost:3000"
echo "  ✅  Admin panel     → http://localhost:3000/admin/login"
echo ""
echo "  Press Ctrl+C to stop both servers."
echo ""

# Wait for both
wait $API_PID $WEB_PID
