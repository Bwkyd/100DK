#!/bin/bash
# 100天配额法 Web 应用启动脚本（Mac/Linux）

echo "🚀 启动 100天配额法 Web 应用"
echo "================================"

# 启动后端
echo "📡 启动后端服务（端口 8000）..."
cd backend
python main.py &
BACKEND_PID=$!
echo "后端 PID: $BACKEND_PID"
cd ..

# 等待后端启动
sleep 2

# 启动前端
echo "🎨 启动前端服务（端口 3000）..."
cd frontend
npm run dev &
FRONTEND_PID=$!
echo "前端 PID: $FRONTEND_PID"
cd ..

echo ""
echo "✅ 服务已启动！"
echo "================================"
echo "后端: http://localhost:8000"
echo "前端: http://localhost:3000"
echo "================================"
echo ""
echo "按 Ctrl+C 停止服务"

# 等待用户中断
wait

