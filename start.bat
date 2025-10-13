@echo off
REM 100天配额法 Web 应用启动脚本（Windows）

echo 🚀 启动 100天配额法 Web 应用
echo ================================

REM 启动后端
echo 📡 启动后端服务（端口 8000）...
cd backend
start cmd /k python main.py
cd ..

REM 等待后端启动
timeout /t 2 /nobreak

REM 启动前端
echo 🎨 启动前端服务（端口 3000）...
cd frontend
start cmd /k npm run dev
cd ..

echo.
echo ✅ 服务已启动！
echo ================================
echo 后端: http://localhost:8000
echo 前端: http://localhost:3000
echo ================================
echo.
echo 关闭窗口以停止服务

pause

