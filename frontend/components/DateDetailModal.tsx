'use client';
import { Modal } from './Modal';
import { Task, DateStatus } from '@/lib/types';
import { formatDate, formatTime } from '@/lib/utils';
import { format } from 'date-fns';

interface DateDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date | null;
  task: Task;
  status: DateStatus;
}

export function DateDetailModal({ isOpen, onClose, date, task, status }: DateDetailModalProps) {
  if (!date) return null;

  const dateStr = format(date, 'yyyy-MM-dd');
  const log = task.logs.find(l => format(new Date(l.date), 'yyyy-MM-dd') === dateStr);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 max-w-md w-full">
        {status === 'checked' && log ? (
          <>
            <div className="text-center mb-4">
              <div className="text-6xl mb-2">✅</div>
              <h2 className="text-2xl font-bold">已完成</h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <div><span className="font-medium">日期：</span>{formatDate(date)}</div>
              <div><span className="font-medium">打卡时间：</span>{formatTime(log.date)}</div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="font-medium mb-1">执行意图：</div>
                <div>
                  如果「{task.intents[log.intent]?.if}」<br />
                  那么「{task.intents[log.intent]?.then}」
                </div>
              </div>
            </div>
          </>
        ) : status === 'unchecked' ? (
          <>
            <div className="text-center mb-4">
              <div className="text-6xl mb-2">❌</div>
              <h2 className="text-2xl font-bold">未完成</h2>
            </div>
            <div className="text-center text-gray-700 mb-4">
              <p className="mb-2">{formatDate(date)} 这天没有打卡</p>
              <p className="text-sm text-gray-500">
                还剩 <span className="font-bold text-blue-600">{task.target_days - task.logs.length}</span> 天配额
              </p>
            </div>
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-gray-700">
              💡 提示：历史日期无法补打卡，请继续加油！
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-4">
              <div className="text-6xl mb-2">🔒</div>
              <h2 className="text-2xl font-bold">还没到这一天</h2>
            </div>
            <div className="text-center text-gray-700 mb-4">
              <p>{formatDate(date)}</p>
              <p className="text-sm text-gray-500 mt-2">请在当天完成打卡</p>
            </div>
          </>
        )}
        
        <button
          onClick={onClose}
          className="w-full mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          关闭
        </button>
      </div>
    </Modal>
  );
}

