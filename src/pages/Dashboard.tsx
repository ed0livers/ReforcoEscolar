import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

interface DashboardProps {
  stats: {
    qAlunos: number;
    qTurmas: number;
    qMateriais: number;
    pendentesR: number;
  };
  saldoTotal: number;
  unitName?: string;
  formatMoney: (val: number) => string;
}

export const Dashboard = ({ stats, saldoTotal, unitName, formatMoney }: DashboardProps) => {
  const navigate = useNavigate();

  return (
    <motion.section key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="grid grid-grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Alunos', value: stats.qAlunos, sub: 'Matriculados' },
          { label: 'Turmas', value: stats.qTurmas, sub: 'Ativas' },
          { label: 'Materiais', value: stats.qMateriais, sub: 'Biblioteca' },
          { label: 'Pendente', value: formatMoney(stats.pendentesR), sub: 'A receber', color: 'text-red-500' }
        ].map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-purple-50 shadow-sm">
            <p className="text-[10px] font-black uppercase text-purple-300 mb-1">{s.label}</p>
            <h3 className={`text-2xl font-black ${s.color || ''}`}>{s.value}</h3>
            <p className="text-[10px] text-purple-200 font-bold">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-purple-50 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h4 className="font-black text-lg">Performance Financeira</h4>
              <p className="text-xs text-purple-300 font-bold">Resumo proporcional de recebimentos</p>
            </div>
            <TrendingUp className="text-purple-400 w-6 h-6" />
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { name: 'Jan', valor: 0.8 * saldoTotal },
                { name: 'Fev', valor: 0.9 * saldoTotal },
                { name: 'Mar', valor: saldoTotal },
              ]}>
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8126cf" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#8126cf" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#b08cc2', fontSize: 12}} />
                <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="valor" stroke="#8126cf" strokeWidth={3} fillOpacity={1} fill="url(#chartGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-purple-950 rounded-[2.5rem] p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-[-20px] right-[-20px] w-64 h-64 bg-purple-800 rounded-full blur-[80px] opacity-30"></div>
          <div className="relative z-10">
            <span className="bg-purple-600 px-3 py-1 rounded-full text-[10px] font-black uppercase mb-4 inline-block">Unidade: {unitName?.split(' ')[0] || 'Ativa'}</span>
            <h2 className="text-4xl font-black leading-none mb-6">Sua Escola <br /> Inteligente.</h2>
            <p className="text-purple-300 text-sm leading-relaxed mb-8">Gerencie alunos, frequências e finanças de forma integrada.</p>
          </div>
          <button onClick={() => navigate('/configuracoes')} className="bg-white text-purple-950 font-black py-4 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl relative z-10">Configurar Unidade</button>
        </div>
      </div>
    </motion.section>
  );
};
