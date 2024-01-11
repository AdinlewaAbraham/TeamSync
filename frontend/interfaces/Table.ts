export type TableColumnsTypes =
  | "task_name"
  | "assignee"
  | "due_date"
  | "priority"
  | "status";

export interface TableColumn {
  id: string;
  title: string;
  default: boolean;
  type: TableColumnsTypes;
  width: number;
}
