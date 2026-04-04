import React from 'react';
import { motion } from 'motion/react';
import { MessageCircle, Check } from 'lucide-react';

interface FinanceiroProps {
  mensalidades: any[];
  alunos: any[];
  configs: any;
  updateMensalidadeStatus: (id: string, status: string) => void;
  addToast: (msg: string) => void;
  formatMoney: (val: number) => string;
  saldoTotal: number;
  pendentesR: number;
}

export const Financeiro = ({ 
  mensalidades, alunos, configs, updateMensalidadeStatus, addToast, formatMoney, saldoTotal, pendentesR 
}: FinanceiroProps) => {
  return (
    <motion.section 
      key="financeiro"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-10"
    >
      <div>
        <h2 className="text-3xl font-bold mb-2">Gestão Financeira</h2>
        <p className="text-purple-400 text-sm">Controle de entradas e mensalidades em aberto</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-red-50 border border-red-100 p-6 rounded-2xl">
          <span className="text-[10px] font-bold uppercase text-red-400">Total Pendente</span>
          <h3 className="text-3xl font-black text-red-600">{formatMoney(pendentesR)}</h3>
        </div>
        <div className="bg-green-50 border border-green-100 p-6 rounded-2xl">
          <span className="text-[10px] font-bold uppercase text-green-400">Total Recebido</span>
          <h3 className="text-3xl font-black text-green-600">{formatMoney(saldoTotal)}</h3>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          <h3 className="font-bold text-gray-700">Mensalidades Pendentes</h3>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-purple-50 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-purple-50/50 text-[10px] font-bold uppercase tracking-widest text-purple-400">
              <tr>
                <th className="px-6 py-4">Aluno / Turma</th>
                <th className="px-6 py-4">Valor</th>
                <th className="px-6 py-4">Vencimento</th>
                <th className="px-6 py-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-50">
              {mensalidades.filter(m => m.status === 'PENDENTE').length > 0 ? (
                mensalidades.filter(m => m.status === 'PENDENTE').map((pag: any, i: number) => (
                <tr key={i} className="hover:bg-purple-50/20 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold">{pag.nome}</p>
                    <p className="text-xs text-purple-400">{pag.curso}</p>
                  </td>
                  <td className="px-6 py-4 font-bold text-red-600">{pag.valor}</td>
                  <td className="px-6 py-4 text-sm text-purple-400 font-medium">{pag.data}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <button 
                        onClick={() => {
                          const alunoObj = alunos.find(a => a.nome === pag.nome);
                          const tel = alunoObj?.telefone_responsavel?.replace(/\D/g, '');
                          
                          if (!tel) {
                            addToast('☎️ Aluno sem telefone cadastrado!');
                            return;
                          }

                          const msg = encodeURIComponent(
                            `Olá, aqui é da *${configs?.unit_name || 'Escola'}*! 📚\n\n` +
                            `Lembramos que a mensalidade do(a) aluno(a) *${pag.nome}* ref. ao mês de *${pag.data.split('/')[1]}/${pag.data.split('/')[2]}* no valor de *${pag.valor}* ainda consta em aberto.\n\n` +
                            `Poderia nos enviar o comprovante assim que possível? Caso já tenha pago, favor desconsiderar. Obrigado! 🙏`
                          );
                          window.open(`https://wa.me/55${tel}?text=${msg}`, '_blank');
                        }}
                        className="p-4 bg-green-50 text-green-600 rounded-2xl hover:bg-green-100 transition-all group"
                        title="Notificar no WhatsApp"
                      >
                        <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </button>
                      <button 
                        onClick={() => {
                          updateMensalidadeStatus(pag.id, 'PAGO');
                          addToast(`Pagamento de ${pag.nome} recebido!`);
                        }}
                        className="bg-green-600 text-white px-6 py-4 rounded-2xl text-sm font-black shadow-lg shadow-green-100 hover:bg-green-700 hover:scale-105 transition-all transform flex items-center gap-3"
                      >
                        <Check className="w-5 h-5" /> Validar
                      </button>
                    </div>
                  </td>
                </tr>
              ))) : (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-purple-300 italic text-sm">Tudo em dia! Nenhuma mensalidade pendente.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-purple-50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <h3 className="font-bold text-gray-700">Pagamentos Recebidos</h3>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-purple-50 overflow-hidden opacity-90 transition-opacity">
          <table className="w-full text-left">
            <thead className="bg-zinc-50 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              <tr>
                <th className="px-6 py-4">Data do Recebimento</th>
                <th className="px-6 py-4">Aluno</th>
                <th className="px-6 py-4">Valor Líquido</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-50">
              {mensalidades.filter(m => m.status === 'PAGO').length > 0 ? (
                mensalidades.filter(m => m.status === 'PAGO').map((pag: any, i: number) => (
                <tr key={i} className="hover:bg-green-50/10 transition-colors">
                  <td className="px-6 py-4 text-xs font-bold text-green-600">Recebido em {pag.data}</td>
                  <td className="px-6 py-4"><p className="text-sm font-bold opacity-70">{pag.nome}</p></td>
                  <td className="px-6 py-4 font-bold text-zinc-600">{pag.valor}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase border border-green-100">Compensado</span>
                  </td>
                </tr>
              ))) : (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-zinc-300 italic text-sm">Nenhum pagamento registrado no histórico.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.section>
  );
};
