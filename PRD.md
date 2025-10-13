# 100天配额法习惯追踪系统 - 产品需求文档 (PRD)

> **文档目标**：本文档面向 AI 代码生成器，提供完整、明确、可执行的技术需求，确保 AI 能够理解业务逻辑并生成正确的代码。

---

## 1. 项目背景

### 1.1 核心理念
传统的"连续打卡"模式存在致命缺陷：一旦中断就容易触发"破罐破摔效应"导致彻底放弃。本项目基于心理学研究，采用"非连续的年度100天配额"模式：

**关键心理学原理**：
- **灵活配额 vs 连续打卡**：100天不要求连续，允许间断，降低完美主义陷阱
- **执行意图（Implementation Intention）**："如果...那么..."的情境-行动绑定，减少决策疲劳
- **稀缺性框架**：倒计时将目标转化为有限资源，激活损失厌恶心理
- **习惯形成三重强化**：3个周期（3×36-42天）提供多次神经通路强化

### 1.2 业务目标
- 用户能在一年内以非连续方式完成100天目标
- 通过执行意图降低行动门槛
- 通过可视化倒计时增强自我效能感
- 支持多领域（运动、阅读、控糖等）并行管理

---

## 2. 典型用户用例（AI测试数据生成参考）

### 用例 1：新用户首次创建习惯
**场景**：用户 Alice 在 2025-10-01 首次使用系统，创建"运动"习惯

**操作流程**：
1. 点击"创建"按钮
2. 填写习惯名称："运动"
3. 填写主执行意图（必填）：
   - IF: "早上7:00闹钟响"
   - THEN: "立刻下楼快走20分钟"
4. 填写副意图1（必填）：
   - IF: "下雨或雾霾"
   - THEN: "在家做15分钟自重训练"
5. 填写副意图2（必填）：
   - IF: "起晚了"
   - THEN: "晚上8点补运动30分钟"
6. 系统自动设置：
   - start_at: "2025-10-01"（创建当天）
   - End_at: "2026-10-01"（次年同日）
   - target_days: 100
   - max_gap: 5（默认最大间隔天数）

**预期数据**：
```json
{
  "id": "uuid-generated",
  "name": "运动",
  "start_at": "2025-10-01",
  "End_at": "2026-10-01",
  "target_days": 100,
  "max_gap": 5,
  "intents": [
    {"if": "早上7:00闹钟响", "then": "立刻下楼快走20分钟", "count": 0},
    {"if": "下雨或雾霾", "then": "在家做15分钟自重训练", "count": 0},
    {"if": "起晚了", "then": "晚上8点补运动30分钟", "count": 0}
  ],
  "logs": []
}
```

### 用例 2：用户日常打卡
**场景**：用户 Bob 在 2025-10-05 早上完成运动后打卡

**操作流程**：
1. 打开主页面，看到日历显示：
   - 10-01: 已打卡（绿色）
   - 10-02: 已打卡（绿色）
   - 10-03: 未打卡（灰色）
   - 10-04: 未打卡（灰色）
   - 10-05: 今天（高亮，可打卡）
   - 剩余天数：97天
2. 点击"打卡"按钮
3. 弹窗显示所有执行意图，必须勾选其中一个
4. 选择："早上7:00闹钟响 → 立刻下楼快走20分钟"
5. 确认打卡

**预期数据变化**：
```json
{
  "intents": [
    {"if": "早上7:00闹钟响", "then": "立刻下楼快走20分钟", "count": 1}  // count +1
  ],
  "logs": [
    {"date": "2025-10-05T07:30:00", "intent": 0}  // 新增记录
  ]
}
```

### 用例 3：查看已打卡日期详情
**场景**：用户点击 10-01（已打卡日期）

**展示内容**：
- 日期：2025-10-01
- 状态：✅ 已完成
- 执行意图：早上7:00闹钟响 → 立刻下楼快走20分钟
- 打卡时间：07:25
- 剩余配额：99天

### 用例 4：点击未打卡日期
**场景**：用户点击 10-03（已过去但未打卡）

**展示内容**：
- 日期：2025-10-03
- 状态：❌ 未完成
- 提示：这天没有打卡，还剩 XX 天配额
- 无法补打卡（历史日期不可更改）

