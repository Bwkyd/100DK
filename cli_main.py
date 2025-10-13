#!/usr/bin/env python3
"""100天配额法 CLI 工具 - 极简版"""
import json
import uuid
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional

# ==================== 数据存储 ====================
class Storage:
    def __init__(self, path="100DK/data/habits.json"):
        self.path = Path(path)
        self.path.parent.mkdir(exist_ok=True)
        if not self.path.exists():
            self.save({"version": 1, "tasks": []})
    
    def load(self): 
        return json.loads(self.path.read_text(encoding='utf-8'))
    
    def save(self, data): 
        self.path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')

# ==================== 核心业务逻辑 ====================
class HabitTracker:
    def __init__(self):
        self.storage = Storage()
    
    def create_habit(self, name: str, intents: list[dict]) -> dict:
        """创建习惯"""
        data = self.storage.load()
        if len(data['tasks']) >= 4:
            raise ValueError("❌ 最多创建4个习惯")
        if len(intents) < 3:
            raise ValueError("❌ 至少需要3个执行意图")
        
        now = datetime.now()
        task = {
            "id": str(uuid.uuid4()),
            "name": name,
            "start_at": now.isoformat(),
            "End_at": (now + timedelta(days=365)).isoformat(),
            "target_days": 100,
            "max_gap": 5,
            "intents": [{"if": i["if"], "then": i["then"], "count": 0} for i in intents],
            "logs": []
        }
        data['tasks'].append(task)
        self.storage.save(data)
        return task
    
    def checkin(self, task_id: str, intent_idx: int) -> dict:
        """打卡"""
        data = self.storage.load()
        task = next((t for t in data['tasks'] if t['id'] == task_id), None)
        if not task:
            raise ValueError("❌ 习惯不存在")
        
        today = datetime.now().date()
        # 检查今天是否已打卡
        if any(datetime.fromisoformat(log['date']).date() == today for log in task['logs']):
            raise ValueError("❌ 今天已经打卡过了")
        
        # 检查意图索引
        if intent_idx < 0 or intent_idx >= len(task['intents']):
            raise ValueError("❌ 无效的执行意图")
        
        # 执行打卡
        log = {"date": datetime.now().isoformat(), "intent": intent_idx}
        task['logs'].append(log)
        task['intents'][intent_idx]['count'] += 1
        self.storage.save(data)
        
        return {
            "checked_days": len(task['logs']),
            "remaining_days": task['target_days'] - len(task['logs'])
        }
    
    def get_tasks(self) -> list[dict]:
        """获取所有习惯"""
        return self.storage.load()['tasks']
    
    def get_task(self, task_id: str) -> Optional[dict]:
        """获取单个习惯"""
        tasks = self.get_tasks()
        return next((t for t in tasks if t['id'] == task_id), None)
    
    def get_stats(self, task_id: str) -> dict:
        """获取统计"""
        task = self.get_task(task_id)
        if not task:
            raise ValueError("❌ 习惯不存在")
        
        checked = len(task['logs'])
        remaining = task['target_days'] - checked
        progress = round(checked / task['target_days'] * 100, 1)
        
        return {
            "name": task['name'],
            "checked_days": checked,
            "remaining_days": remaining,
            "progress": f"{progress}%",
            "intents": task['intents']
        }

