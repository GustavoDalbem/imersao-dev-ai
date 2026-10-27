/**
 * Definições de tipos para o StudyFlow
 */

export type GoalStatus = 'nao_iniciado' | 'em_andamento' | 'concluido';

export interface StudyGoal {
  id: string;
  title: string;
  description: string;
  deadline: string; // formato YYYY-MM-DD
  status: GoalStatus;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export type GoalFormData = {
  title: string;
  description: string;
  deadline: string;
  status: GoalStatus;
};

export type GoalFilter = 'todos' | GoalStatus;

export type GoalSortOption = 'deadline-asc' | 'deadline-desc' | 'created-desc' | 'title-asc';