### 用例 5：点击未来日期
**场景**：用户在 10-05 点击 10-07

**展示内容**：
- 提示："还没到这一天，无法打卡"
- 日期灰色不可点击

### 用例 6：管理执行意图
**场景**：用户需要调整执行意图

**操作流程**：
1. 点击"执行意图"按钮
2. 看到主意图（第一个）：只能修改，不能删除
3. 看到副意图：可以修改、删除、添加
4. 点击"添加副意图"，无数量限制
5. 保存更改

### 用例 7：多习惯管理
**场景**：用户创建第2个习惯"阅读"

**规则**：
- 最多创建 4 个习惯
- 每个习惯独立：
  - 独立的日历显示
  - 独立的打卡记录
  - 独立的执行意图
- 主页面右侧切换 Tab 查看不同习惯

### 用例 8：边界条件测试数据
**AI 生成测试用例时需覆盖**：

1. **时间边界**：
   - 创建时间为 2025-12-31，结束时间为 2026-12-31
   - 跨年打卡记录
   
2. **打卡限制**：
   - 同一天尝试打卡两次（应被拒绝）
   - 未来日期打卡（应被拒绝）
   - 历史日期补打卡（应被拒绝）

3. **意图管理**：
   - 删除主意图（应被拒绝）
   - 添加第 20 个副意图（应允许）
   - 创建时只填写 2 个意图（应被拒绝，至少3个）

4. **习惯数量**：
   - 创建第 5 个习惯（应被拒绝）
   - 删除习惯后重新创建（应允许）

---

## 3. 技术选型与架构

### 3.1 技术栈
```
前端：Next.js 14+ (App Router) + Tailwind CSS + TypeScript
后端：FastAPI + Python 3.10+
数据库：JSON 文件（轻量级，适合单机版）
```

### 3.2 项目结构
```
100DK/
├── backend/                    # 后端服务
│   ├── main.py                # FastAPI 入口
│   ├── models.py              # 数据模型（Pydantic）
│   ├── routes/
│   │   ├── tasks.py           # 习惯管理路由
│   │   ├── checkins.py        # 打卡路由
│   │   └── intents.py         # 执行意图路由
│   ├── services/
│   │   ├── task_service.py    # 业务逻辑
│   │   └── storage.py         # JSON 文件读写
│   └── requirements.txt
│
├── frontend/                   # 前端应用
│   ├── app/
│   │   ├── page.tsx           # 主页面
│   │   ├── layout.tsx         # 布局
│   │   └── api/               # API 路由（如需）
│   ├── components/
│   │   ├── Calendar.tsx       # 日历组件
│   │   ├── CheckinModal.tsx   # 打卡弹窗
│   │   ├── CreateTaskModal.tsx # 创建习惯弹窗
│   │   ├── IntentModal.tsx    # 执行意图弹窗
│   │   └── TaskTabs.tsx       # 习惯切换Tab
│   ├── lib/
│   │   ├── api.ts             # API 调用封装
│   │   └── utils.ts           # 工具函数
│   └── package.json
│
└── data/
    └── tasks.json             # 数据存储
```

### 3.3 数据模型（完整版）
```typescript
// TypeScript 类型定义
interface Intent {
  if: string;           // 触发条件
  then: string;         // 执行动作
  count: number;        // 被选择次数
  temp?: boolean;       // 临时意图标记（用于返回等特殊操作）
}

interface CheckinLog {
  date: string;         // ISO 8601 格式：2025-10-01T07:30:00
  intent: number;       // 执行意图索引
}

interface Task {
  id: string;           // UUID
  name: string;         // 习惯名称
  start_at: string;     // 开始日期（创建日期）
  End_at: string;       // 结束日期（次年同日）
  target_days: number;  // 目标天数（默认100）
  max_gap: number;      // 最大间隔天数（默认5）
  intents: Intent[];    // 执行意图列表（至少3个）
  logs: CheckinLog[];   // 打卡记录
}

interface Database {
  version: number;      // 数据版本
  tasks: Task[];        // 习惯列表（最多4个）
}
```

---

## 4. 核心流程

### 4.1 API 设计（RESTful）

