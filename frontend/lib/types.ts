export interface Intent {
  if: string;
  then: string;
  count: number;
}

export interface CheckinLog {
  date: string;
  intent: number;
}

export interface Task {
  id: string;
  name: string;
  start_at: string;
  End_at: string;
  target_days: number;
  max_gap: number;
  intents: Intent[];
  logs: CheckinLog[];
}

export type DateStatus = 'checked' | 'unchecked' | 'future' | 'disabled';

