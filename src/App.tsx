/**
 * StudyFlow - Aplicação de Organização de Objetivos de Estudo para Iniciantes
 * @license Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Header } from './components/Header';
import { StatsOverview } from './components/StatsOverview';
import { GoalFilterBar } from './components/GoalFilterBar';
import { GoalCard } from './components/GoalCard';
import { GoalFormModal } from './components/GoalFormModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { EmptyState } from './components/EmptyState';
import { FooterTips } from './components/FooterTips';
import { storageService } from './services/storageService';
import { GoalFilter, GoalFormData, GoalSortOption, GoalStatus, StudyGoal } from './types/goal';
import { CheckCircle2, Info, Plus } from 'lucide-react';

export default function App() {
  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Estados dos Modais
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<StudyGoal | null>(null);
  const [goalToDelete, setGoalToDelete] = useState<StudyGoal | null>(null);

  // Estados de Filtro, Busca e Ordenação
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<GoalFilter>('todos');
  const [sortOption, setSortOption] = useState<GoalSortOption>('deadline-asc');

  // Notificação toast temporária
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 3200);
  };

  // Carregar dados salvos no localStorage no primeiro carregamento
  useEffect(() => {
    const saved = storageService.getGoals();
    setGoals(saved);
    setIsLoaded(true);
  }, []);

  // Cadastrar ou Editar Objetivo
  const handleFormSubmit = (data: GoalFormData) => {
    if (editingGoal) {
      const updated = storageService.updateGoal(editingGoal.id, data);
      if (updated) {
        setGoals((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
        showToast('Objetivo atualizado com sucesso!');
      }
    } else {
      const created = storageService.addGoal(data);
      setGoals((prev) => [created, ...prev]);
      showToast('Objetivo cadastrado com sucesso!');
    }
    setEditingGoal(null);
  };

  // Exclusão após confirmação
  const handleConfirmDelete = (id: string) => {
    const success = storageService.deleteGoal(id);
    if (success) {
      setGoals((prev) => prev.filter((g) => g.id !== id));
      showToast('Objetivo excluído com sucesso.');
    }
  };

  // Alteração rápida de status direto pelo Card
  const handleStatusChange = (id: string, newStatus: GoalStatus) => {
    const updated = storageService.updateGoal(id, { status: newStatus });
    if (updated) {
      setGoals((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
      const statusLabels: Record<GoalStatus, string> = {
        nao_iniciado: 'marcado como Não iniciado',
        em_andamento: 'marcado como Em andamento',
        concluido: 'marcado como Concluído! Parabéns 🎉',
      };
      showToast(`Objetivo ${statusLabels[newStatus]}`);
    }
  };

  // Ações nos modais
  const handleOpenCreateModal = () => {
    setEditingGoal(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (goal: StudyGoal) => {
    setEditingGoal(goal);
    setIsFormModalOpen(true);
  };

  const handleRequestDelete = (goal: StudyGoal) => {
    setGoalToDelete(goal);
  };

  // Carregar exemplos ou resetar
  const handleLoadSamples = () => {
    const samples = storageService.resetToSampleGoals();
    setGoals(samples);
    showToast('Exemplos de objetivos carregados!');
  };

  // Limpar todos os objetivos
  const handleClearAll = () => {
    if (window.confirm('Deseja realmente apagar todos os objetivos cadastrados?')) {
      storageService.clearAllGoals();
      setGoals([]);
      showToast('Todos os objetivos foram removidos.');
    }
  };

  // Filtragem e Ordenação em memória
  const filteredAndSortedGoals = useMemo(() => {
    let result = [...goals];

    // Filtro por texto (título ou descrição)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (g) =>
          g.title.toLowerCase().includes(term) ||
          (g.description && g.description.toLowerCase().includes(term))
      );
    }

    // Filtro por status
    if (statusFilter !== 'todos') {
      result = result.filter((g) => g.status === statusFilter);
    }

    // Ordenação
    result.sort((a, b) => {
      if (sortOption === 'deadline-asc') {
        return (a.deadline || '9999').localeCompare(b.deadline || '9999');
      }
      if (sortOption === 'deadline-desc') {
        return (b.deadline || '').localeCompare(a.deadline || '');
      }
      if (sortOption === 'created-desc') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortOption === 'title-asc') {
        return a.title.localeCompare(b.title, 'pt-BR');
      }
      return 0;
    });

    return result;
  }, [goals, searchTerm, statusFilter, sortOption]);

  const isFilteringActive = searchTerm.trim().length > 0 || statusFilter !== 'todos';

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex items-center gap-3 text-slate-500 font-medium text-sm">
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span>Carregando seus objetivos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-800">
      {/* Notificação Toast Flutuante */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce duration-300">
          <div className="bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm font-medium border border-slate-700/60">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Header Principal */}
      <Header onOpenCreateModal={handleOpenCreateModal} totalGoals={goals.length} />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Visão Geral e Contadores */}
        <StatsOverview
          goals={goals}
          onFilterChange={(newFilter) => setStatusFilter(newFilter)}
          activeFilter={statusFilter}
        />

        {/* Barra de Filtros, Pesquisa e Ordenação */}
        {goals.length > 0 && (
          <GoalFilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedFilter={statusFilter}
            onFilterChange={setStatusFilter}
            selectedSort={sortOption}
            onSortChange={setSortOption}
            totalCount={goals.length}
            filteredCount={filteredAndSortedGoals.length}
          />
        )}

        {/* Grade de Cartões de Objetivos ou Estado Vazio */}
        {goals.length === 0 ? (
          <EmptyState
            isFiltered={false}
            onClearFilters={() => {}}
            onOpenCreateModal={handleOpenCreateModal}
            onLoadSamples={handleLoadSamples}
          />
        ) : filteredAndSortedGoals.length === 0 ? (
          <EmptyState
            isFiltered={true}
            onClearFilters={() => {
              setSearchTerm('');
              setStatusFilter('todos');
            }}
            onOpenCreateModal={handleOpenCreateModal}
            onLoadSamples={handleLoadSamples}
          />
        ) : (
          <section aria-label="Lista de objetivos de estudo">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Meus Objetivos de Estudo
              </h2>
              <button
                type="button"
                onClick={handleOpenCreateModal}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer sm:hidden"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredAndSortedGoals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onEdit={handleOpenEditModal}
                  onDeleteRequest={handleRequestDelete}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Dicas Pedagógicas e Rodapé */}
      <FooterTips
        onLoadSamples={handleLoadSamples}
        onClearAll={handleClearAll}
        hasGoals={goals.length > 0}
      />

      {/* Modal de Cadastro / Edição */}
      <GoalFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingGoal(null);
        }}
        onSubmit={handleFormSubmit}
        initialGoal={editingGoal}
      />

      {/* Modal de Confirmação de Exclusão */}
      <DeleteConfirmModal
        isOpen={Boolean(goalToDelete)}
        goal={goalToDelete}
        onClose={() => setGoalToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