#### 4.1.1 习惯管理
```
GET    /api/tasks              # 获取所有习惯
POST   /api/tasks              # 创建新习惯
GET    /api/tasks/{task_id}    # 获取单个习惯详情
PUT    /api/tasks/{task_id}    # 更新习惯（名称等）
DELETE /api/tasks/{task_id}    # 删除习惯
```

#### 4.1.2 打卡管理
```
POST   /api/tasks/{task_id}/checkin     # 打卡
GET    /api/tasks/{task_id}/checkins    # 获取打卡记录
GET    /api/tasks/{task_id}/stats       # 获取统计信息
```

#### 4.1.3 执行意图管理
```
GET    /api/tasks/{task_id}/intents           # 获取所有意图
POST   /api/tasks/{task_id}/intents           # 添加副意图
PUT    /api/tasks/{task_id}/intents/{index}   # 修改意图
DELETE /api/tasks/{task_id}/intents/{index}   # 删除副意图（index>0）
```

### 4.2 关键业务规则

#### 规则 1：创建习惯校验
```python
# 伪代码
def create_task(data):
    # 校验1：习惯数量不超过4个
    if len(existing_tasks) >= 4:
        raise HTTPException(400, "最多创建4个习惯")
    
    # 校验2：执行意图至少3个
    if len(data.intents) < 3:
        raise HTTPException(400, "至少需要3个执行意图（1个主意图+2个副意图）")
    
    # 校验3：名称不为空
    if not data.name.strip():
        raise HTTPException(400, "习惯名称不能为空")
    
    # 自动填充字段
    task = {
        "id": str(uuid.uuid4()),
        "name": data.name,
        "start_at": datetime.now().isoformat(),
        "End_at": (datetime.now() + timedelta(days=365)).isoformat(),
        "target_days": 100,
        "max_gap": 5,
        "intents": data.intents,
        "logs": []
    }
    return task
```

#### 规则 2：打卡校验
```python
def checkin(task_id, intent_index):
    task = get_task(task_id)
    now = datetime.now()
    today = now.date()
    
    # 校验1：今天是否已打卡
    today_logs = [log for log in task.logs 
                  if datetime.fromisoformat(log.date).date() == today]
    if today_logs:
        raise HTTPException(400, "今天已经打卡过了")
    
    # 校验2：是否在有效期内
    if today < datetime.fromisoformat(task.start_at).date():
        raise HTTPException(400, "习惯还未开始")
    if today > datetime.fromisoformat(task.End_at).date():
        raise HTTPException(400, "习惯已结束")
    
    # 校验3：意图索引有效
    if intent_index < 0 or intent_index >= len(task.intents):
        raise HTTPException(400, "无效的执行意图")
    
    # 执行打卡
    task.logs.append({
        "date": now.isoformat(),
        "intent": intent_index
    })
    task.intents[intent_index].count += 1
    
    return {"remaining_days": task.target_days - len(task.logs)}
```

#### 规则 3：日历状态计算
```python
def get_calendar_status(task, year, month):
    logs_dict = {}
    for log in task.logs:
        date = datetime.fromisoformat(log.date).date()
        logs_dict[date] = log
    
    start_date = datetime.fromisoformat(task.start_at).date()
    end_date = datetime.fromisoformat(task.End_at).date()
    today = datetime.now().date()
    
    calendar = []
    for day in range(1, 32):  # 处理所有可能的天数
        try:
            current_date = datetime(year, month, day).date()
        except ValueError:
            break
        
        status = {
            "date": current_date.isoformat(),
            "day": day,
            "type": None,  # "checked", "unchecked", "future", "disabled"
            "intent": None,
            "time": None
        }
        
        if current_date < start_date or current_date > end_date:
            status["type"] = "disabled"
        elif current_date > today:
            status["type"] = "future"
        elif current_date in logs_dict:
            log = logs_dict[current_date]
            status["type"] = "checked"
            status["intent"] = task.intents[log.intent]
            status["time"] = datetime.fromisoformat(log.date).strftime("%H:%M")
        else:
            status["type"] = "unchecked"
        
        calendar.append(status)
    
    return calendar
```

