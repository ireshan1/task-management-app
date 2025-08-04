export type TaskStatus = "To Do" | "In Progress" | "Completed";
export type TaskPriority = "Low" | "Medium" | "High";
export type BoardView = "list" | "kanban" |"task-detail";

export type User = {
  name: string;
  email: string;
  token: string;
};

export type Task = {
  id?:any,
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignee:string;
  user_id:string;
};

