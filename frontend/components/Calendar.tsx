'use client';
import { Task, DateStatus } from '@/lib/types';
import { getDateStatus } from '@/lib/utils';
import { startOfMonth, endOfMonth, eachDayOfInterval, getDay, format } from 'date-fns';

interface CalendarProps {
  task: Task;
  onDateClick: (date: Date, status: DateStatus) => void;
}

export function Calendar({ task, onDateClick }: CalendarProps) {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // 填充月初空白
  const firstDayOfWeek = getDay(monthStart);
  const blanks = Array(firstDayOfWeek).fill(null);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">{format(now, 'yyyy年MM月')}</h2>
      
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['日', '一', '二', '三', '四', '五', '六'].map(day => (
          <div key={day} className="text-center text-gray-500 font-medium text-sm">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {blanks.map((_, i) => <div key={`blank-${i}`} />)}
        {days.map(day => {
          const status = getDateStatus(day, task);
          const isToday = format(day, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd');
          const styles = {
            checked: 'bg-green-500 text-white hover:bg-green-600',
            unchecked: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
            future: 'bg-gray-100 text-gray-400 cursor-not-allowed',
            disabled: 'bg-gray-50 text-gray-300 cursor-not-allowed',
          };
          
          return (
            <button
              key={day.toString()}
              onClick={() => onDateClick(day, status)}
              disabled={status === 'future' || status === 'disabled'}
              className={`
                aspect-square rounded-lg flex items-center justify-center
                transition-all font-medium text-sm
                ${styles[status]}
                ${isToday ? 'ring-2 ring-blue-500' : ''}
              `}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
      
      <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
        <span>✅ 已打卡</span>
        <span>📍 今天</span>
        <span>⚪ 未打卡</span>
      </div>
    </div>
  );
}

