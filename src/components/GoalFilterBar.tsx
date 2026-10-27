import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { GoalFilter, GoalSortOption } from '../types/goal';

interface GoalFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedFilter: GoalFilter;
  onFilterChange: (filter: GoalFilter) => void;
  selectedSort: GoalSortOption;
  onSortChange: (sort: GoalSortOption) => void;
  totalCount: number;
  filteredCount: number;
}

export const GoalFilterBar: React.FC<GoalFilterBarProps> = ({
  searchTerm,
  onSearchChange,
  selectedFilter,
  onFilterChange,
  selectedSort,
  onSortChange,
  totalCount,
  filteredCount,
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-xs space-y-3">
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        {/* Campo de Busca */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por título ou descrição..."
            className="w-full pl-10 pr-9 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md cursor-pointer"
              aria-label="Limpar busca"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Ordenação */}
        <div className="flex items-center gap-2 shrink-0">
          <SlidersHorizontal className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-medium text-slate-500 whitespace-nowrap">Ordenar por:</span>
          <select
            value={selectedSort}
            onChange={(e) => onSortChange(e.target.value as GoalSortOption)}
            className="text-xs sm:text-sm font-medium py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100/70 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
          >
            <option value="deadline-asc">Prazo mais próximo</option>
            <option value="deadline-desc">Prazo mais distante</option>
            <option value="created-desc">Mais recentes primeiro</option>
            <option value="title-asc">Título (A - Z)</option>
          </select>
        </div>
      </div>

      {/* Abas / Filtros de Status */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {(
            [
              { id: 'todos', label: 'Todos' },
              { id: 'nao_iniciado', label: 'Não iniciados' },
              { id: 'em_andamento', label: 'Em andamento' },
              { id: 'concluido', label: 'Concluídos' },
            ] as const
          ).map((tab) => {
            const isActive = selectedFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onFilterChange(tab.id)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Quantidade filtrada */}
        <div className="text-xs text-slate-500 font-medium">
          {searchTerm || selectedFilter !== 'todos' ? (
            <span>
              Exibindo <strong className="text-slate-700">{filteredCount}</strong> de {totalCount}
            </span>
          ) : (
            <span>
              Total: <strong className="text-slate-700">{totalCount}</strong> objetivo{totalCount === 1 ? '' : 's'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
