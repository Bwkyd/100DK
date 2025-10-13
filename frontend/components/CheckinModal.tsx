'use client';
import { useState } from 'react';
import { Modal } from './Modal';
import { Task } from '@/lib/types';

interface CheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  onCheckin: (intentIndex: number) => Promise<void>;
}

export function CheckinModal({ isOpen, onClose, task, onCheckin }: CheckinModalProps) {
  const [selectedIntent, setSelectedIntent] = useState<number | null>(null);

  const handleSubmit = async () => {
    if (selectedIntent === null) {
      alert('请选择一个执行意图');
      return;
    }
    await onCheckin(selectedIntent);
    setSelectedIntent(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">今天的打卡</h2>
        <p className="text-gray-600 mb-6">请选择你今天执行的意图：</p>
        
        <div className="space-y-3 mb-6">
          {task.intents.map((intent, idx) => (
            <label
              key={idx}
              className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedIntent === idx 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="intent"
                checked={selectedIntent === idx}
                onChange={() => setSelectedIntent(idx)}
                className="mr-3"
              />
              <span className="font-medium">如果</span>
              <span className="mx-1">{intent.if}</span>
              <br />
              <span className="font-medium">那么</span>
              <span className="mx-1">{intent.then}</span>
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
            disabled={selectedIntent === null}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            确认打卡
          </button>
        </div>
      </div>
    </Modal>
  );
}

