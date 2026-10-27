import React, { useEffect, useState } from 'react';
import { X, Calendar, CheckCircle2, Clock, CircleDot, AlertCircle, Sparkles } from 'lucide-react';
import { GoalFormData, GoalStatus, StudyGoal } from '../types/goal';
import { getTodayDateString } from '../utils/dateUtils';

interface GoalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GoalFormData) => void;
  initialGoal?: StudyGoal | null;
}

export const GoalFormModal: React.FC<GoalFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialGoal,
}) => {
  const isEditing = Boolean(initialGoal);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<GoalStatus>('nao_iniciado');

  const [errors, setErrors] = useState<{ title?: string; deadline?: string }>({});
  const [touched, setTouched] = useState<{ title?: boolean; deadline?: boolean }>({});

  useEffect(() => {
    if (initialGoal) {
      setTitle(initialGoal.title);
      setDescription(initialGoal.description || '');
      setDeadline(initialGoal.deadline || '');
      setStatus(initialGoal.status);
    } else {
      // Padrão para novo objetivo: daqui a 7 dias
      const defaultDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];
      setTitle('');
      setDescription('');
      setDeadline(defaultDate);
      setStatus('nao_iniciado');
    }
    setErrors({});
    setTouched({});
  }, [initialGoal, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: { title?: string; deadline?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Por favor, informe o título do seu objetivo.';
    } else if (title.trim().length < 3) {
      newErrors.title = 'O título deve ter pelo menos 3 caracteres.';
    }

    if (!deadline) {
      newErrors.deadline = 'Por favor, selecione a data limite (prazo).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ title: true, deadline: true });

    if (!validate()) {
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      deadline,
      status,
    });
    onClose();
  };

  // Atalhos práticos de data
  const setQuickDeadline = (daysAhead: number) => {
    const target = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000);
    const y = target.getFullYear();
    const m = String(target.getMonth() + 1).padStart(2, '0');
    const d = String(target.getDate()).padStart(2, '0');
    setDeadline(`${y}-${m}-${d}`);
    if (errors.deadline) {
      setErrors((prev) => ({ ...prev, deadline: undefined }));
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden transform transition-all">
        {/* Header do Modal */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 id="modal-title" className="text-lg font-bold text-slate-900">
                {isEditing ? 'Editar Objetivo de Estudo' : 'Cadastrar Novo Objetivo'}
              </h2>
              <p className="text-xs text-slate-500">
                {isEditing
                  ? 'Atualize os detalhes do seu objetivo conforme sua evolução.'
                  : 'Defina o que você quer aprender e estabeleça um prazo realizável.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Fechar janela"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4.5">
          {/* Campo Título */}
          <div>
            <label htmlFor="goal-title" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Título do objetivo <span className="text-rose-500">*</span>
            </label>
            <input
              id="goal-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              onBlur={() => setTouched((prev) => ({ ...prev, title: true }))}
              placeholder="Ex: Dominar Funções em JavaScript, Ler Cap. 3 de Biologia..."
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                errors.title && touched.title
                  ? 'border-rose-300 bg-rose-50/20 focus:ring-rose-500/20 focus:border-rose-500'
                  : 'border-slate-200 bg-slate-50/30 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white'
              }`}
            />
            {errors.title && touched.title && (
              <p className="flex items-center gap-1 text-xs text-rose-600 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.title}</span>
              </p>
            )}
          </div>

          {/* Campo Descrição */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="goal-desc" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Descrição e Orientações <span className="text-slate-400 font-normal lowercase">(opcional)</span>
              </label>
              <span className="text-[11px] text-slate-400">Dica: anote links, capítulos ou tópicos</span>
            </div>
            <textarea
              id="goal-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Resolver 15 exercícios práticos, assistir às videoaulas 1 a 4 e resumir os principais conceitos no caderno."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/30 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all resize-none"
            />
          </div>

          {/* Campo Prazo */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="goal-deadline" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Prazo de conclusão <span className="text-rose-500">*</span>
              </label>
              {/* Botões de atalho */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setQuickDeadline(0)}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                >
                  Hoje
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDeadline(3)}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                >
                  Em 3 dias
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDeadline(7)}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium cursor-pointer"
                >
                  1 semana
                </button>
              </div>
            </div>

            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="goal-deadline"
                type="date"
                min={getTodayDateString()}
                value={deadline}
                onChange={(e) => {
                  setDeadline(e.target.value);
                  if (errors.deadline) setErrors((prev) => ({ ...prev, deadline: undefined }));
                }}
                onBlur={() => setTouched((prev) => ({ ...prev, deadline: true }))}
                className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                  errors.deadline && touched.deadline
                    ? 'border-rose-300 bg-rose-50/20 focus:ring-rose-500/20 focus:border-rose-500'
                    : 'border-slate-200 bg-slate-50/30 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white'
                }`}
              />
            </div>
            {errors.deadline && touched.deadline && (
              <p className="flex items-center gap-1 text-xs text-rose-600 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.deadline}</span>
              </p>
            )}
          </div>

          {/* Campo Status */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Status inicial do objetivo
            </label>
            <div className="grid grid-cols-3 gap-2">
              {/* Não iniciado */}
              <button
                type="button"
                onClick={() => setStatus('nao_iniciado')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  status === 'nao_iniciado'
                    ? 'bg-amber-50 border-amber-300 text-amber-800 ring-2 ring-amber-400/20 shadow-xs'
                    : 'bg-slate-50/60 border-slate-200 text-slate-600 hover:bg-slate-100/70'
                }`}
              >
                <CircleDot className="w-4 h-4 mb-1 text-amber-600" />
                <span>Não iniciado</span>
              </button>

              {/* Em andamento */}
              <button
                type="button"
                onClick={() => setStatus('em_andamento')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  status === 'em_andamento'
                    ? 'bg-blue-50 border-blue-300 text-blue-800 ring-2 ring-blue-400/20 shadow-xs'
                    : 'bg-slate-50/60 border-slate-200 text-slate-600 hover:bg-slate-100/70'
                }`}
              >
                <Clock className="w-4 h-4 mb-1 text-blue-600" />
                <span>Em andamento</span>
              </button>

              {/* Concluído */}
              <button
                type="button"
                onClick={() => setStatus('concluido')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  status === 'concluido'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 ring-2 ring-emerald-400/20 shadow-xs'
                    : 'bg-slate-50/60 border-slate-200 text-slate-600 hover:bg-slate-100/70'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 mb-1 text-emerald-600" />
                <span>Concluído</span>
              </button>
            </div>
          </div>

          {/* Botões do Rodapé */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-sm font-semibold shadow-xs hover:shadow-md hover:shadow-indigo-200 transition-all cursor-pointer"
            >
              {isEditing ? 'Salvar Alterações' : 'Cadastrar Objetivo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
