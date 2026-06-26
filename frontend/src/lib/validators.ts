import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export const registerSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  company_name: z.string().optional().or(z.literal('')),
  corporate_name: z.string().optional().or(z.literal('')),
  cnpj: z.string().optional().or(z.literal('')),
});

export const clientSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  company_name: z.string().optional().or(z.literal('')),
  status: z.enum(['active', 'inactive']),
  notes: z.string().optional().or(z.literal('')),
});

export const projectSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional().or(z.literal('')),
  client_id: z.number().nullable().optional(),
  manager_id: z.number().nullable().optional(),
  status_id: z.number().nullable().optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  estimated_hours: z.number().min(0).nullable().optional(),
  planned_start_date: z.string().optional().or(z.literal('')),
  planned_end_date: z.string().optional().or(z.literal('')),
  budget: z.number().min(0).nullable().optional(),
});

export const taskSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional().or(z.literal('')),
  project_id: z.number().min(1, 'Projeto é obrigatório'),
  parent_id: z.number().nullable().optional(),
  status_id: z.number().nullable().optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  estimated_hours: z.number().min(0).nullable().optional(),
  due_date: z.string().optional().or(z.literal('')),
  planned_start_date: z.string().optional().or(z.literal('')),
  planned_end_date: z.string().optional().or(z.literal('')),
  sprint_id: z.number().nullable().optional(),
  assignee_ids: z.array(z.number()).optional(),
});

export const subtaskSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  task_id: z.number(),
  assignee_id: z.number().nullable().optional(),
  status_id: z.number().nullable().optional(),
  is_completed: z.boolean().default(false),
});

export const sprintSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  goal: z.string().optional().or(z.literal('')),
  start_date: z.string().min(1, 'Data de início é obrigatória'),
  end_date: z.string().min(1, 'Data de término é obrigatória'),
});

export const statusSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  color: z.string().min(1, 'Cor é obrigatória'),
  position: z.number().int().min(0),
  is_active: z.boolean(),
  type: z.enum(['project', 'task']),
});

export const userFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres').optional().or(z.literal('')),
  role: z.enum(['admin', 'manager', 'user']),
  is_active: z.boolean(),
  company_id: z.number().optional(),
});

export const timeEntrySchema = z.object({
  task_id: z.number(),
  description: z.string().optional().or(z.literal('')),
});

export const manualTimeEntrySchema = z.object({
  start_time: z.string().min(1, 'Data/hora de início é obrigatória'),
  end_time: z.string().min(1, 'Data/hora de fim é obrigatória'),
  description: z.string().optional().or(z.literal('')),
});

export const commentSchema = z.object({
  content: z.string().min(1, 'Comentário é obrigatório'),
});

export const hoursReportSchema = z.object({
  user_id: z.number().nullable().optional(),
  project_id: z.number().nullable().optional(),
  client_id: z.number().nullable().optional(),
  sprint_id: z.number().nullable().optional(),
  start_date: z.string().optional().or(z.literal('')),
  end_date: z.string().optional().or(z.literal('')),
});

export const tasksReportSchema = z.object({
  project_id: z.number().nullable().optional(),
  client_id: z.number().nullable().optional(),
  responsible_id: z.number().nullable().optional(),
  status_id: z.number().nullable().optional(),
  priority: z.string().optional().or(z.literal('')),
  start_date: z.string().optional().or(z.literal('')),
  end_date: z.string().optional().or(z.literal('')),
  type: z.enum(['open', 'completed', 'late']),
});

export const estimatesReportSchema = z.object({
  project_id: z.number().nullable().optional(),
  client_id: z.number().nullable().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ClientFormData = z.infer<typeof clientSchema>;
export type ProjectFormData = z.infer<typeof projectSchema>;
export type TaskFormData = z.infer<typeof taskSchema>;
export type SubtaskFormData = z.infer<typeof subtaskSchema>;
export type SprintFormData = z.infer<typeof sprintSchema>;
export type StatusFormData = z.infer<typeof statusSchema>;
export type UserFormData = z.infer<typeof userFormSchema>;
export type TimeEntryFormData = z.infer<typeof timeEntrySchema>;
export type ManualTimeEntryFormData = z.infer<typeof manualTimeEntrySchema>;
export type CommentFormData = z.infer<typeof commentSchema>;