#### 规则 4：意图管理约束
```python
def delete_intent(task_id, intent_index):
    # 主意图（index=0）不可删除
    if intent_index == 0:
        raise HTTPException(400, "主意图不能删除，只能修改")
    
    task = get_task(task_id)
    
    # 至少保留3个意图
    if len(task.intents) <= 3:
        raise HTTPException(400, "至少需要保留3个执行意图")
    
    del task.intents[intent_index]
    
    # 更新打卡记录中的意图索引（如果删除的意图被引用过）
    for log in task.logs:
        if log.intent == intent_index:
            log.intent = -1  # 标记为已删除的意图
        elif log.intent > intent_index:
            log.intent -= 1  # 索引前移
    
    return task
```

---

## 5. 关键技术实现（代码示例）

### 5.1 后端核心代码

#### models.py（数据模型）
```python
from pydantic import BaseModel, Field, validator
from typing import List, Optional
from datetime import datetime
import uuid

class Intent(BaseModel):
    if_: str = Field(..., alias="if", min_length=1, max_length=100)
    then: str = Field(..., min_length=1, max_length=100)
    count: int = Field(default=0, ge=0)
    temp: Optional[bool] = None

    class Config:
        populate_by_name = True

class CheckinLog(BaseModel):
    date: str  # ISO 8601
    intent: int

class Task(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str = Field(..., min_length=1, max_length=50)
    start_at: str
    End_at: str
    target_days: int = Field(default=100, ge=1, le=366)
    max_gap: int = Field(default=5, ge=1, le=30)
    intents: List[Intent] = Field(..., min_items=3)
    logs: List[CheckinLog] = Field(default_factory=list)

    @validator('intents')
    def validate_intents(cls, v):
        if len(v) < 3:
            raise ValueError('至少需要3个执行意图')
        return v

class Database(BaseModel):
    version: int = 1
    tasks: List[Task] = Field(default_factory=list, max_items=4)

class CreateTaskRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    intents: List[Intent] = Field(..., min_items=3)

class CheckinRequest(BaseModel):
    intent_index: int = Field(..., ge=0)
```

#### storage.py（JSON存储）
```python
import json
from pathlib import Path
from typing import Optional
from models import Database, Task

class JSONStorage:
    def __init__(self, file_path: str = "data/tasks.json"):
        self.file_path = Path(file_path)
        self.file_path.parent.mkdir(parents=True, exist_ok=True)
        if not self.file_path.exists():
            self._write(Database())
    
    def _read(self) -> Database:
        with open(self.file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            return Database(**data)
    
    def _write(self, db: Database):
        with open(self.file_path, 'w', encoding='utf-8') as f:
            json.dump(db.dict(), f, ensure_ascii=False, indent=2)
    
    def get_all_tasks(self) -> list[Task]:
        db = self._read()
        return db.tasks
    
    def get_task(self, task_id: str) -> Optional[Task]:
        db = self._read()
        for task in db.tasks:
            if task.id == task_id:
                return task
        return None
    
    def create_task(self, task: Task) -> Task:
        db = self._read()
        if len(db.tasks) >= 4:
            raise ValueError("最多创建4个习惯")
        db.tasks.append(task)
        self._write(db)
        return task
    
    def update_task(self, task_id: str, updated_task: Task) -> Task:
        db = self._read()
        for i, task in enumerate(db.tasks):
            if task.id == task_id:
                db.tasks[i] = updated_task
                self._write(db)
                return updated_task
        raise ValueError(f"Task {task_id} not found")
    
    def delete_task(self, task_id: str):
        db = self._read()
        db.tasks = [t for t in db.tasks if t.id != task_id]
        self._write(db)
```

#### routes/tasks.py（API路由）
```python
from fastapi import APIRouter, HTTPException
from datetime import datetime, timedelta
from models import CreateTaskRequest, Task
from storage import JSONStorage

router = APIRouter(prefix="/api/tasks", tags=["tasks"])
storage = JSONStorage()

@router.post("/", response_model=Task)
def create_task(req: CreateTaskRequest):
    """创建新习惯"""
    if len(storage.get_all_tasks()) >= 4:
        raise HTTPException(400, detail="最多创建4个习惯")
    
    now = datetime.now()
    task = Task(
        name=req.name,
        start_at=now.isoformat(),
        End_at=(now + timedelta(days=365)).isoformat(),
        intents=req.intents,
    )
    return storage.create_task(task)

@router.get("/", response_model=list[Task])
def get_all_tasks():
    """获取所有习惯"""
    return storage.get_all_tasks()

@router.get("/{task_id}", response_model=Task)
def get_task(task_id: str):
    """获取单个习惯"""
    task = storage.get_task(task_id)
    if not task:
        raise HTTPException(404, detail="习惯不存在")
    return task

@router.delete("/{task_id}")
def delete_task(task_id: str):
    """删除习惯"""
    try:
        storage.delete_task(task_id)
        return {"message": "删除成功"}
    except ValueError:
        raise HTTPException(404, detail="习惯不存在")
```

