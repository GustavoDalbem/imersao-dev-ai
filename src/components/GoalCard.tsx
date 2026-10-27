import React, { useState } from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  CircleDot, 
  Clock, 
  Edit3, 
  Trash2, 
  ChevronDown, 
  AlertCircle 
} from 'lucide-react';
import { GoalStatus, StudyGoal } from '../types/goal';
import { formatDeadlineInfo } from '../utils/dateUtils';

interface GoalCardProps {
  goal: StudyGoal;
  onEdit: (goal: StudyGoal) => void;
  onDeleteRequest: (goal: StudyGoal) => void;
  onStatusChange: (id: string, newStatus: GoalStatus) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onEdit,
  onDeleteRequest,
  onStatusChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isCompleted = goal.status === 'concluido';
  const deadlineInfo = formatDeadlineInfo(goal.deadline, isCompleted);

  const getStatusBadge = (status: GoalStatus) => {
    switch (status) {
      case 'concluido':
        return {
          label: 'Concluído',
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
          classes: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
        };
      case 'em_andamento':
        return {
          label: 'Em andamento',
          icon: <Clock className="w-3.5 h-3.5" />,
          classes: 'bg-blue-50 text-blue-700 border-blue-200/80',
        };
      case 'nao_iniciado':
      default:
        return {
          label: 'Não iniciado',
          icon: <CircleDot className="w-3.5 h-3.5" />,
          classes: 'bg-amber-50 text-amber-700 border-amber-200/80',
        };
    }
  };

  const statusBadge = getStatusBadge(goal.status);

  return (
    <article
      className={`group relative flex flex-col justify-between bg-white rounded-2xl border transition-all duration-200 shadow-xs hover:shadow-md ${
        isCompleted
          ? 'border-emerald-200/70 bg-emerald-50/20 hover:border-emerald-300'
          : deadlineInfo.isOverdue
          ? 'border-rose-200/80 hover:border-rose-300'
          : 'border-slate-200/90 hover:border-indigo-200'
      }`}
    >
      <div className="p-4 sm:p-5">
        {/* Cabeçalho do Card: Status e Ações Rápidas */}
        <div className="flex items-center justify-between gap-2 mb-3">
          {/* Seletor rápido de status */}
          <div className="relative inline-flex items-center">
            <label htmlFor={`status-select-${goal.id}`} className="sr-only">
              Alterar status de {goal.title}
            </label>
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusBadge.classes}`}
            >
              {statusBadge.icon}
              <select
                id={`status-select-${goal.id}`}
                value={goal.status}
                onChange={(e) => onStatusChange(goal.id, e.target.value as GoalStatus)}
                className="bg-transparent border-none text-xs font-semibold focus:outline-none cursor-pointer pr-1"
                title="Clique para alterar status"
              >
                <option value="nao_iniciado">Não iniciado</option>
                <option value="em_andamento">Em andamento</option>
                <option value="concluido">Concluído</option>
              </select>
            </div>
          </div>

          {/* Botões de Ação: Editar e Excluir */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(goal)}
              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
              title="Editar objetivo"
              aria-label={`Editar objetivo: ${goal.title}`}
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onDeleteRequest(goal)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Excluir objetivo"
              aria-label={`Excluir objetivo: ${goal.title}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Título do Objetivo */}
        <h3
          className={`text-base sm:text-lg font-bold leading-snug mb-2 transition-colors ${
            isCompleted ? 'text-slate-500 line-through decoration-emerald-500/60' : 'text-slate-900'
          }`}
        >
          {goal.title}
        </h3>

        {/* Descrição com tratamento amigável para textos longos */}
        {goal.description ? (
          <div className="mb-4">
            <p
              className={`text-sm text-slate-600 leading-relaxed ${
                !isExpanded ? 'line-clamp-3' : ''
              }`}
            >
              {goal.description}
            </p>
            {goal.description.length > 140 && (
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5 cursor-pointer"
              >
                <span>{isExpanded ? 'Mostrar menos' : 'Ler mais'}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                />
              </button>
            )}
          </div>
        ) : (
          <p className="text-xs italic text-slate-400 mb-4">Nenhuma descrição detalhada.</p>
        )}
      </div>

      {/* Rodapé do Card com Prazo e Informações */}
      <div className="px-4 py-3 bg-slate-50/70 border-t border-slate-100 rounded-b-2xl flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Data formatada */}
        <div className="flex items-center gap-1.5 text-slate-600 font-medium">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Prazo: {deadlineInfo.formattedDate}</span>
        </div>

        {/* Badge contextual de prazo */}
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[11px] ${deadlineInfo.badgeClass}`}
        >
          {deadlineInfo.isOverdue && <AlertCircle className="w-3 h-3 text-rose-500" />}
          {deadlineInfo.badgeLabel}
        </span>
      </div>
    </article>
  );
};
