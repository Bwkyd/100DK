# 100天配额法 - Web 应用完整实现

## 🚀 快速启动

### 1. 安装后端依赖
```bash
cd backend
pip install -r requirements.txt
```

### 2. 启动后端服务
```bash
cd backend
python main.py
# 或
uvicorn main:app --reload --port 8000
```

后端将在 `http://localhost:8000` 运行

### 3. 安装前端依赖
```bash
cd frontend
npm install
# 或
pnpm install
```

### 4. 启动前端服务
```bash
cd frontend
npm run dev
```

前端将在 `http://localhost:3000` 运行

---

## 📁 项目结构

```
100DK/
├── backend/                    # 后端 FastAPI
│   ├── main.py                # API 服务器
│   └── requirements.txt       # Python 依赖
│
├── frontend/                   # 前端 Next.js
│   ├── app/
│   │   ├── page.tsx           # 主页面
│   │   ├── layout.tsx         # 根布局
│   │   └── globals.css        # 全局样式
│   ├── components/
│   │   ├── Calendar.tsx       # 日历组件
│   │   ├── HabitTabs.tsx      # 习惯切换
│   │   ├── StatsCard.tsx      # 统计卡片
│   │   ├── Modal.tsx          # 基础弹窗
│   │   ├── CreateHabitModal.tsx
│   │   ├── CheckinModal.tsx
│   │   └── DateDetailModal.tsx
│   ├── lib/
│   │   ├── types.ts           # TypeScript 类型
│   │   ├── api.ts             # API 调用
│   │   └── utils.ts           # 工具函数
│   └── package.json
│
├── cli_main.py                # CLI 工具（被后端复用）
└── data/
    └── habits.json            # 数据存储
```

---

## 🎯 核心功能

### ✅ 已实现功能

1. **创建习惯**
   - 最多4个习惯
   - 每个习惯至少3个执行意图
   - 自动设置开始/结束时间

2. **每日打卡**
   - 选择执行意图
   - 每天只能打卡一次
   - 实时更新统计

3. **日历视图**
   - 月度日历展示
   - 已打卡/未打卡/未来日期状态
   - 点击查看详情

4. **统计信息**
   - 进度条显示
   - 已完成/剩余天数
   - 意图使用统计

5. **多习惯管理**
   - Tab 切换不同习惯
   - 独立的日历和统计
   - 习惯列表管理

---

## 🔧 技术栈

### 后端
- **FastAPI** - 高性能 Web 框架
- **Python 3.10+** - 编程语言
- **JSON** - 数据存储（复用 cli_main.py）

### 前端
- **Next.js 14** - React 框架（App Router）
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **date-fns** - 日期处理

---

## 🌐 API 接口

### 习惯管理
```
GET    /api/tasks              # 获取所有习惯
POST   /api/tasks              # 创建习惯
GET    /api/tasks/{id}         # 获取单个习惯
DELETE /api/tasks/{id}         # 删除习惯
```

### 打卡
```
POST   /api/tasks/{id}/checkin     # 打卡
GET    /api/tasks/{id}/stats       # 获取统计
```

### 执行意图
```
PUT    /api/tasks/{id}/intents     # 更新执行意图
```

---

## 💡 使用指南

### 1. 创建第一个习惯

1. 打开 `http://localhost:3000`
2. 点击"创建第一个习惯"
3. 填写习惯名称（如：运动）
4. 填写3个执行意图：
   - 意图1：如果「早上7:00闹钟响」那么「立刻下楼快走20分钟」
   - 意图2：如果「下雨或雾霾」那么「在家做15分钟自重训练」
   - 意图3：如果「起晚了」那么「晚上8点补运动30分钟」
5. 点击"创建习惯"

### 2. 每日打卡

1. 点击右侧"✅ 打卡"按钮
2. 选择今天执行的意图
3. 点击"确认打卡"
4. 日历会自动更新为绿色✅

### 3. 查看日期详情

- **点击绿色日期**：查看已打卡详情（日期、时间、意图）
- **点击灰色日期**：查看未打卡提示
- **点击未来日期**：显示"还没到这一天"

### 4. 切换习惯

- 在右侧习惯列表点击不同习惯
- 日历和统计自动切换

---

## 🎨 界面截图对照

| 功能 | 对应 UI 设计图 |
|------|---------------|
| 主页面 | nian100.png |
| 创建习惯 | moban.png |
| 打卡 | daka.png |
| 已打卡详情 | yidaka.png |
| 未打卡详情 | weidaka.png |
| 未来日期 | bunengdaka.png |
| 执行意图管理 | zhixingyitu.png（待实现）|

---

## ⚠️ 注意事项

### 数据存储
- 数据保存在 `100DK/data/habits.json`
- 前后端共享同一个数据文件
- 建议定期备份数据

### 开发环境
- 后端运行在 8000 端口
- 前端运行在 3000 端口
- 已配置 CORS 允许跨域请求

### 浏览器兼容
- 推荐使用 Chrome/Edge/Safari 最新版本
- 需要启用 JavaScript

---

## 🔄 数据流

```
用户操作（前端）
    ↓
API 调用（fetch）
    ↓
FastAPI 后端
    ↓
HabitTracker（cli_main.py）
    ↓
JSON 文件存储
    ↓
返回结果
    ↓
前端状态更新
    ↓
UI 重新渲染
```

---

## 🐛 故障排查

### 后端无法启动
```bash
# 检查端口占用
lsof -i :8000  # Mac/Linux
netstat -ano | findstr :8000  # Windows

# 重新安装依赖
pip install -r requirements.txt
```

### 前端无法启动
```bash
# 删除 node_modules 重新安装
rm -rf node_modules package-lock.json
npm install

# 或使用 pnpm
pnpm install
```

### CORS 错误
确保：
1. 后端正在运行
2. 前端 API_BASE 配置正确（默认 http://localhost:8000）
3. 后端 CORS 配置包含前端地址

### 数据不同步
1. 检查 `data/habits.json` 文件是否存在
2. 确认文件权限可读写
3. 重启后端服务

---

## 🚀 生产部署

### 后端部署
```bash
# 使用 gunicorn
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker

# 或使用 Docker
docker build -t 100dk-backend .
docker run -p 8000:8000 100dk-backend
```

### 前端部署
```bash
# 构建生产版本
npm run build

# 使用 PM2 运行
npm install -g pm2
pm2 start npm --name "100dk" -- start

# 或部署到 Vercel
vercel deploy
```

---

## 📈 扩展功能（可选）

### 待实现功能
- [ ] 执行意图管理界面（参考 zhixingyitu.png）
- [ ] 数据导出（CSV/JSON）
- [ ] 多月日历查看
- [ ] 用户登录系统
- [ ] 数据可视化图表
- [ ] 提醒功能

### 数据库迁移
可以将 JSON 文件迁移到：
- SQLite（轻量级）
- PostgreSQL（生产环境）
- MongoDB（文档数据库）

---

## 📞 技术支持

### 相关文档
- `PRD.md` - 产品需求文档
- `FRD.md` - 前端需求文档
- `cli_main.py` - CLI 工具源码
- `README.md` - 项目说明

### 开发团队
- 后端：基于 cli_main.py 的 FastAPI 封装
- 前端：Next.js + TypeScript 实现
- 设计：参考 UI 设计图（7张）

---

**版本**: v1.0  
**最后更新**: 2025-10-07  
**状态**: ✅ 核心功能已完成

**💪 开始你的100天习惯养成之旅！**

