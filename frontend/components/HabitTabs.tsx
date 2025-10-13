'use client';
import { Task } from '@/lib/types';

interface HabitTabsProps {
  tasks: Task[];
  currentTaskId: string | null;
  onChange: (taskId: string) => void;
  onCreateNew: () => void;
  onDelete: (taskId: string) => void;
}

export function HabitTabs({ tasks, currentTaskId, onChange, onCreateNew, onDelete }: HabitTabsProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex flex-col gap-2">
        {tasks.map(task => (
          <div
            key={task.id}
            className={`
              relative rounded-lg transition-all
              ${task.id === currentTaskId 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
            `}
          >
            <button
              onClick={() => onChange(task.id)}
              className="w-full px-4 py-3 text-left"
            >
              <div className="font-medium">{task.name}</div>
              <div className="text-sm opacity-80">
                {task.logs.length}/{task.target_days} 天
              </div>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`确定要删除习惯「${task.name}」吗？`)) {
                  onDelete(task.id);
                }
              }}
              className={`
                absolute right-2 top-2 p-1 rounded hover:bg-red-500 hover:text-white
                ${task.id === currentTaskId ? 'text-white' : 'text-gray-400'}
              `}
            >
              🗑️
            </button>
          </div>
        ))}
        
        {tasks.length < 4 && (
          <button
            onClick={onCreateNew}
            className="px-4 py-3 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 hover:border-blue-500 hover:text-blue-500"
          >
            + 创建新习惯
          </button>
        )}
      </div>
    </div>
  );
}

