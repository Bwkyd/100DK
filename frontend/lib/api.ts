import { Task, Intent } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = {
  async getTasks(): Promise<Task[]> {
    const res = await fetch(`${API_BASE}/api/tasks`);
    if (!res.ok) throw new Error('Failed to fetch tasks');
    return res.json();
  },

  async createTask(name: string, intents: Intent[]): Promise<Task> {
    const res = await fetch(`${API_BASE}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, intents }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || 'Failed to create task');
    }
    return res.json();
  },

  async checkin(taskId: string, intentIndex: number) {
    const res = await fetch(`${API_BASE}/api/tasks/${taskId}/checkin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ intent_index: intentIndex }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || 'Failed to check in');
    }
    return res.json();
  },

  async updateIntents(taskId: string, intents: Intent[]) {
    const res = await fetch(`${API_BASE}/api/tasks/${taskId}/intents`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ intents }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || 'Failed to update intents');
    }
    return res.json();
  },

  async deleteTask(taskId: string) {
    const res = await fetch(`${API_BASE}/api/tasks/${taskId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete task');
    return res.json();
  }
};

