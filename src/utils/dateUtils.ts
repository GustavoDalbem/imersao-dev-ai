/**
 * Utilitários para formatação de prazos e datas em português do Brasil (pt-BR).
 */

export interface DeadlineInfo {
  formattedDate: string;
  badgeLabel: string;
  badgeClass: string;
  isOverdue: boolean;
  daysRemaining: number;
}

export function formatDeadlineInfo(deadlineDateString: string, isCompleted: boolean): DeadlineInfo {
  if (!deadlineDateString) {
    return {
      formattedDate: 'Sem prazo definido',
      badgeLabel: 'Sem prazo',
      badgeClass: 'bg-slate-100 text-slate-600 border-slate-200',
      isOverdue: false,
      daysRemaining: 999,
    };
  }

  // Parse no formato YYYY-MM-DD
  const parts = deadlineDateString.split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  const deadline = new Date(year, month, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = deadline.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const formattedDate = deadline.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  if (isCompleted) {
    return {
      formattedDate,
      badgeLabel: 'Concluído',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      isOverdue: false,
      daysRemaining: diffDays,
    };
  }

  if (diffDays < 0) {
    const absDays = Math.abs(diffDays);
    return {
      formattedDate,
      badgeLabel: absDays === 1 ? 'Atrasado há 1 dia' : `Atrasado há ${absDays} dias`,
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 font-medium',
      isOverdue: true,
      daysRemaining: diffDays,
    };
  }

  if (diffDays === 0) {
    return {
      formattedDate,
      badgeLabel: 'Vence hoje!',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-300 font-semibold animate-pulse',
      isOverdue: false,
      daysRemaining: 0,
    };
  }

  if (diffDays === 1) {
    return {
      formattedDate,
      badgeLabel: 'Vence amanhã',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
      isOverdue: false,
      daysRemaining: 1,
    };
  }

  if (diffDays <= 5) {
    return {
      formattedDate,
      badgeLabel: `Restam ${diffDays} dias`,
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
      isOverdue: false,
      daysRemaining: diffDays,
    };
  }

  return {
    formattedDate,
    badgeLabel: `Em ${diffDays} dias`,
    badgeClass: 'bg-slate-50 text-slate-600 border-slate-200',
    isOverdue: false,
    daysRemaining: diffDays,
  };
}

export function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