#### routes/checkins.py（打卡路由）
```python
from fastapi import APIRouter, HTTPException
from datetime import datetime
from models import CheckinRequest, CheckinLog
from storage import JSONStorage

router = APIRouter(prefix="/api/tasks", tags=["checkins"])
storage = JSONStorage()

@router.post("/{task_id}/checkin")
def checkin(task_id: str, req: CheckinRequest):
    """打卡"""
    task = storage.get_task(task_id)
    if not task:
        raise HTTPException(404, detail="习惯不存在")
    
    now = datetime.now()
    today = now.date()
    
    # 校验：今天是否已打卡
    for log in task.logs:
        log_date = datetime.fromisoformat(log.date).date()
        if log_date == today:
            raise HTTPException(400, detail="今天已经打卡过了")
    
    # 校验：是否在有效期内
    start_date = datetime.fromisoformat(task.start_at).date()
    end_date = datetime.fromisoformat(task.End_at).date()
    if today < start_date:
        raise HTTPException(400, detail="习惯还未开始")
    if today > end_date:
        raise HTTPException(400, detail="习惯已结束")
    
    # 校验：意图索引
    if req.intent_index < 0 or req.intent_index >= len(task.intents):
        raise HTTPException(400, detail="无效的执行意图")
    
    # 执行打卡
    log = CheckinLog(date=now.isoformat(), intent=req.intent_index)
    task.logs.append(log)
    task.intents[req.intent_index].count += 1
    
    storage.update_task(task_id, task)
    
    return {
        "success": True,
        "checked_days": len(task.logs),
        "remaining_days": task.target_days - len(task.logs),
        "log": log
    }

@router.get("/{task_id}/stats")
def get_stats(task_id: str):
    """获取统计信息"""
    task = storage.get_task(task_id)
    if not task:
        raise HTTPException(404, detail="习惯不存在")
    
    checked_days = len(task.logs)
    remaining_days = task.target_days - checked_days
    
    # 计算当前连续打卡天数
    streak = 0
    if task.logs:
        logs_sorted = sorted(task.logs, key=lambda x: x.date, reverse=True)
        last_date = datetime.fromisoformat(logs_sorted[0].date).date()
        if last_date == datetime.now().date():
            streak = 1
            for i in range(1, len(logs_sorted)):
                current_date = datetime.fromisoformat(logs_sorted[i].date).date()
                if (last_date - current_date).days == 1:
                    streak += 1
                    last_date = current_date
                else:
                    break
    
    return {
        "checked_days": checked_days,
        "remaining_days": remaining_days,
        "progress_percent": round(checked_days / task.target_days * 100, 1),
        "current_streak": streak,
        "intent_usage": [
            {"intent": intent.dict(), "usage_count": intent.count}
            for intent in task.intents
        ]
    }
```

### 5.2 前端核心代码

#### lib/api.ts（API封装）
```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Intent {
  if: string;
  then: string;
  count: number;
  temp?: boolean;
}

export interface Task {
  id: string;
  name: string;
  start_at: string;
  End_at: string;
  target_days: number;
  max_gap: number;
  intents: Intent[];
  logs: CheckinLog[];
}

export interface CheckinLog {
  date: string;
  intent: number;
}

// 获取所有习惯
export async function getTasks(): Promise<Task[]> {
  const res = await fetch(`${API_BASE}/api/tasks`);
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
}

// 创建习惯
export async function createTask(name: string, intents: Intent[]): Promise<Task> {
  const res = await fetch(`${API_BASE}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, intents }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Failed to create task');
  }
  return res.json();
}

