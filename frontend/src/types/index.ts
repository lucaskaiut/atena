export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: number;
  name: string;
  slug: string;
  is_active: boolean;
}

export interface Client {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  company_name?: string;
  status: 'active' | 'inactive';
  notes?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface ProjectStatus {
  id: number;
  name: string;
  color: string;
  position: number;
  is_active: boolean;
  type: 'project' | 'task';
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  client_id?: number;
  client?: Client;
  manager_id?: number;
  manager?: User;
  status_id?: number;
  status?: ProjectStatus;
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimated_hours?: number;
  planned_start_date?: string;
  planned_end_date?: string;
  actual_start_date?: string;
  actual_end_date?: string;
  budget?: number;
  is_active: boolean;
  cancelled_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  sprint_id?: number;
  completed_tasks_count?: number;
  total_tasks_count?: number;
  worked_hours?: number;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  project_id: number;
  project?: Project;
  parent_id?: number;
  parent?: Task;
  assignee_id?: number;
  assignee?: User;
  status_id?: number;
  status?: ProjectStatus;
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimated_hours?: number;
  worked_hours?: number;
  due_date?: string;
  planned_start_date?: string;
  planned_end_date?: string;
  actual_start_date?: string;
  actual_end_date?: string;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  sprint_id?: number;
  sprint?: Sprint;
  subtasks?: Task[];
  subtasks_count?: number;
  completed_subtasks_count?: number;
  time_entries?: TimeEntry[];
  assignees?: User[];
}

export interface Subtask {
  id: number;
  title: string;
  task_id: number;
  assignee_id?: number;
  assignee?: User;
  status_id?: number;
  status?: ProjectStatus;
  is_completed: boolean;
  order: number;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: number;
  task_id: number;
  user_id: number;
  user?: User;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface TimeEntry {
  id: number;
  task_id: number;
  task?: Task;
  user_id: number;
  user?: User;
  description?: string;
  start_time: string;
  end_time?: string;
  duration_minutes?: number;
  is_running: boolean;
  created_at: string;
  updated_at: string;
}

export interface Sprint {
  id: number;
  name: string;
  goal?: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  tasks_count?: number;
  completed_tasks_count?: number;
  project_id?: number;
  project?: Project;
}

export interface Notification {
  id: number;
  user_id: number;
  type: string;
  data?: Record<string, unknown>;
  read_at?: string;
  created_at: string;
  message?: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  position?: string;
  status?: string;
  company_id?: number;
  company?: Company;
  created_at?: string;
  updated_at?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  company_name?: string;
  corporate_name?: string;
  cnpj?: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface DashboardStats {
  total_projects: number;
  total_tasks: number;
  hours_worked: number;
  hours_estimated: number;
  active_sprints: number;
}

export interface ProductivityData {
  user: string;
  hours: number;
}

export interface TasksByStatusData {
  status: string;
  count: number;
  color: string;
}

export interface TaskFilterParams {
  search?: string;
  project_id?: number;
  client_id?: number;
  responsible_id?: number;
  priority?: string;
  status_id?: number;
  sprint_id?: number;
  due_date_from?: string;
  due_date_to?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface KanbanColumn {
  status_id: number;
  status: ProjectStatus;
  tasks: Task[];
}
