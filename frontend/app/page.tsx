'use client';
import { useState, useEffect } from 'react';
import { Task, Intent, DateStatus } from '@/lib/types';
import { api } from '@/lib/api';
import { Calendar } from '@/components/Calendar';
import { HabitTabs } from '@/components/HabitTabs';
import { StatsCard } from '@/components/StatsCard';
import { CreateHabitModal } from '@/components/CreateHabitModal';
import { CheckinModal } from '@/components/CheckinModal';
import { DateDetailModal } from '@/components/DateDetailModal';
import { IntentModal } from '@/components/IntentModal';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [checkinModalOpen, setCheckinModalOpen] = useState(false);
  const [intentModalOpen, setIntentModalOpen] = useState(false);
  const [dateDetailModal, setDateDetailModal] = useState<{
    isOpen: boolean;
    date: Date | null;
    status: DateStatus;
  }>({ isOpen: false, date: null, status: 'unchecked' });

  // 加载数据
  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      const data = await api.getTasks();
      setTasks(data);
      if (data.length > 0 && !currentTaskId) {
        setCurrentTaskId(data[0].id);
      }
    } catch (error) {
      alert('加载失败: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const currentTask = tasks.find(t => t.id === currentTaskId);

  // 创建习惯
  async function handleCreateTask(name: string, intents: Intent[]) {
    try {
      const newTask = await api.createTask(name, intents);
      setTasks([...tasks, newTask]);
      setCurrentTaskId(newTask.id);
      setCreateModalOpen(false);
      alert('✅ 创建成功！');
    } catch (error) {
      alert('创建失败: ' + (error as Error).message);
    }
  }

  // 打卡
  async function handleCheckin(intentIndex: number) {
    if (!currentTask) return;
    try {
      const result = await api.checkin(currentTask.id, intentIndex);
      await loadTasks();
      setCheckinModalOpen(false);
      alert(`🎉 打卡成功！已完成 ${result.checked_days} 天，剩余 ${result.remaining_days} 天`);
    } catch (error) {
      alert('打卡失败: ' + (error as Error).message);
    }
  }

  // 更新执行意图
  async function handleUpdateIntents(intents: Intent[]) {
    if (!currentTask) return;
    try {
      await api.updateIntents(currentTask.id, intents);
      await loadTasks();
      setIntentModalOpen(false);
      alert('✅ 更新成功！');
    } catch (error) {
      alert('更新失败: ' + (error as Error).message);
    }
  }

  // 删除习惯
  async function handleDeleteTask(taskId: string) {
    try {
      await api.deleteTask(taskId);
      const newTasks = tasks.filter(t => t.id !== taskId);
      setTasks(newTasks);
      
      // 如果删除的是当前习惯，切换到第一个
      if (taskId === currentTaskId) {
        setCurrentTaskId(newTasks.length > 0 ? newTasks[0].id : null);
      }
      
      alert('✅ 删除成功！');
    } catch (error) {
      alert('删除失败: ' + (error as Error).message);
    }
  }

  // 日期点击
  function handleDateClick(date: Date, status: DateStatus) {
    if (status === 'disabled') return;
    setDateDetailModal({ isOpen: true, date, status });
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">加载中...</div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">📊 100天配额法</h1>
          <p className="text-gray-600 mb-6">还没有创建任何习惯</p>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            创建第一个习惯
          </button>
        </div>
        <CreateHabitModal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSubmit={handleCreateTask}
        />
      </div>
    );
  }

  if (!currentTask) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">📊 100天配额法 - 习惯追踪器</h1>
        </div>
      </header>

      {/* 主内容 */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：日历 */}
          <div className="lg:col-span-2">
            <Calendar task={currentTask} onDateClick={handleDateClick} />
          </div>

          {/* 右侧：信息和操作 */}
          <div className="space-y-4">
            {/* 习惯切换 */}
            <HabitTabs
              tasks={tasks}
              currentTaskId={currentTaskId}
              onChange={setCurrentTaskId}
              onCreateNew={() => setCreateModalOpen(true)}
              onDelete={handleDeleteTask}
            />

            {/* 统计信息 */}
            <StatsCard task={currentTask} />

            {/* 操作按钮 */}
            <div className="bg-white rounded-lg shadow-md p-4 space-y-3">
              <button
                onClick={() => setCheckinModalOpen(true)}
                className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
              >
                ✅ 打卡
              </button>
              <button
                onClick={() => setIntentModalOpen(true)}
                className="w-full px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-medium"
              >
                📋 管理执行意图
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* 弹窗 */}
      <CreateHabitModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateTask}
      />
      
      {currentTask && (
        <>
          <CheckinModal
            isOpen={checkinModalOpen}
            onClose={() => setCheckinModalOpen(false)}
            task={currentTask}
            onCheckin={handleCheckin}
          />
          
          <IntentModal
            isOpen={intentModalOpen}
            onClose={() => setIntentModalOpen(false)}
            task={currentTask}
            onUpdate={handleUpdateIntents}
          />
          
          <DateDetailModal
            isOpen={dateDetailModal.isOpen}
            onClose={() => setDateDetailModal({ isOpen: false, date: null, status: 'unchecked' })}
            date={dateDetailModal.date}
            task={currentTask}
            status={dateDetailModal.status}
          />
        </>
      )}
    </div>
  );
}

