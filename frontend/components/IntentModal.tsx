'use client';
import { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Task, Intent } from '@/lib/types';

interface IntentModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  onUpdate: (intents: Intent[]) => Promise<void>;
}

export function IntentModal({ isOpen, onClose, task, onUpdate }: IntentModalProps) {
  const [intents, setIntents] = useState<Intent[]>(task.intents);

  // 当 task 变化时更新 intents
  useEffect(() => {
    setIntents(task.intents);
  }, [task]);

  const handleSubmit = async () => {
    if (intents.length < 3) {
      alert('至少需要保留3个执行意图');
      return;
    }
    if (intents.some(i => !i.if.trim() || !i.then.trim())) {
      alert('请填写完整的执行意图');
      return;
    }
    await onUpdate(intents);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-6">管理执行意图</h2>
        
        <div className="space-y-4 mb-6">
          {intents.map((intent, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg ${
                idx === 0 ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">
                  {idx === 0 ? '主意图' : `副意图 ${idx}`}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    使用 {intent.count} 次
                  </span>
                  {idx > 0 && intents.length > 3 && (
                    <button
                      onClick={() => setIntents(intents.filter((_, i) => i !== idx))}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      删除
                    </button>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <input
                  type="text"
                  value={intent.if}
                  onChange={(e) => {
                    const newIntents = [...intents];
                    newIntents[idx].if = e.target.value;
                    setIntents(newIntents);
                  }}
                  placeholder="如果..."
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  value={intent.then}
                  onChange={(e) => {
                    const newIntents = [...intents];
                    newIntents[idx].then = e.target.value;
                    setIntents(newIntents);
                  }}
                  placeholder="那么..."
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              
              {idx === 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  💡 主意图只能修改，不能删除
                </p>
              )}
            </div>
          ))}
          
          {/* 添加副意图 */}
          <button
            onClick={() => setIntents([...intents, { if: '', then: '', count: 0 }])}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500"
          >
            + 添加副意图
          </button>
        </div>
        
        {/* 操作按钮 */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            保存更改
          </button>
        </div>
      </div>
    </Modal>
  );
}

