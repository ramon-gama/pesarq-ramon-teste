export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  due_date: string;
  priority: "high" | "medium" | "low";
  labels: string[];
  column_id: string;
  organization_id: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  created_by_name?: string;
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

export interface CreateTaskData {
  title: string;
  description: string;
  assignee: string;
  due_date: string;
  priority: "high" | "medium" | "low";
  labels: string[];
  column_id: string;
  organization_id: string;
  created_by?: string;
}

export interface UpdateTaskData extends Partial<Task> {}
