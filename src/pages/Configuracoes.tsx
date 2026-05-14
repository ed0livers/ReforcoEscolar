import React from 'react';
import { motion } from 'motion/react';
import { Settings, Layers, Mail } from 'lucide-react';
import { ConectorAPI } from '../api/ConectorAPI';

interface ConfiguracoesProps {
  configs: any;
  salvarConfigs: (data: any) => Promise<void>;
  addToast: (msg: string) => void;
  userEmail: string;
}

export const Configuracoes = ({ configs, salvarConfigs, addToast, userEmail }: ConfiguracoesProps) => {
  return (
    <motion.section key="configs" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto space-y-6 py-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-2xl font-black">Central do Coordenador</h2>
          <p className="text-xs text-indigo-400 font-bold">Gerencie sua unidade e segurança de acesso.</p>
        </div>
        <Settings className="text-indigo-200 w-8 h-8" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* UNIDADE SETTINGS */}
        <div className="bg-white p-8 rounded-3xl border border-indigo-50 shadow-sm space-y-6">
          <h4 className="font-black text-sm text-indigo-900 flex items-center gap-2">
            <Layers className="w-4 h-4" /> Dados da Unidade
          </h4>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-indigo-300">Nome da Escola</label>
              <input id="cfg_name" type="text" defaultValue={configs?.unit_name} className="w-full p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl font-bold text-sm text-indigo-900 outline-none focus:ring-2 focus:ring-indigo-200" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-indigo-300">WhatsApp</label>
              <input placeholder="(00) 0 0000-0000" defaultValue={configs?.whatsapp} id="cfg_whatsapp" className="w-full p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl text-sm font-bold text-gray-500 outline-none" />
            </div>
            <button 
               onClick={async () => {
                 const n = (document.getElementById('cfg_name') as HTMLInputElement).value;
                 const w = (document.getElementById('cfg_whatsapp') as HTMLInputElement).value;
                 await salvarConfigs({ unit_name: n, whatsapp: w });
                 addToast('Unidade atualizada!');
               }}
               className="w-full py-3 bg-[#4f46e5] text-white rounded-xl font-black text-sm shadow-lg shadow-indigo-50 hover:bg-[#4338ca] transition-all"
             >
               Salvar Unidade
            </button>
          </div>
        </div>

        {/* ACESSO SETTINGS */}
        <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100 shadow-sm space-y-6">
          <h4 className="font-black text-sm text-zinc-900 flex items-center gap-2">
            <Mail className="w-4 h-4" /> Acesso e Segurança
          </h4>
          
          {/* EMAIL CHANGE FORM */}
          <form onSubmit={async (e) => {
            e.preventDefault();
            const form = e.target as any;
            const oldEmail = form.oldEmail.value;
            const oldPass = form.oldPass.value;
            const nEmail = form.nEmail.value;
            const nEmailConfirm = form.nEmailConfirm.value;

            if (nEmail !== nEmailConfirm) { alert("Os novos e-mails não coincidem!"); return; }
            if (oldEmail !== userEmail) { alert("E-mail atual incorreto!"); return; }

            const { error } = await ConectorAPI.auth.updateEmail({ currentPassword: oldPass, newEmail: nEmail });
            if (error) { alert(`Erro: ${error.message}`); }
            else { addToast("✅ E-mail atualizado com sucesso!"); form.reset(); }
          }} className="space-y-4 pb-6 border-b border-zinc-200">
            <p className="text-[10px] font-black uppercase text-zinc-400 border-b border-zinc-100 pb-2">Alterar E-mail Acadêmico</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input name="oldEmail" type="email" placeholder="E-mail Atual" className="w-full p-2.5 bg-white border border-zinc-200 rounded-xl text-[11px] font-bold outline-none" required />
              <input name="oldPass" type="password" placeholder="Senha Atual" className="w-full p-2.5 bg-white border border-zinc-200 rounded-xl text-[11px] font-bold outline-none" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input name="nEmail" type="email" placeholder="Novo E-mail" className="w-full p-2.5 bg-white border border-zinc-200 rounded-xl text-[11px] font-bold outline-none border-blue-100" required />
              <input name="nEmailConfirm" type="email" placeholder="Confirmar novo" className="w-full p-2.5 bg-white border border-zinc-200 rounded-xl text-[11px] font-bold outline-none border-blue-100" required />
            </div>
            <button type="submit" className="w-full py-2.5 bg-white text-zinc-900 border border-zinc-200 rounded-xl font-black text-xs hover:bg-zinc-100 transition-all">Alterar E-mail</button>
          </form>

          {/* PASSWORD CHANGE FORM */}
          <form onSubmit={async (e) => {
            e.preventDefault();
            const form = e.target as any;
            const curEmail = form.curEmail.value;
            const oldPass = form.oldPass.value;
            const nPass = form.nPass.value;
            const nPassConfirm = form.nPassConfirm.value;

            if (nPass !== nPassConfirm) { alert("As novas senhas não coincidem!"); return; }
            if (curEmail !== userEmail) { alert("E-mail incorreto!"); return; }
            if (nPass.length < 8 || !/[A-Z]/.test(nPass)) { alert("Nova senha deve ter 8+ chars e 1 Maiúscula!"); return; }

            const { error } = await ConectorAPI.auth.updatePassword({ currentPassword: oldPass, newPassword: nPass });
            if (error) { alert(`Erro: ${error.message}`); }
            else { addToast("✅ Senha alterada com segurança!"); form.reset(); }
          }} className="space-y-4">
            <p className="text-[10px] font-black uppercase text-zinc-400 border-b border-zinc-100 pb-2">Alterar Senha de Acesso</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input name="curEmail" type="email" placeholder="Seu E-mail" className="w-full p-2.5 bg-white border border-zinc-100 rounded-xl text-[11px] font-bold outline-none" required />
              <input name="oldPass" type="password" placeholder="Senha Atual" className="w-full p-2.5 bg-white border border-zinc-100 rounded-xl text-[11px] font-bold outline-none" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input name="nPass" type="password" placeholder="Nova Senha" className="w-full p-2.5 bg-indigo-50 border border-indigo-100 rounded-xl text-[11px] font-bold outline-none" required />
              <input name="nPassConfirm" type="password" placeholder="Confirmar Nova" className="w-full p-2.5 bg-indigo-50 border border-indigo-100 rounded-xl text-[11px] font-bold outline-none" required />
            </div>
            <button type="submit" className="w-full py-3 bg-zinc-900 text-white rounded-xl font-black text-sm hover:bg-black transition-all shadow-xl shadow-zinc-200">
              Atualizar Senha
            </button>
          </form>
        </div>
      </div>
    </motion.section>
  );
};
