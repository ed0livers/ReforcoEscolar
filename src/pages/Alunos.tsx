import React from 'react';
import { motion } from 'motion/react';
import { Plus, Eye, Pencil, Trash2 } from 'lucide-react';
import { MapeadorDeDados } from '../supabase/MapeadorDeDados';
import { Modal } from '../components/common/Modal';
import { CustomDatePicker } from '../components/common/CustomDatePicker';

interface AlunosProps {
  alunos: any[];
  turmas: any[];
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
  editingAluno: any;
  setEditingAluno: React.Dispatch<React.SetStateAction<any>>;
  viewingAluno: any;
  setViewingAluno: (aluno: any) => void;
  deleteAluno: (id: string) => void;
  addAluno: (data: any) => void;
  updateAluno: (id: string, data: any) => void;
  addToast: (msg: string) => void;
}

export const Alunos = ({ 
  alunos, turmas, activeModal, setActiveModal, editingAluno, setEditingAluno, 
  viewingAluno, setViewingAluno, deleteAluno, addAluno, updateAluno, addToast 
}: AlunosProps) => {
  const { paraSistemaAluno } = MapeadorDeDados;

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const alunoData = {
      nome: (document.getElementById('nome') as HTMLInputElement).value,
      data_nascimento: (document.getElementById('data_nascimento') as HTMLInputElement).value,
      nome_responsavel: (document.getElementById('nome_responsavel') as HTMLInputElement).value,
      telefone_responsavel: (document.getElementById('telefone_responsavel') as HTMLInputElement).value,
      email: (document.getElementById('email') as HTMLInputElement).value,
      turma: (document.getElementById('turma') as HTMLSelectElement).value,
      status: (document.getElementById('status') as HTMLSelectElement)?.value || 'ATIVO',
      valor_mensalidade: (document.getElementById('valor_mensalidade') as HTMLInputElement)?.value || '',
      vencimento: (document.getElementById('vencimento') as HTMLSelectElement)?.value || '',
    };

    if (editingAluno?.id) {
      await updateAluno(editingAluno.id, alunoData);
      addToast('Aluno atualizado com sucesso!');
    } else {
      await addAluno(alunoData);
      addToast('Aluno cadastrado com sucesso!');
    }
    setActiveModal(null);
    setEditingAluno(null);
  };

  return (
    <motion.section 
      key="alunos"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-end">
        <div>
          <p className="text-sm text-purple-400 font-medium">Gestão Escolar &gt; Alunos</p>
          <h2 className="text-3xl font-bold">Gestão de Alunos</h2>
        </div>
        <button 
          onClick={() => { setEditingAluno(null); setActiveModal('aluno'); }} 
          className="bg-[#8126cf] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-[#6b1ead] transition-all"
        >
          <Plus className="w-5 h-5" /> Novo Aluno
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-purple-50 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-purple-50/50 text-[10px] font-bold uppercase tracking-widest text-purple-400 border-b border-purple-50">
            <tr>
              <th className="px-6 py-4">Nome</th>
              <th className="px-6 py-4">Matrícula</th>
              <th className="px-6 py-4">Turma</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-50">
            {alunos.map(paraSistemaAluno).map((aluno: any, i: number) => (
              <tr key={i} className="hover:bg-purple-50/30 transition-all">
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs">
                    {aluno.name && aluno.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{aluno.name}</p>
                    <p className="text-xs text-purple-400">{aluno.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium">{aluno.id}</td>
                <td className="px-6 py-4">
                  <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-[10px] font-bold">{aluno.turma}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${aluno.status === 'ATIVO' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {aluno.status}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-2 justify-end">
                  <button onClick={() => { setViewingAluno(aluno); setActiveModal('view_aluno'); }} className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center hover:bg-purple-100 transition-colors" title="Visualizar"><Eye className="w-4 h-4" /></button>
                  <button onClick={() => { setEditingAluno(aluno); setActiveModal('aluno'); }} className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors" title="Editar"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => { if (window.confirm(`Tem certeza que deseja excluir o(a) aluno(a) ${aluno.name}?`)) { deleteAluno(aluno.id); addToast('Aluno excluído com sucesso.'); } }} className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors" title="Excluir"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL CADASTRO/EDIÇÃO */}
      <Modal 
        isOpen={activeModal === 'aluno'} 
        onClose={() => { setActiveModal(null); setEditingAluno(null); }} 
        title={editingAluno ? 'Editar Aluno' : 'Novo Aluno'}
      >
        <form onSubmit={handleModalSubmit} className="p-8 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-purple-400 mb-2">Nome do Aluno</label>
              <input defaultValue={editingAluno?.name || ''} id="nome" type="text" placeholder="Ex: Maria João Silva" className="w-full p-3 bg-purple-50/30 border border-purple-100 rounded-xl outline-none focus:ring-2 focus:ring-purple-200 transition-all font-bold text-purple-900" required />
            </div>
            <div>
              <CustomDatePicker 
                label="Data de Nascimento"
                id="data_nascimento"
                value={editingAluno?.dataNascimento || ''}
                onChange={(val) => setEditingAluno(prev => ({ ...prev, dataNascimento: val }))}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-purple-400 mb-2">Nome do Responsável</label>
            <input defaultValue={editingAluno?.nomeResponsavel || ''} id="nome_responsavel" type="text" placeholder="Ex: Carlos Silva" className="w-full p-3 bg-purple-50/30 border border-purple-100 rounded-xl outline-none focus:ring-2 focus:ring-purple-200 transition-all" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-purple-400 mb-2">E-mail do Responsável <span className="text-[9px] lowercase opacity-60">(Opcional)</span></label>
              <input defaultValue={editingAluno?.email || ''} id="email" type="email" placeholder="pai@email.com" className="w-full p-3 bg-purple-50/30 border border-purple-100 rounded-xl outline-none focus:ring-2 focus:ring-purple-200 transition-all font-bold text-purple-900" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-purple-400 mb-2">Telefone do Responsável</label>
              <input 
                defaultValue={editingAluno?.telefoneResponsavel || ''} 
                id="telefone_responsavel" 
                type="tel" 
                placeholder="(11) 99999-9999" 
                maxLength={15}
                onChange={(e) => {
                  let v = e.target.value.replace(/\D/g, "");
                  v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
                  v = v.replace(/(\d)(\d{4})$/, "$1-$2");
                  e.target.value = v;
                }}
                className="w-full p-3 bg-purple-50/30 border border-purple-100 rounded-xl outline-none focus:ring-2 focus:ring-purple-200 transition-all" 
                required 
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className={editingAluno ? "" : "col-span-2"}>
              <label className="block text-xs font-bold uppercase text-purple-400 mb-2">Turma</label>
              <select defaultValue={editingAluno?.turma || ''} id="turma" className="w-full p-3 bg-purple-50/30 border border-purple-100 rounded-xl outline-none focus:ring-2 focus:ring-purple-200 transition-all">
                {turmas.map((t, idx) => (
                  <option key={idx} value={t.nome}>{t.nome}</option>
                ))}
                {turmas.length === 0 && <option value="">(Nenhuma turma cadastrada)</option>}
              </select>
            </div>
            {editingAluno?.id && (
              <div>
                <label className="block text-xs font-bold uppercase text-purple-400 mb-2">Status</label>
                <select defaultValue={editingAluno?.status || 'ATIVO'} id="status" className="w-full p-3 bg-purple-50/30 border border-purple-100 rounded-xl outline-none focus:ring-2 focus:ring-purple-200 transition-all">
                  <option value="ATIVO">Ativo</option>
                  <option value="INATIVO">Inativo</option>
                </select>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-purple-50">
            <div>
              <label className="block text-xs font-bold uppercase text-purple-400 mb-2">Valor da Mensalidade (R$)</label>
              <input defaultValue={editingAluno?.valorMensalidade || ''} id="valor_mensalidade" type="number" step="0.01" placeholder="Ex: 250.00" className="w-full p-3 bg-purple-50/30 border border-purple-100 rounded-xl outline-none focus:ring-2 focus:ring-purple-200 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-purple-400 mb-2">Vencimento</label>
              <select defaultValue={editingAluno?.vencimento || '5'} id="vencimento" className="w-full p-3 bg-purple-50/30 border border-purple-100 rounded-xl outline-none focus:ring-2 focus:ring-purple-200 transition-all font-bold text-purple-900">
                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                  <option key={day} value={day}>Dia {day}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-4 justify-end pt-4">
            <button type="button" onClick={() => { setActiveModal(null); setEditingAluno(null); }} className="px-6 py-3 font-bold text-purple-400 hover:text-purple-600 transition-colors">Cancelar</button>
            <button type="submit" className="bg-purple-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-purple-200 hover:bg-purple-700 transition-all">Salvar Cadastro</button>
          </div>
        </form>
      </Modal>

      {/* MODAL VISUALIZAR ALUNO */}
      <Modal 
        isOpen={activeModal === 'view_aluno'} 
        onClose={() => { setActiveModal(null); setViewingAluno(null); }} 
        title="Detalhes do Aluno"
      >
        {viewingAluno && (
          <div className="p-8 space-y-6">
            <div className="flex items-center gap-4 border-b border-purple-50 pb-6">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-2xl">
                {viewingAluno.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-bold">{viewingAluno.name}</h3>
                <p className="text-purple-400 text-sm">Status: <span className="font-bold">{viewingAluno.status}</span></p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] font-bold uppercase text-purple-300">Responsável</p>
                <p className="font-semibold">{viewingAluno.nomeResponsavel || 'Não informado'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-purple-300">Data de Nascimento</p>
                <p className="font-semibold">
                  {viewingAluno.dataNascimento 
                    ? new Date(viewingAluno.dataNascimento).toLocaleDateString('pt-br', {timeZone: 'UTC'}) 
                    : 'Não informado'}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-purple-300">E-mail de Contato</p>
                <p className="font-semibold">{viewingAluno.email || 'Não informado'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-purple-300">Telefone</p>
                <p className="font-semibold">{viewingAluno.telefoneResponsavel || 'Não informado'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-purple-300">Valor Mensalidade</p>
                <p className="font-semibold">{viewingAluno.valorMensalidade ? `R$ ${viewingAluno.valorMensalidade}` : 'Não informado'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-purple-300">Vencimento</p>
                <p className="font-semibold">{viewingAluno.vencimento ? `Dia ${viewingAluno.vencimento}` : 'Não informado'}</p>
              </div>
              <div className="col-span-2 bg-purple-50 p-4 rounded-xl mt-2">
                <p className="text-[10px] font-bold uppercase text-purple-400">Turma Matriculada</p>
                <p className="font-bold text-purple-700">{viewingAluno.turma}</p>
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <button onClick={() => { setActiveModal(null); setViewingAluno(null); }} className="px-6 py-3 font-bold text-purple-600 bg-purple-100 hover:bg-purple-200 rounded-xl transition-colors">Fechar</button>
            </div>
          </div>
        )}
      </Modal>
    </motion.section>
  );
};
