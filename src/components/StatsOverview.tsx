import React from 'react';
import { Target, Clock, CheckCircle2, CircleDot, TrendingUp } from 'lucide-react';
import { StudyGoal } from '../types/goal';

interface StatsOverviewProps {
  goals: StudyGoal[];
  onFilterChange: (status: 'todos' | 'nao_iniciado' | 'em_andamento' | 'concluido') => void;
  activeFilter: string;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  goals,
  onFilterChange,
  activeFilter,
}) => {
  const total = goals.length;
  const naoIniciados = goals.filter((g) => g.status === 'nao_iniciado').length;
  const emAndamento = goals.filter((g) => g.status === 'em_andamento').length;
  const concluidos = goals.filter((g) => g.status === 'concluido').length;

  const percentage = total > 0 ? Math.round((concluidos / total) * 100) : 0;

  return (
    <section aria-label="Resumo dos objetivos" className="space-y-4">
      {/* Barra de destaque com progresso geral */}
      <div className="bg-gradient-to-r from-indigo-50/80 via-white to-violet-50/80 border border-indigo-100 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-100/80 text-indigo-700">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700">
                  Progresso dos Estudos
                </span>
                <span className="text-xs text-slate-500 font-normal">
                  ({concluidos} de {total} concluído{total === 1 ? '' : 's'})
                </span>
              </div>
              <p className="text-sm text-slate-600 font-medium">
                {total === 0
                  ? 'Cadastre seu primeiro objetivo para começar a monitorar sua rotina!'
                  : percentage === 100
                  ? 'Incrível! Você concluiu todos os seus objetivos cadastrados 🎉'
                  : percentage >= 50
                  ? 'Excelente ritmo! Você já ultrapassou a metade das suas metas 💪'
                  : 'Dê um passo de cada vez. A consistência gera grandes resultados!'}
              </p>
            </div>
          </div>
          <div className="flex items-baseline gap-1 self-end sm:self-auto">
            <span className="text-2xl sm:text-3xl font-extrabold text-indigo-700">{percentage}%</span>
            <span className="text-xs font-semibold text-slate-500">concluído</span>
          </div>
        </div>

        {/* Barra de progresso */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/60">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-emerald-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Cartões de métricas clicáveis para filtrar rapidamente */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total cadastrados */}
        <button
          type="button"
          onClick={() => onFilterChange('todos')}
          className={`flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl border text-left transition-all cursor-pointer ${
            activeFilter === 'todos'
              ? 'bg-indigo-50/90 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
              : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50 shadow-xs'
          }`}
        >
          <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total cadastrados</p>
            <p className="text-xl sm:text-2xl font-bold text-slate-900">{total}</p>
          </div>
        </button>

        {/* Não iniciados */}
        <button
          type="button"
          onClick={() => onFilterChange('nao_iniciado')}
          className={`flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl border text-left transition-all cursor-pointer ${
            activeFilter === 'nao_iniciado'
              ? 'bg-amber-50/90 border-amber-300 ring-2 ring-amber-500/20 shadow-xs'
              : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50 shadow-xs'
          }`}
        >
          <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600">
            <CircleDot className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Não iniciados</p>
            <p className="text-xl sm:text-2xl font-bold text-amber-700">{naoIniciados}</p>
          </div>
        </button>

        {/* Em andamento */}
        <button
          type="button"
          onClick={() => onFilterChange('em_andamento')}
          className={`flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl border text-left transition-all cursor-pointer ${
            activeFilter === 'em_andamento'
              ? 'bg-blue-50/90 border-blue-300 ring-2 ring-blue-500/20 shadow-xs'
              : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50 shadow-xs'
          }`}
        >
          <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Em andamento</p>
            <p className="text-xl sm:text-2xl font-bold text-blue-700">{emAndamento}</p>
          </div>
        </button>

        {/* Concluídos */}
        <button
          type="button"
          onClick={() => onFilterChange('concluido')}
          className={`flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl border text-left transition-all cursor-pointer ${
            activeFilter === 'concluido'
              ? 'bg-emerald-50/90 border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs'
              : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50 shadow-xs'
          }`}
        >
          <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Concluídos</p>
            <p className="text-xl sm:text-2xl font-bold text-emerald-700">{concluidos}</p>
          </div>
        </button>
      </div>
    </section>
  );
};
