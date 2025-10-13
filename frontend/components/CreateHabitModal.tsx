'use client';
import { useState } from 'react';
import { Modal } from './Modal';
import { Intent } from '@/lib/types';

interface CreateHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, intents: Intent[]) => Promise<void>;
}

export function CreateHabitModal({ isOpen, onClose, onSubmit }: CreateHabitModalProps) {
  const [name, setName] = useState('');
  const [intents, setIntents] = useState<Omit<Intent, 'count'>[]>([
    { if: '', then: '' },
    { if: '', then: '' },
    { if: '', then: '' }
  ]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert('请输入习惯名称');
      return;
    }
    if (intents.some(i => !i.if.trim() || !i.then.trim())) {
      alert('请填写完整的执行意图');
      return;
    }

    await onSubmit(name, intents.map(i => ({ ...i, count: 0 })));
    setName('');
    setIntents([{ if: '', then: '' }, { if: '', then: '' }, { if: '', then: '' }]);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-6">创建新习惯</h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            习惯名称 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例如：运动、阅读、控糖"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            执行意图 <span className="text-red-500">*至少3个</span>
          </label>
          
          {intents.map((intent, idx) => (
            <div key={idx} className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="font-medium">意图 {idx + 1}</span>
                {idx >= 3 && (
                  <button
                    onClick={() => setIntents(intents.filter((_, i) => i !== idx))}
                    className="text-red-500 text-sm"
                  >
                    删除
                  </button>
                )}
              </div>
              <input
                type="text"
                value={intent.if}
                onChange={(e) => {
                  const newIntents = [...intents];
                  newIntents[idx].if = e.target.value;
                  setIntents(newIntents);
                }}
                placeholder="如果：早上7:00闹钟响"
                className="w-full px-3 py-2 border border-gray-300 rounded mb-2"
              />
              <input
                type="text"
                value={intent.then}
                onChange={(e) => {
                  const newIntents = [...intents];
                  newIntents[idx].then = e.target.value;
                  setIntents(newIntents);
                }}
                placeholder="那么：立刻下楼快走20分钟"
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
          ))}
          
          <button
            onClick={() => setIntents([...intents, { if: '', then: '' }])}
            className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500"
          >
            + 添加更多意图
          </button>
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
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            创建习惯
          </button>
        </div>
      </div>
    </Modal>
  );
}

