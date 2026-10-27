import React from 'react';
import { BookOpen, SearchX, Plus, Sparkles, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  isFiltered: boolean;
  onClearFilters: () => void;
  onOpenCreateModal: () => void;
  onLoadSamples: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  isFiltered,
  onClearFilters,
  onOpenCreateModal,
  onLoadSamples,
}) => {
  if (isFiltered) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-2xl p-8 sm:p-12 text-center max-w-md mx-auto shadow-xs my-6">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
          <SearchX className="w-7 h-7" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5">
          Nenhum objetivo encontrado
        </h3>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          Não encontramos nenhum objetivo correspondente aos critérios de busca ou filtro selecionados.
        </p>
        <button
          type="button"
          onClick={onClearFilters}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-colors cursor-pointer"
        >
          <span>Limpar filtros e busca</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-white to-indigo-50/30 border border-dashed border-indigo-200 rounded-3xl p-8 sm:p-14 text-center max-w-xl mx-auto shadow-xs my-6">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 border border-indigo-100 shadow-xs">
        <BookOpen className="w-8 h-8" />
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
        Sua jornada de aprendizado começa aqui!
      </h3>
      <p className="text-sm text-slate-600 mb-6 leading-relaxed max-w-md mx-auto">
        Você ainda não tem nenhum objetivo de estudo cadastrado. Que tal registrar o primeiro tópico ou matéria que deseja aprender hoje?
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={onOpenCreateModal}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-sm font-semibold shadow-md shadow-indigo-200 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Cadastrar meu primeiro objetivo</span>
        </button>

        <button
          type="button"
          onClick={onLoadSamples}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-indigo-200 bg-white hover:bg-indigo-50/60 text-indigo-700 text-sm font-semibold transition-colors cursor-pointer"
          title="Preencher com objetivos de exemplo"
        >
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span>Carregar exemplos práticos</span>
        </button>
      </div>

      <div className="mt-8 pt-6 border-t border-indigo-100/70 flex items-center justify-center gap-2 text-xs text-slate-400">
        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
        <span>Seus dados ficam salvos automaticamente no seu navegador.</span>
      </div>
    </div>
  );
};
