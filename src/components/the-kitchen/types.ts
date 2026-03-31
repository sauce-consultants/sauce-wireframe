export type DishStatus = "backlog" | "todo" | "in_progress" | "review" | "done";
export type Priority = "high" | "med" | "low";

export const DISH_STATUSES: { key: DishStatus; title: string }[] = [
  { key: "backlog", title: "Backlog" },
  { key: "todo", title: "To Do" },
  { key: "in_progress", title: "In Progress" },
  { key: "review", title: "Review" },
  { key: "done", title: "Done" },
];

export const PRIORITIES: { value: Priority; label: string }[] = [
  { value: "high", label: "High" },
  { value: "med", label: "Med" },
  { value: "low", label: "Low" },
];

export const AGENT_SUGGESTIONS = [
  "ux-designer",
  "backend-dev",
  "frontend-dev",
  "qa-tester",
  "devops",
  "data-engineer",
  "tech-lead",
];

export interface Dish {
  id: number;
  title: string;
  body: string;
  status: DishStatus;
  customerId: number;
  customerName: string;
  customerSubtitle: string | null;
  customerShortCode: string | null;
  dishNumber: number;
  ref: string;
  assignee: string | null;
  agent: string | null;
  priority: Priority;
  size: string | null;
  labels: string[];
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface KitchenBoard {
  backlog: Dish[];
  todo: Dish[];
  in_progress: Dish[];
  review: Dish[];
  done: Dish[];
}

export interface ProjectOption {
  id: number;
  name: string;
  subtitle: string | null;
  shortCode: string | null;
}

export type AuthorType = "human" | "agent";

export interface DishComment {
  id: number;
  dishId: number;
  content: string;
  authorName: string;
  authorType: AuthorType;
  createdAt: string;
}

export interface DishHistoryEntry {
  id: number;
  dishId: number;
  field: string;
  oldValue: string | null;
  newValue: string | null;
  changedBy: string;
  changedByType: AuthorType;
  createdAt: string;
}
