export interface Task {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
  showSubTaskInput?: boolean;
  subTask?: string;
}
