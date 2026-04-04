/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  LayoutDashboard,
  Users, 
  GraduationCap, 
  BookOpen, 
  CircleDollarSign, 
  Layers,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

// Supabase & Hooks
import { useSincronizador, SyncStatusUI } from './supabase/SincronizadorDeDados';
import { ConectorSupabase } from './supabase/ConectorSupabase';
import { useAuth } from './hooks/useAuth';

// Components
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Modal } from './components/common/Modal';
import { Toast } from './components/common/Toast';

// Pages
import { LoginPage } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Alunos } from './pages/Alunos';
import { Professores } from './pages/Professores';
import { Turmas } from './pages/Turmas';
import { Materiais } from './pages/Materiais';
import { Financeiro } from './pages/Financeiro';
import { Configuracoes } from './pages/Configuracoes';
import { ResetPassword } from './pages/ResetPassword';

interface ToastData {
  id: number;
  message: string;
  type: 'success' | 'info';
}

export default function App() {
  const auth = useAuth();
  const { 
    isSyncing, connectionError, sincronizar, 
    alunos, professores, materiais, mensalidades, turmas, configs,
    addAluno, updateAluno, deleteAluno, addProfessor, updateProfessor, deleteProfessor, 
    addMaterial, updateMensalidadeStatus, addTurma, updateTurma, deleteTurma, 
    registrarFrequencia, salvarConfigs
  } = useSincronizador();

  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [editingAluno, setEditingAluno] = useState<any>(null);
  const [viewingAluno, setViewingAluno] = useState<any>(null);
  const [editingProfessor, setEditingProfessor] = useState<any>(null);
  const [editingTurma, setEditingTurma] = useState<any>(null);
  const [viewingTurma, setViewingTurma] = useState<any>(null);
  const [activeAttendanceTurma, setActiveAttendanceTurma] = useState<any>(null);
  const [alertData, setAlertData] = useState<{title: string, message: string} | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const currentSection = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/reset-password' ? 'dashboard' : location.pathname.substring(1);

  const addToast = (message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type: 'success' }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const navItems = [
    { id: 'dashboard', path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'alunos', path: '/alunos', label: 'Alunos', icon: Users },
    { id: 'professores', path: '/professores', label: 'Professores', icon: GraduationCap },
    { id: 'turmas', path: '/turmas', label: 'Turmas', icon: Layers },
    { id: 'materiais', path: '/materiais', label: 'Materiais', icon: BookOpen },
    { id: 'financeiro', path: '/financeiro', label: 'Financeiro', icon: CircleDollarSign },
  ];

  const parseCurrency = (val: string) => Number(val.replace(/[^\d]/g, '')) / 100 || 0;
  const saldoTotal = mensalidades.filter(m => m.status === 'PAGO').reduce((acc, m) => acc + parseCurrency(m.valor), 0);
  const pendentesR = mensalidades.filter(m => m.status === 'PENDENTE').reduce((acc, m) => acc + parseCurrency(m.valor), 0);
  const formatMoney = (val: number) => `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

  // Public Routes (No session needed)
  if ((!auth.isLoggedIn && !showResetModal) || auth.isRecoveringSession) {
    if (location.pathname === '/reset-password' || auth.isRecoveringSession) {
      return (
        <Routes>
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<Navigate to="/reset-password" replace />} />
        </Routes>
      );
    }

    if (location.pathname !== '/login') {
      return <Navigate to="/login" replace />;
    }

    return (
      <LoginPage 
        authError={auth.authError}
        setAuthError={auth.setAuthError}
        showConfirmationScreen={auth.showConfirmationScreen}
        setShowConfirmationScreen={auth.setShowConfirmationScreen}
        setIsLoggedIn={() => {}} 
        addToast={addToast}
      />
    );
  }

  return (
    <div className="flex h-screen font-sans text-[#3e2548] overflow-hidden">
      <SyncStatusUI isSyncing={isSyncing} connectionError={connectionError} sincronizar={sincronizar} />
      
      <Sidebar 
        navItems={navItems} 
        currentSection={currentSection} 
        unitName={configs?.unit_name}
        handleLogout={() => { auth.handleLogout(); navigate('/login'); }}
      />

      <main className="flex-1 flex flex-col overflow-y-auto bg-white">
        <Header 
          title={navItems.find(i => i.id === currentSection)?.label || 'Escola'} 
          userEmail={auth.userEmail} 
        />

        <div className="p-8">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={
                <Dashboard 
                  stats={{ qAlunos: alunos.length, qTurmas: turmas.length, qMateriais: materiais.length, pendentesR }}
                  saldoTotal={saldoTotal}
                  unitName={configs?.unit_name}
                  formatMoney={formatMoney}
                />
              } />
              <Route path="/alunos" element={
                <Alunos 
                  alunos={alunos}
                  turmas={turmas}
                  activeModal={activeModal}
                  setActiveModal={setActiveModal}
                  editingAluno={editingAluno}
                  setEditingAluno={setEditingAluno}
                  viewingAluno={viewingAluno}
                  setViewingAluno={setViewingAluno}
                  deleteAluno={deleteAluno}
                  addAluno={addAluno}
                  updateAluno={updateAluno}
                  addToast={addToast}
                />
              } />
              <Route path="/professores" element={
                <Professores 
                  professores={professores}
                  activeModal={activeModal}
                  setActiveModal={setActiveModal}
                  editingProfessor={editingProfessor}
                  setEditingProfessor={setEditingProfessor}
                  deleteProfessor={deleteProfessor}
                  addProfessor={addProfessor}
                  updateProfessor={updateProfessor}
                  addToast={addToast}
                />
              } />
              <Route path="/turmas" element={
                <Turmas 
                  turmas={turmas}
                  alunos={alunos}
                  activeModal={activeModal}
                  setActiveModal={setActiveModal}
                  editingTurma={editingTurma}
                  setEditingTurma={setEditingTurma}
                  viewingTurma={viewingTurma}
                  setViewingTurma={setViewingTurma}
                  activeAttendanceTurma={activeAttendanceTurma}
                  setActiveAttendanceTurma={setActiveAttendanceTurma}
                  deleteTurma={deleteTurma}
                  addTurma={addTurma}
                  updateTurma={updateTurma}
                  registrarFrequencia={registrarFrequencia}
                  addToast={addToast}
                  alertData={alertData}
                  setAlertData={setAlertData}
                  setViewingAluno={setViewingAluno}
                />
              } />
              <Route path="/materiais" element={
                <Materiais 
                  materiais={materiais}
                  activeModal={activeModal}
                  setActiveModal={setActiveModal}
                  addMaterial={addMaterial}
                  addToast={addToast}
                  userEmail={auth.userEmail}
                />
              } />
              <Route path="/financeiro" element={
                <Financeiro 
                  mensalidades={mensalidades}
                  alunos={alunos}
                  configs={configs}
                  updateMensalidadeStatus={updateMensalidadeStatus}
                  addToast={addToast}
                  formatMoney={formatMoney}
                  saldoTotal={saldoTotal}
                  pendentesR={pendentesR}
                />
              } />
              <Route path="/configuracoes" element={
                <Configuracoes 
                  configs={configs}
                  salvarConfigs={salvarConfigs}
                  addToast={addToast}
                  userEmail={auth.userEmail}
                />
              } />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </div>
      </main>

      {/* Redefinição de Senha (Global - Para usuários já logados que esqueceram ou querem mudar) */}
      <Modal 
        isOpen={showResetModal} 
        onClose={() => setShowResetModal(false)} 
        title="Redefinir Senha"
      >
        <form 
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.target as any;
            const newPassword = form.newPassword.value;
            const { error } = await ConectorSupabase.auth.updateUser({ password: newPassword });
            if (error) {
              addToast(`Erro ao redefinir: ${error.message}`);
            } else {
              addToast('✅ Senha redefinida com sucesso!');
              setShowResetModal(false);
            }
          }} 
          className="p-8 space-y-6"
        >
          <div className="bg-purple-50 p-4 rounded-xl mb-4">
            <p className="text-sm text-purple-900 font-bold">Digite a sua nova senha e clique em salvar.</p>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-purple-400 mb-2">Nova Senha</label>
            <input name="newPassword" type="password" minLength={8} placeholder="••••••••" className="w-full p-3 bg-purple-50/30 border border-purple-100 rounded-xl outline-none focus:ring-2 focus:ring-purple-200 transition-all font-bold" required />
          </div>
          <div className="flex gap-4 justify-end pt-4">
            <button type="button" onClick={() => setShowResetModal(false)} className="px-6 py-3 font-bold text-purple-400 hover:text-purple-600 transition-colors">Cancelar</button>
            <button type="submit" className="bg-[#8126cf] text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-purple-200 hover:bg-[#6b1ead] transition-all">Salvar Nova Senha</button>
          </div>
        </form>
      </Modal>

      <AnimatePresence>
        {toasts.map(toast => (
          <Toast key={toast.id} message={toast.message} onClose={() => {}} />
        ))}
      </AnimatePresence>
    </div>
  );
}