// 打卡
export async function checkin(taskId: string, intentIndex: number) {
  const res = await fetch(`${API_BASE}/api/tasks/${taskId}/checkin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ intent_index: intentIndex }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Failed to check in');
  }
  return res.json();
}

// 获取统计
export async function getStats(taskId: string) {
  const res = await fetch(`${API_BASE}/api/tasks/${taskId}/stats`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}
```

#### components/Calendar.tsx（日历组件）
```typescript
'use client';
import { Task } from '@/lib/api';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isAfter, isBefore } from 'date-fns';

interface CalendarProps {
  task: Task;
  onDateClick: (date: Date, status: 'checked' | 'unchecked' | 'future' | 'disabled') => void;
}

export function Calendar({ task, onDateClick }: CalendarProps) {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startDate = new Date(task.start_at);
  const endDate = new Date(task.End_at);

  const getDateStatus = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const hasLog = task.logs.some(log => 
      format(new Date(log.date), 'yyyy-MM-dd') === dateStr
    );

    if (isBefore(date, startDate) || isAfter(date, endDate)) {
      return 'disabled';
    }
    if (isAfter(date, now)) {
      return 'future';
    }
    return hasLog ? 'checked' : 'unchecked';
  };

  return (
    <div className="grid grid-cols-7 gap-2">
      {['日', '一', '二', '三', '四', '五', '六'].map(day => (
        <div key={day} className="text-center font-semibold text-gray-600">
          {day}
        </div>
      ))}
      {days.map(day => {
        const status = getDateStatus(day);
        const bgColor = {
          checked: 'bg-green-500 text-white',
          unchecked: 'bg-gray-300 text-gray-700',
          future: 'bg-gray-100 text-gray-400',
          disabled: 'bg-gray-50 text-gray-300',
        }[status];

        return (
          <button
            key={day.toString()}
            onClick={() => onDateClick(day, status as any)}
            disabled={status === 'future' || status === 'disabled'}
            className={`
              aspect-square rounded-lg flex items-center justify-center
              transition-all hover:scale-105
              ${bgColor}
              ${status === 'future' || status === 'disabled' ? 'cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {format(day, 'd')}
          </button>
        );
      })}
    </div>
  );
}
```

#### components/CheckinModal.tsx（打卡弹窗）
```typescript
'use client';
import { useState } from 'react';
import { Intent } from '@/lib/api';

interface CheckinModalProps {
  intents: Intent[];
  onCheckin: (intentIndex: number) => Promise<void>;
  onClose: () => void;
}

