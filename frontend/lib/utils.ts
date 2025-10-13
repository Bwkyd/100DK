import { Task, DateStatus } from './types';
import { format, isSameDay, isAfter, isBefore, startOfDay } from 'date-fns';

export function getDateStatus(date: Date, task: Task): DateStatus {
  const today = startOfDay(new Date());
  const dateDay = startOfDay(date);
  const startDate = startOfDay(new Date(task.start_at));
  const endDate = startOfDay(new Date(task.End_at));

  if (isBefore(dateDay, startDate) || isAfter(dateDay, endDate)) {
    return 'disabled';
  }
  if (isAfter(dateDay, today)) {
    return 'future';
  }

  const hasLog = task.logs.some(log => 
    isSameDay(new Date(log.date), dateDay)
  );

  return hasLog ? 'checked' : 'unchecked';
}

export function formatDate(date: Date | string): string {
  return format(new Date(date), 'yyyy年MM月dd日');
}

export function formatTime(date: Date | string): string {
  return format(new Date(date), 'HH:mm');
}

