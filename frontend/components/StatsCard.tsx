'use client';
import { Task } from '@/lib/types';

export function StatsCard({ task }: { task: Task }) {
  const progress = (task.logs.length / task.target_days) * 100;
  const remaining = task.target_days - task.logs.length;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold mb-4">{task.name}</h3>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span>进度</span>
          <span className="font-medium">{progress.toFixed(1)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {task.logs.length}
          </div>
          <div className="text-sm text-gray-600">已完成</div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {remaining}
          </div>
          <div className="text-sm text-gray-600">剩余</div>
        </div>
      </div>
    </div>
  );
}