# ==================== CLI 界面 ====================
class CLI:
    def __init__(self):
        self.tracker = HabitTracker()
    
    def run(self):
        """主循环"""
        while True:
            print("\n" + "="*50)
            print("📊 100天配额法 - 习惯追踪器")
            print("="*50)
            print("1. 📝 创建习惯")
            print("2. ✅ 打卡")
            print("3. 📋 查看习惯")
            print("4. 📈 查看执行意图")
            print("5. 📅 查看日历")
            print("0. 🚪 退出")
            print("="*50)
            
            choice = input("请选择操作: ").strip()
            
            try:
                if choice == '1':
                    self.create_habit()
                elif choice == '2':
                    self.checkin()
                elif choice == '3':
                    self.list_habits()
                elif choice == '4':
                    self.show_stats()
                elif choice == '5':
                    self.show_calendar()
                elif choice == '0':
                    print("👋 再见！")
                    break
                else:
                    print("❌ 无效选择")
            except Exception as e:
                print(f"❌ 错误: {e}")
    
    def create_habit(self):
        """创建习惯"""
        print("\n📝 创建新习惯")
        name = input("习惯名称: ").strip()
        if not name:
            print("❌ 名称不能为空")
            return
        
        intents = []
        print("\n请输入至少3个执行意图（IF-THEN）")
        for i in range(3):
            print(f"\n意图 {i+1}:")
            if_part = input("  如果: ").strip()
            then_part = input("  那么: ").strip()
            if if_part and then_part:
                intents.append({"if": if_part, "then": then_part})
        
        # 可选：添加更多意图
        while input("\n是否添加更多意图？(y/n): ").lower() == 'y':
            if_part = input("  如果: ").strip()
            then_part = input("  那么: ").strip()
            if if_part and then_part:
                intents.append({"if": if_part, "then": then_part})
        
        task = self.tracker.create_habit(name, intents)
        print(f"\n✅ 成功创建习惯「{task['name']}」")
        print(f"   ID: {task['id'][:8]}...")
        print(f"   目标: {task['target_days']} 天")
    
    def checkin(self):
        """打卡"""
        tasks = self.tracker.get_tasks()
        if not tasks:
            print("❌ 还没有创建习惯，请先创建")
            return
        
        print("\n✅ 选择要打卡的习惯:")
        for i, task in enumerate(tasks, 1):
            print(f"{i}. {task['name']} (已打卡 {len(task['logs'])} 天)")
        
        try:
            task_idx = int(input("\n选择习惯编号: ")) - 1
            task = tasks[task_idx]
        except (ValueError, IndexError):
            print("❌ 无效选择")
            return
        
        print(f"\n选择执行的意图:")
        for i, intent in enumerate(task['intents']):
            print(f"{i+1}. 如果「{intent['if']}」那么「{intent['then']}」 (已用 {intent['count']} 次)")
        
        try:
            intent_idx = int(input("\n选择意图编号: ")) - 1
            result = self.tracker.checkin(task['id'], intent_idx)
            print(f"\n🎉 打卡成功!")
            print(f"   已完成: {result['checked_days']} 天")
            print(f"   剩余: {result['remaining_days']} 天")
        except (ValueError, IndexError) as e:
            print(f"❌ {e}")
    
    def list_habits(self):
        """查看所有习惯"""
        tasks = self.tracker.get_tasks()
        if not tasks:
            print("\n📋 还没有创建任何习惯")
            return
        
        print(f"\n📋 共有 {len(tasks)} 个习惯:")
        for i, task in enumerate(tasks, 1):
            checked = len(task['logs'])
            remaining = task['target_days'] - checked
            progress = round(checked / task['target_days'] * 100, 1)
            
            print(f"\n{i}. 【{task['name']}】")
            print(f"   进度: {checked}/{task['target_days']} 天 ({progress}%)")
            print(f"   剩余: {remaining} 天")
            print(f"   ID: {task['id'][:8]}...")
    
    def show_stats(self):
        """查看统计"""
        tasks = self.tracker.get_tasks()
        if not tasks:
            print("❌ 还没有创建习惯")
            return
        
        print("\n📈 选择习惯:")
        for i, task in enumerate(tasks, 1):
            print(f"{i}. {task['name']}")
        
        try:
            task_idx = int(input("\n选择编号: ")) - 1
            task = tasks[task_idx]
            stats = self.tracker.get_stats(task['id'])
            
            print(f"\n📊 【{stats['name']}】统计信息")
            print(f"   已完成: {stats['checked_days']} 天")
            print(f"   剩余: {stats['remaining_days']} 天")
            print(f"   进度: {stats['progress']}")
            print(f"\n   执行意图使用情况:")
            for i, intent in enumerate(stats['intents'], 1):
                print(f"   {i}. 「{intent['if']}」→「{intent['then']}」")
                print(f"      使用次数: {intent['count']}")
        except (ValueError, IndexError):
            print("❌ 无效选择")
    
    def show_calendar(self):
        """显示日历"""
        tasks = self.tracker.get_tasks()
        if not tasks:
            print("❌ 还没有创建习惯")
            return
        
        print("\n📅 选择习惯:")
        for i, task in enumerate(tasks, 1):
            print(f"{i}. {task['name']}")
        
        try:
            task_idx = int(input("\n选择编号: ")) - 1
            task = tasks[task_idx]
            
            print(f"\n📅 【{task['name']}】本月打卡记录")
            
            # 获取本月所有日期
            now = datetime.now()
            year, month = now.year, now.month
            
            # 生成日历
            import calendar
            cal = calendar.monthcalendar(year, month)
            
            # 获取打卡日期
            checked_dates = set()
            for log in task['logs']:
                log_date = datetime.fromisoformat(log['date']).date()
                if log_date.year == year and log_date.month == month:
                    checked_dates.add(log_date.day)
            
            # 打印日历
            print(f"\n   {year}年{month}月")
            print("   一  二  三  四  五  六  日")
            for week in cal:
                print("  ", end="")
                for day in week:
                    if day == 0:
                        print("    ", end="")
                    elif day in checked_dates:
                        print(f" ✅{day:2d}", end="")
                    elif day == now.day:
                        print(f" 📍{day:2d}", end="")
                    else:
                        print(f"  {day:2d} ", end="")
                print()
            
            print(f"\n   ✅ = 已打卡  📍 = 今天")
        except (ValueError, IndexError):
            print("❌ 无效选择")

# ==================== 入口 ====================
if __name__ == "__main__":
    cli = CLI()
    cli.run()

