import React from 'react';
import { motion } from 'motion/react';
import { Plus, FileText, Download, Upload } from 'lucide-react';
import { Modal } from '../components/common/Modal';

interface MateriaisProps {
  materiais: any[];
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
  addMaterial: (data: any) => Promise<void>;
  addToast: (msg: string) => void;
  userEmail: string;
}

export const Materiais = ({ materiais, activeModal, setActiveModal, addMaterial, addToast, userEmail }: MateriaisProps) => {
  return (
    <motion.section 
      key="materiais"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold">Materiais de Apoio</h2>
          <p className="text-indigo-400 mt-2">Biblioteca central de conteúdos pedagógicos.</p>
        </div>
        <button onClick={() => setActiveModal('material')} className="bg-[#4f46e5] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#4338ca] transition-all">
          <Plus className="w-5 h-5" /> Novo Material
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {materiais.map((mat: any, i: number) => (
          <div key={i} className="bg-white rounded-2xl border border-indigo-50 overflow-hidden group hover:shadow-xl transition-all cursor-pointer">
            <div className="h-40 bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
              <FileText className="w-12 h-12 text-indigo-300" />
            </div>
            <div className="p-5">
              <span className="text-[10px] font-bold uppercase text-indigo-500 bg-indigo-50 px-2 py-1 rounded">{mat.type || 'Documento'}</span>
              <h4 className="font-bold mt-3 leading-tight group-hover:text-[#4f46e5] transition-colors line-clamp-1">{mat.titulo || mat.nome}</h4>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-xs text-indigo-400">{mat.autor || 'Admin'}</span>
                {mat.file_url && (
                  <a 
                    href={mat.file_url} 
                    target="_blank" 
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 bg-[#4f46e5] text-white rounded-lg hover:scale-110 transition-transform"
                    title="Abrir Documento"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
        {materiais.length === 0 && <p className="col-span-4 text-center text-indigo-400 py-10 font-bold">Nenhum material publicado ainda.</p>}
      </div>

      <Modal 
        isOpen={activeModal === 'material'} 
        onClose={() => setActiveModal(null)} 
        title="Upload de Material"
      >
        <form 
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.target as any;
            await addMaterial({
              titulo: form.titulo.value,
              tipo: form.type.value,
              file_url: form.file_url.value,
              autor: userEmail,
            });
            addToast('📚 Material registrado com sucesso!');
            setActiveModal(null);
          }} 
          className="p-8 space-y-6"
        >
          <div>
            <label className="block text-xs font-bold uppercase text-indigo-400 mb-2">Título do Material</label>
            <input name="titulo" type="text" placeholder="Ex: Apostila de Matemática" className="w-full p-3 bg-indigo-50/30 border border-indigo-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200 transition-all font-bold" required />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-indigo-400 mb-2">Categoria</label>
            <select name="type" className="w-full p-3 bg-indigo-50/30 border border-indigo-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200 transition-all font-bold">
              <option value="Geral">Geral</option>
              <option value="Português">Português</option>
              <option value="Matemática">Matemática</option>
              <option value="Física">Física</option>
              <option value="Química">Química</option>
              <option value="Exercício">Exercício</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase text-indigo-400">Anexo do Material (Link ou Arquivo)</label>
            <input 
              name="file_url" 
              type="text" 
              placeholder="Cole o link do PDF ou Nuvem aqui" 
              className="w-full p-3 bg-indigo-50/30 border border-indigo-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200 transition-all text-xs" 
            />
          </div>
          <div className="border-2 border-dashed border-indigo-100 rounded-2xl p-6 flex flex-col items-center justify-center bg-indigo-50/30 text-indigo-400 hover:bg-indigo-50 transition-colors">
            <Upload className="w-8 h-8 mb-2" />
            <p className="text-[10px] text-center font-bold">Você também pode colar o link do documento acima <br/> para acesso imediato da equipe.</p>
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all">Registrar Material</button>
        </form>
      </Modal>
    </motion.section>
  );
};
