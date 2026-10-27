import React from 'react';
import { Lightbulb, Database, Sparkles, RefreshCw } from 'lucide-react';

interface FooterTipsProps {
  onLoadSamples: () => void;
  onClearAll: () => void;
  hasGoals: boolean;
}

export const FooterTips: React.FC<FooterTipsProps> = ({
  onLoadSamples,
  onClearAll,
  hasGoals,
}) => {
  return (
    <footer className="mt-12 pt-8 border-t border-slate-200/80 pb-10 text-slate-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Dica para o estudante iniciante */}
        <div className="bg-amber-50/60 border border-amber-200/70 rounded-2xl p-4 flex items-start gap-3.5">
          <div className="p-2 bg-amber-100/70 text-amber-700 rounded-lg shrink-0 mt-0.5">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            <span className="font-bold text-amber-900">Dica de ouro para iniciantes: </span>
            Em vez de metas vagas como <em>"Aprender Matemática"</em>, experimente dividir em objetivos específicos, como <em>"Resolver 10 exercícios de frações até sexta-feira"</em>. Pequenas vitórias constroem grandes hábitos!
          </div>
        </div>

        {/* Rodapé institucional com indicação de salvamento e ações secundárias */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              Armazenamento ativo via <strong className="text-slate-600 font-semibold">localStorage</strong> (seus dados não somem ao fechar a página).
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onLoadSamples}
              className="hover:text-indigo-600 transition-colors flex items-center gap-1 cursor-pointer"
              title="Carregar objetivos sugeridos"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Carregar exemplos</span>
            </button>
            {hasGoals && (
              <>
                <span>•</span>
                <button
                  type="button"
                  onClick={onClearAll}
                  className="hover:text-rose-600 transition-colors cursor-pointer"
                  title="Apagar todos os dados para começar do zero"
                >
                  Limpar todos
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
