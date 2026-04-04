import React from 'react';
import { motion } from 'motion/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Modal } from '../components/common/Modal';

interface ProfessoresProps {
  professores: any[];
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
  editingProfessor: any;
  setEditingProfessor: (prof: any) => void;
  deleteProfessor: (id: string) => void;
  addProfessor: (data: any) => Promise<void>;
  updateProfessor: (id: string, data: any) => Promise<void>;
  addToast: (msg: string) => void;
}

export const Professores = ({ 
  professores, activeModal, setActiveModal, editingProfessor, setEditingProfessor, 
  deleteProfessor, addProfessor, updateProfessor, addToast 
}: ProfessoresProps) => {
  return (
    <motion.section 
      key="professores"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-end">
        <h2 className="text-3xl font-bold">Gestão de Professores</h2>
        <button onClick={() => { setEditingProfessor(null); setActiveModal('professor'); }} className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-green-700 transition-all">
          <Plus className="w-5 h-5" /> Novo Professor
        </button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-purple-50 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-purple-50/50 text-[10px] font-bold uppercase tracking-widest text-purple-400">
            <tr><th className="px-6 py-4">Nome</th><th className="px-6 py-4">Especialidade</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Ações</th></tr>
          </thead>
          <tbody className="divide-y divide-purple-50">
            {professores.map((prof: any, i: number) => (
              <tr key={i} className="hover:bg-purple-50/20 transition-colors">
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 font-bold">{prof.nome && prof.nome[0]}</div>
                  <p className="text-sm font-bold">{prof.nome}</p>
                </td>
                <td className="px-6 py-4 text-xs">{prof.especialidade}</td>
                <td className="px-6 py-4"><span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold">{prof.status}</span></td>
                <td className="px-6 py-4 flex gap-2 justify-end">
                  <button onClick={() => { setEditingProfessor(prof); setActiveModal('professor'); }} className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors" title="Editar"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => { if (window.confirm(`Tem certeza que deseja excluir o(a) professor(a) ${prof.nome}?`)) { deleteProfessor(prof.id); addToast('Professor(a) excluído com sucesso.'); } }} className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors" title="Excluir"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal 
        isOpen={activeModal === 'professor'} 
        onClose={() => { setActiveModal(null); setEditingProfessor(null); }} 
        title={editingProfessor ? "Editar Professor" : "Novo Professor"}
      >
        <form 
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.target as any;
            const updatedData = {
              nome: form.nome.value,
              especialidade: form.especialidade.value,
              status: form.status?.value || 'Ativo'
            };

            if (editingProfessor) {
              await updateProfessor(editingProfessor.id, updatedData);
              addToast('Professor(a) atualizado(a)!');
            } else {
              await addProfessor(updatedData);
              addToast('Professor(a) cadastrado(a)!');
            }
            setActiveModal(null);
            setEditingProfessor(null);
          }} 
          className="p-8 space-y-6"
        >
          <div>
            <label className="block text-xs font-bold uppercase text-purple-400 mb-2">Nome do Professor</label>
            <input defaultValue={editingProfessor?.nome || ''} name="nome" type="text" className="w-full p-3 bg-purple-50/30 border border-purple-100 rounded-xl outline-none focus:ring-2 focus:ring-purple-200 transition-all" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className={editingProfessor ? "" : "col-span-2"}>
              <label className="block text-xs font-bold uppercase text-purple-400 mb-2">Especialidade</label>
              <input defaultValue={editingProfessor?.especialidade || ''} name="especialidade" type="text" placeholder="Ex: Matemática, Física..." className="w-full p-3 bg-purple-50/30 border border-purple-100 rounded-xl outline-none focus:ring-2 focus:ring-purple-200 transition-all" required />
            </div>
            {editingProfessor && (
              <div>
                <label className="block text-xs font-bold uppercase text-purple-400 mb-2">Status</label>
                <select defaultValue={editingProfessor?.status || 'Ativo'} name="status" className="w-full p-3 bg-purple-50/30 border border-purple-100 rounded-xl outline-none focus:ring-2 focus:ring-purple-200 transition-all">
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>
            )}
          </div>
          <div className="flex gap-4 justify-end pt-4">
            <button type="button" onClick={() => { setActiveModal(null); setEditingProfessor(null); }} className="px-6 py-3 font-bold text-purple-400 hover:text-purple-600 transition-colors">Cancelar</button>
            <button type="submit" className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-green-100 hover:bg-green-700 transition-all">Salvar Professor</button>
          </div>
        </form>
      </Modal>
    </motion.section>
  );
};
