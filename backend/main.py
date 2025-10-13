#!/usr/bin/env python3
"""100天配额法 - FastAPI 后端"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import sys
from pathlib import Path

# 添加父目录到路径以导入 cli_main
sys.path.insert(0, str(Path(__file__).parent.parent))
from cli_main import HabitTracker, Storage

# FastAPI 应用
app = FastAPI(title="100天配额法 API", version="1.0.0")

# CORS 配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 初始化 Tracker
tracker = HabitTracker()

# ==================== 数据模型 ====================
class IntentModel(BaseModel):
    if_field: str = Field(..., alias='if')
    then: str
    count: int = 0
    
    model_config = {'populate_by_name': True}

class CreateTaskRequest(BaseModel):
    name: str
    intents: List[IntentModel]

class CheckinRequest(BaseModel):
    intent_index: int

class UpdateIntentsRequest(BaseModel):
    intents: List[dict]

# ==================== API 路由 ====================
@app.get("/")
def root():
    return {"message": "100天配额法 API", "version": "1.0.0"}

@app.get("/api/tasks")
def get_tasks():
    """获取所有习惯"""
    return tracker.get_tasks()

@app.post("/api/tasks")
def create_task(req: CreateTaskRequest):
    """创建新习惯"""
    try:
        intents = [{"if": i.if_field, "then": i.then} for i in req.intents]
        task = tracker.create_habit(req.name, intents)
        return task
    except ValueError as e:
        raise HTTPException(400, detail=str(e))

@app.get("/api/tasks/{task_id}")
def get_task(task_id: str):
    """获取单个习惯"""
    task = tracker.get_task(task_id)
    if not task:
        raise HTTPException(404, detail="习惯不存在")
    return task

@app.delete("/api/tasks/{task_id}")
def delete_task(task_id: str):
    """删除习惯"""
    data = tracker.storage.load()
    data['tasks'] = [t for t in data['tasks'] if t['id'] != task_id]
    tracker.storage.save(data)
    return {"message": "删除成功"}

@app.post("/api/tasks/{task_id}/checkin")
def checkin(task_id: str, req: CheckinRequest):
    """打卡"""
    try:
        result = tracker.checkin(task_id, req.intent_index)
        return result
    except ValueError as e:
        raise HTTPException(400, detail=str(e))

@app.get("/api/tasks/{task_id}/stats")
def get_stats(task_id: str):
    """获取统计信息"""
    try:
        return tracker.get_stats(task_id)
    except ValueError as e:
        raise HTTPException(404, detail=str(e))

@app.put("/api/tasks/{task_id}/intents")
def update_intents(task_id: str, req: UpdateIntentsRequest):
    """更新执行意图"""
    data = tracker.storage.load()
    task = next((t for t in data['tasks'] if t['id'] == task_id), None)
    if not task:
        raise HTTPException(404, detail="习惯不存在")
    
    if len(req.intents) < 3:
        raise HTTPException(400, detail="至少需要3个执行意图")
    
    task['intents'] = req.intents
    tracker.storage.save(data)
    return task

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