export function CheckinModal({ intents, onCheckin, onClose }: CheckinModalProps) {
  const [selectedIntent, setSelectedIntent] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (selectedIntent === null) {
      alert('请选择一个执行意图');
      return;
    }

    setLoading(true);
    try {
      await onCheckin(selectedIntent);
      onClose();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">今天的打卡</h2>
        <p className="text-gray-600 mb-4">请选择你今天执行的意图：</p>

        <div className="space-y-2 mb-6">
          {intents.filter(i => !i.temp).map((intent, index) => (
            <label
              key={index}
              className={`
                block p-4 border-2 rounded-lg cursor-pointer transition-all
                ${selectedIntent === index ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
              `}
            >
              <input
                type="radio"
                name="intent"
                value={index}
                checked={selectedIntent === index}
                onChange={() => setSelectedIntent(index)}
                className="mr-3"
              />
              <span className="font-medium">如果</span> {intent.if} <br />
              <span className="font-medium">那么</span> {intent.then}
              <span className="text-sm text-gray-500 ml-2">(已用 {intent.count} 次)</span>
            </label>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || selectedIntent === null}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? '打卡中...' : '确认打卡'}
          </button>
        </div>
      </div>
    </div>
  );
}
```

### 5.3 数据库初始化（测试数据）

#### scripts/init_test_data.py
```python
import json
from datetime import datetime, timedelta
import uuid

def generate_test_data():
    """生成测试数据供 AI 使用"""
    
    # 测试用例1：正常使用的运动习惯（已打卡10天）
    task1 = {
        "id": str(uuid.uuid4()),
        "name": "运动",
        "start_at": "2025-10-01T00:00:00",
        "End_at": "2026-10-01T00:00:00",
        "target_days": 100,
        "max_gap": 5,
        "intents": [
            {"if": "早上7:00闹钟响", "then": "立刻下楼快走20分钟", "count": 6},
            {"if": "下雨或雾霾", "then": "在家做15分钟自重训练", "count": 3},
            {"if": "起晚了", "then": "晚上8点补运动30分钟", "count": 1}
        ],
        "logs": []
    }
    
    # 生成10天打卡记录
    for i in range(10):
        date = datetime(2025, 10, 1) + timedelta(days=i)
        intent_idx = 0 if i % 3 != 2 else 1  # 大部分用意图0，偶尔用意图1
        task1["logs"].append({
            "date": date.isoformat(),
            "intent": intent_idx
        })
    
    # 测试用例2：新创建的阅读习惯（无打卡）
    task2 = {
        "id": str(uuid.uuid4()),
        "name": "阅读",
        "start_at": datetime.now().isoformat(),
        "End_at": (datetime.now() + timedelta(days=365)).isoformat(),
        "target_days": 100,
        "max_gap": 5,
        "intents": [
            {"if": "晚饭后坐上沙发", "then": "先读书30分钟再看手机", "count": 0},
            {"if": "通勤>20分钟", "then": "听有声书", "count": 0},
            {"if": "睡前30分钟", "then": "读纸质书助眠", "count": 0}
        ],
        "logs": []
    }
    
    database = {
        "version": 1,
        "tasks": [task1, task2]
    }
    
    with open("data/tasks.json", "w", encoding="utf-8") as f:
        json.dump(database, f, ensure_ascii=False, indent=2)
    
    print("✅ 测试数据生成成功！")
    print(f"- 习惯1（运动）：已打卡 {len(task1['logs'])} 天")
    print(f"- 习惯2（阅读）：刚创建，未打卡")

if __name__ == "__main__":
    generate_test_data()
```

---

## 6. 部署与测试

### 6.1 本地开发
```bash
# 后端
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000

# 前端
cd frontend
npm install
npm run dev
```

### 6.2 测试清单（AI生成测试用例参考）
- [ ] 创建第1个习惯（成功）
- [ ] 创建第5个习惯（失败，提示最多4个）
- [ ] 创建习惯时只填2个意图（失败，提示至少3个）
- [ ] 今天打卡（成功）
- [ ] 今天重复打卡（失败，提示已打卡）
- [ ] 点击未来日期打卡（失败，提示不能打卡）
- [ ] 点击历史未打卡日期（显示未完成，无法补卡）
- [ ] 删除主意图（失败）
- [ ] 删除副意图（成功）
- [ ] 添加第10个副意图（成功）
- [ ] 切换习惯Tab（日历和按钮信息联动更新）

---

## 7. AI 代码生成指引

### 7.1 生成优先级
1. **第一步**：生成后端 API（models.py → storage.py → routes）
2. **第二步**：生成前端组件（api.ts → Calendar → Modals）
3. **第三步**：集成前后端，测试核心流程
4. **第四步**：优化 UI 样式和交互细节

### 7.2 关键检查点
- [ ] 数据模型是否完全匹配 JSON 结构
- [ ] 所有业务规则是否实现校验
- [ ] API 错误处理是否完善
- [ ] 前端状态管理是否正确
- [ ] 日期时区处理是否一致（建议全部用 ISO 8601）

### 7.3 扩展性考虑
- 未来可能支持数据导出（JSON → CSV）
- 未来可能添加提醒功能（WebPush / Email）
- 未来可能支持多人协作（需要用户系统）
- 未来可能集成数据分析（可视化趋势图）

---

**文档版本**: v1.0  
**最后更新**: 2025-10-07  
**维护者**: AI Agent

---

## 附录：常见问题

**Q: 为什么不用数据库而用 JSON 文件？**  
A: 初期版本以单机为主，JSON 简单直观，便于调试。后续可迁移至 SQLite/PostgreSQL。

**Q: 如何处理时区问题？**  
A: 统一使用 ISO 8601 格式存储 UTC 时间，前端根据用户本地时区显示。

**Q: 打卡时间能否自定义？**  
A: 当前版本打卡时间为系统时间。未来可扩展允许用户回溯选择时间（需增加权限校验）。

**Q: 执行意图的 count 字段有什么用？**  
A: 统计每个意图的使用频率，帮助用户了解最常使用的策略，可用于优化习惯设计。

