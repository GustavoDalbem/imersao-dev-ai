/**
 * Serviço de armazenamento local (localStorage) para os objetivos de estudo do StudyFlow.
 */

import { GoalFormData, StudyGoal } from '../types/goal';

const STORAGE_KEY = 'studyflow_goals_v1';

// Dados de exemplo amigáveis para estudantes iniciantes
export const SAMPLE_GOALS: StudyGoal[] = [
  {
    id: 'sample-1',
    title: 'Dominar a Lógica Básica de Programação',
    description: 'Compreender variáveis, condicionais (if/else), laços de repetição (for/while) e resolver 10 exercícios práticos.',
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'em_andamento',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-2',
    title: 'Revisar Técnicas de Redação Dissertativa',
    description: 'Estudar conectivos de coesão, estrutura de introdução e produzir 1 redação completa sobre temas contemporâneos.',
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'nao_iniciado',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-3',
    title: 'Montar meu Cronograma Semanal de Estudos',
    description: 'Definir 1 hora por dia para focar nas matérias prioritárias e organizar o ambiente de estudos livre de distrações.',
    deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'concluido',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const storageService = {
  /**
   * Obtém todos os objetivos salvos no localStorage.
   */
  getGoals(): StudyGoal[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        // Inicializa com os exemplos para novos usuários terem uma referência acolhedora
        this.saveGoals(SAMPLE_GOALS);
        return SAMPLE_GOALS;
      }
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [];
    } catch (error) {
      console.error('Erro ao ler objetivos do localStorage:', error);
      return [];
    }
  },

  /**
   * Salva a lista de objetivos no localStorage.
   */
  saveGoals(goals: StudyGoal[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
    } catch (error) {
      console.error('Erro ao salvar objetivos no localStorage:', error);
    }
  },

  /**
   * Cadastra um novo objetivo de estudo.
   */
  addGoal(data: GoalFormData): StudyGoal {
    const goals = this.getGoals();
    const newGoal: StudyGoal = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `goal_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      title: data.title.trim(),
      description: data.description.trim(),
      deadline: data.deadline,
      status: data.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newGoal, ...goals];
    this.saveGoals(updated);
    return newGoal;
  },

  /**
   * Atualiza um objetivo existente pelo ID.
   */
  updateGoal(id: string, updates: Partial<GoalFormData>): StudyGoal | null {
    const goals = this.getGoals();
    const index = goals.findIndex((g) => g.id === id);
    if (index === -1) return null;

    const current = goals[index];
    const updatedGoal: StudyGoal = {
      ...current,
      ...(updates.title !== undefined ? { title: updates.title.trim() } : {}),
      ...(updates.description !== undefined ? { description: updates.description.trim() } : {}),
      ...(updates.deadline !== undefined ? { deadline: updates.deadline } : {}),
      ...(updates.status !== undefined ? { status: updates.status } : {}),
      updatedAt: new Date().toISOString(),
    };

    goals[index] = updatedGoal;
    this.saveGoals(goals);
    return updatedGoal;
  },

  /**
   * Exclui um objetivo pelo ID.
   */
  deleteGoal(id: string): boolean {
    const goals = this.getGoals();
    const filtered = goals.filter((g) => g.id !== id);
    if (filtered.length === goals.length) {
      return false;
    }
    this.saveGoals(filtered);
    return true;
  },

  /**
   * Limpa todos os dados salvos.
   */
  clearAllGoals(): void {
    this.saveGoals([]);
  },

  /**
   * Restaura os dados de exemplo recomendados.
   */
  resetToSampleGoals(): StudyGoal[] {
    this.saveGoals(SAMPLE_GOALS);
    return SAMPLE_GOALS;
  },
};
