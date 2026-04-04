import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Layers, Users, ClipboardCheck, Pencil, Trash2, AlertCircle } from 'lucide-react';
import { Modal } from '../components/common/Modal';
import { CustomDatePicker } from '../components/common/CustomDatePicker';

interface TurmasProps {
  turmas: any[];
  alunos: any[];
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
  editingTurma: any;
  setEditingTurma: React.Dispatch<React.SetStateAction<any>>;
  viewingTurma: any;
  setViewingTurma: (turma: any) => void;
  activeAttendanceTurma: any;
  setActiveAttendanceTurma: (turma: any) => void;
  deleteTurma: (id: string) => void;
  addTurma: (data: any) => void;
  updateTurma: (id: string, data: any) => void;
  registrarFrequencia: (data: any[]) => Promise<void>;
  addToast: (msg: string) => void;
  alertData: {title: string, message: string} | null;
  setAlertData: (data: {title: string, message: string} | null) => void;
  setViewingAluno: (aluno: any) => void;
}

export const Turmas = ({ 
  turmas, alunos, activeModal, setActiveModal, editingTurma, setEditingTurma, 
  viewingTurma, setViewingTurma, activeAttendanceTurma, setActiveAttendanceTurma, 
  deleteTurma, addTurma, updateTurma, registrarFrequencia, addToast, 
  alertData, setAlertData, setViewingAluno
}: TurmasProps) => {
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [chamadaData, setChamadaData] = useState<Record<string, 'presente' | 'falta'>>({});

  return (
    <motion.section 
      key="turmas"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-end">
        <h2 className="text-3xl font-bold">Gestão de Turmas</h2>
        <button 
          onClick={() => { setEditingTurma(null); setActiveModal('turma'); }} 
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all"
        >
          <Plus className="w-5 h-5" /> Nova Turma
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-purple-50 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-purple-50/50 text-[10px] font-bold uppercase tracking-widest text-purple-400">
            <tr>
              <th className="px-6 py-4">Nome da Turma</th>
              <th className="px-6 py-4">Alunos Matriculados</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-50">
            {turmas.map((turma: any, i: number) => {
              const alunosInscritos = alunos.filter(a => a.turma === turma.nome && a.status === 'ATIVO');
              return (
                <tr key={i} className="hover:bg-purple-50/20 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold shrink-0">
                      <Layers className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-bold">{turma.nome}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {alunosInscritos.length > 0 ? (
                        <button 
                          onClick={() => { setViewingTurma(turma); setActiveModal('view_turma'); }}
                          className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-200 hover:bg-indigo-100 transition-all flex items-center gap-2"
                        >
                          <Users className="w-3 h-3" />
                          {alunosInscritos.length} Alunos (Exibir)
                        </button>
                      ) : (
                        <span className="text-[10px] font-semibold text-purple-300 italic">Turma vazia</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold">{turma.status || 'ATIVO'}</span>
                  </td>
                  <td className="px-6 py-4 flex gap-2 justify-end whitespace-nowrap">
                    <button 
                      onClick={() => setActiveAttendanceTurma(turma)}
                      className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors shrink-0"
                      title="Fazer Chamada"
                    >
                      <ClipboardCheck className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => {
                        setEditingTurma(turma);
                        setActiveModal('turma');
                      }}
                      className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors shrink-0"
                      title="Editar"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => {
                        if (alunosInscritos.length > 0) {
                          setAlertData({
                            title: 'Ação Bloqueada',
                            message: `Não é possível excluir a turma "${turma.nome}" pois existem ${alunosInscritos.length} aluno(s) vinculados a ela.`
                          });
                          return;
                        }
                        if (window.confirm(`Tem certeza que deseja excluir a turma "${turma.nome}"?`)) {
                          deleteTurma(turma.id);
                          addToast('Turma excluída com sucesso.');
                        }
                      }}
                      className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors shrink-0"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {turmas.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-purple-400 text-sm">
                  Nenhuma turma registrada.
                </td>
              </tr>
            )}
         </tbody>
       </table>
     </div>

      {/* MODAL TURMA */}
      <Modal 
        isOpen={activeModal === 'turma'} 
        onClose={() => { setActiveModal(null); setEditingTurma(null); }} 
        title={editingTurma ? "Editar Turma" : "Nova Turma"}
      >
        <form 
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.target as any;
            const updatedData = {
              nome: form.nome.value,
              status: form.status?.value || 'ATIVO'
            };

            if (editingTurma) {
              await updateTurma(editingTurma.id, updatedData);
              addToast('Turma atualizada!');
            } else {
              await addTurma(updatedData);
              addToast('Turma cadastrada com sucesso!');
            }
            setActiveModal(null);
            setEditingTurma(null);
          }} 
          className="p-8 space-y-6"
        >
          <div>
            <label className="block text-xs font-bold uppercase text-purple-400 mb-2">Nome da Turma / Horário</label>
            <input defaultValue={editingTurma?.nome || ''} name="nome" type="text" placeholder="Ex: Manhã - 08:00 - 10:00" className="w-full p-3 bg-purple-50/30 border border-purple-100 rounded-xl outline-none focus:ring-2 focus:ring-purple-200 transition-all" required />
          </div>
          {editingTurma && (
            <div>
              <label className="block text-xs font-bold uppercase text-purple-400 mb-2">Status</label>
              <select defaultValue={editingTurma?.status || 'ATIVO'} name="status" className="w-full p-3 bg-purple-50/30 border border-purple-100 rounded-xl outline-none focus:ring-2 focus:ring-purple-200 transition-all">
                <option value="ATIVO">Ativo</option>
                <option value="INATIVO">Inativo</option>
              </select>
            </div>
          )}
          <div className="flex gap-4 justify-end pt-4">
            <button type="button" onClick={() => { setActiveModal(null); setEditingTurma(null); }} className="px-6 py-3 font-bold text-purple-400 hover:text-purple-600 transition-colors">Cancelar</button>
            <button type="submit" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">Salvar Turma</button>
          </div>
        </form>
      </Modal>

      {/* MODAL VISUALIZAR TURMA */}
      <Modal 
        isOpen={activeModal === 'view_turma'} 
        onClose={() => { setActiveModal(null); setViewingTurma(null); }} 
        title={`Alunos da Turma: ${viewingTurma?.nome}`}
      >
        <div className="p-8 space-y-6">
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {alunos.filter(a => a.turma === viewingTurma?.nome).length > 0 ? (
              alunos.filter(a => a.turma === viewingTurma?.nome).map((aluno: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-purple-50 bg-purple-50/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                      {aluno.nome?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{aluno.nome}</p>
                      <p className="text-[10px] text-purple-400 font-semibold uppercase">{aluno.status}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setViewingAluno(aluno);
                      setActiveModal('view_aluno');
                    }}
                    className="text-[10px] font-bold text-purple-600 bg-white px-3 py-1.5 rounded-lg border border-purple-100 hover:shadow-sm transition-all"
                  >
                    Ver Ficha
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-purple-300 italic">Nenhum aluno matriculado nesta turma.</p>
              </div>
            )}
          </div>
          <div className="flex justify-end pt-4 border-t border-purple-50">
            <button onClick={() => { setActiveModal(null); setViewingTurma(null); }} className="px-6 py-3 font-bold text-purple-600 bg-purple-100 hover:bg-purple-200 rounded-xl transition-colors">Fechar</button>
          </div>
        </div>
      </Modal>

      {/* MODAL DE CHAMADA */}
      <Modal 
        isOpen={!!activeAttendanceTurma} 
        onClose={() => { setActiveAttendanceTurma(null); setChamadaData({}); }} 
        title={`Chamada: ${activeAttendanceTurma?.nome}`}
      >
         <div className="p-8 space-y-8">
            <div className="bg-white p-6 rounded-[2.5rem] border border-purple-100 shadow-sm">
               <CustomDatePicker 
                  label="Dia da Aula"
                  value={attendanceDate}
                  onChange={(val) => setAttendanceDate(val)}
               />
            </div>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
               {alunos.filter(a => a.turma === activeAttendanceTurma?.nome).map((aluno, i) => {
                 const status = chamadaData[aluno.id] || 'presente';
                 return (
                  <div key={i} className="flex justify-between items-center p-5 bg-white border border-purple-50 rounded-2xl shadow-sm hover:shadow-md transition-all">
                     <p className="font-black text-sm">{aluno.nome}</p>
                     <div className="flex gap-2">
                        <button 
                          onClick={() => setChamadaData(prev => ({ ...prev, [aluno.id]: 'presente' }))}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${status === 'presente' ? 'bg-green-500 text-white shadow-lg' : 'bg-green-50 text-green-500'}`}
                        >
                          PRESENTE
                        </button>
                        <button 
                          onClick={() => setChamadaData(prev => ({ ...prev, [aluno.id]: 'falta' }))}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${status === 'falta' ? 'bg-red-500 text-white shadow-lg' : 'bg-red-50 text-red-500'}`}
                        >
                          FALTA
                        </button>
                     </div>
                  </div>
               )})}
            </div>
            <button 
              onClick={async () => {
                const alunosTurma = alunos.filter(a => a.turma === activeAttendanceTurma?.nome);
                const listaChamada = alunosTurma.map(aluno => ({
                  aluno_id: aluno.id,
                  turma_id: activeAttendanceTurma.id,
                  data: attendanceDate,
                  status: chamadaData[aluno.id] || 'presente'
                }));

                await registrarFrequencia(listaChamada);
                addToast('✅ Chamada registrada com sucesso!');
                setActiveAttendanceTurma(null);
                setChamadaData({});
              }} 
              className="w-full py-5 bg-purple-600 text-white rounded-3xl font-black shadow-xl hover:bg-purple-700 transition-all"
            >
              Finalizar Chamada
            </button>
         </div>
      </Modal>

      {/* MODAL DE ALERTA */}
      <Modal 
        isOpen={!!alertData} 
        onClose={() => setAlertData(null)} 
        title={alertData?.title || "Aviso"}
      >
        <div className="p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-bold text-gray-900">{alertData?.title}</h4>
            <p className="text-gray-500 font-medium leading-relaxed">{alertData?.message}</p>
          </div>
          <button 
            onClick={() => setAlertData(null)} 
            className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200"
          >
            Entendido
          </button>
        </div>
      </Modal>
    </motion.section>
  );
};
