export type Category = 'work' | 'personal' | 'project';
export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: Category;
  priority: Priority;
  status: TaskStatus;
  dueDate?: string;
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  category: Category;
  description?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: 'great' | 'good' | 'neutral' | 'bad' | 'terrible';
  createdAt: string;
}

export interface Idea {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  isArchived: boolean;
}

export interface Plan {
  id: string;
  title: string;
  description: string;
  category: Category;
  milestones: Milestone[];
  startDate: string;
  endDate?: string;
  createdAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  isCompleted: boolean;
}

export type Page = 'dashboard' | 'tasks' | 'calendar' | 'journal' | 'ideas' | 'plans';
