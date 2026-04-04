import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { CustomDatePicker } from '../components/common/CustomDatePicker';
import { ConectorSupabase } from '../supabase/ConectorSupabase';

interface LoginPageProps {
  authError: string | null;
  setAuthError: (error: string | null) => void;
  showConfirmationScreen: boolean;
  setShowConfirmationScreen: (show: boolean) => void;
  setIsLoggedIn: (loggedIn: boolean) => void;
  addToast: (msg: string) => void;
}

export const LoginPage = ({ 
  authError, setAuthError, showConfirmationScreen, 
  setShowConfirmationScreen, setIsLoggedIn, addToast 
}: LoginPageProps) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  const [authForm, setAuthForm] = useState({ birthDate: '' });

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    if (isRegistering) {
      const name = (form.elements.namedItem('name') as HTMLInputElement).value;
      const birthDateVal = authForm.birthDate;
      const confirmPassword = (form.elements.namedItem('confirmPassword') as HTMLInputElement).value;

      // VALIDAR FORMATO DE E-MAIL
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setAuthError('Por favor, insira um e-mail válido.');
        return;
      }

      // VALIDAR SE É MAIOR DE IDADE (18+)
      const birthDate = new Date(birthDateVal);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 18) {
        setAuthError('Ops! Você precisa ter pelo menos 18 anos para gerenciar uma unidade de reforço.');
        return;
      }

      // VALIDAÇÕES DE SENHA
      if (password !== confirmPassword) {
        setAuthError('As senhas não coincidem! Verifique e tente novamente.');
        return;
      }

      const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
      if (!passwordRegex.test(password)) {
        setAuthError('Sua senha é fraca! Use pelo menos 8 caracteres, 1 letra maiúscula e 1 símbolo (ex: @, #, $).');
        return;
      }

      const { data, error } = await ConectorSupabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: name,
            birth_date: birthDateVal,
            app_name: 'Thais e Talita Educacional'
          }
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          setAuthError('Este e-mail já está cadastrado em nossa base. Faça login ou recupere sua senha.');
        } else {
          setAuthError(error.message);
        }
      } else if (data?.user?.identities?.length === 0) {
        setAuthError('Este e-mail já possui uma conta ativa. Tente fazer login.');
      } else {
        setShowConfirmationScreen(true);
        setIsRegistering(false); 
      }
    } else {
      const { error } = await ConectorSupabase.auth.signInWithPassword({ email, password });
      if (error) {
        setAuthError('E-mail ou senha incorretos.');
      } else {
        addToast('Acesso concedido!');
        setIsLoggedIn(true);
      }
    }
  };

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    
    const { error } = await ConectorSupabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    });
    
    if (error) {
      setAuthError(error.message);
    } else {
      addToast('✅ E-mail de recuperação enviado! Verifique sua caixa de entrada.');
      setIsRecovering(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-[#feebff] to-[#fff3fd] flex items-center justify-center p-6 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[1100px] grid md:grid-cols-2 bg-white rounded-[2rem] overflow-hidden shadow-2xl relative"
      >
        <div className="hidden md:flex flex-col justify-between p-12 bg-purple-50">
          <div>
            <h1 className="text-5xl font-extrabold leading-tight tracking-tighter mb-6">
              Excelência na <br /><span className="text-[#8126cf]">Educação</span> para todos.
            </h1>
            <p className="text-[#6e5177] text-lg">Faça parte da nossa rede de ensino e transforme a experiência de aprendizagem.</p>
          </div>
          <img 
            src="/logo.png" 
            className="w-full rounded-2xl shadow-xl -rotate-2 object-cover h-80 border-4 border-white" 
            alt="Thais e Talita Educacional" 
          />
        </div>
        <div className="p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-8">
            {isRecovering ? 'Recuperar Senha' : isRegistering ? 'Criar Nova Conta' : 'Acessar Conta'}
          </h2>
          
          {authError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm font-bold text-red-600">{authError}</p>
            </div>
          )}

          {showConfirmationScreen ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Verifique seu E-mail!</h3>
              <p className="text-[#6e5177] leading-relaxed">
                Enviamos um link de confirmação para sua caixa de entrada. <br />
                <strong>Por favor, clique no link para ativar sua conta</strong> e começar a usar o sistema.
              </p>
              <div className="pt-6">
                <button 
                  onClick={() => setShowConfirmationScreen(false)}
                  className="w-full bg-[#8126cf] text-white py-4 rounded-xl font-bold shadow-lg hover:bg-[#6b1ead] transition-all"
                >
                  Voltar para o Login
                </button>
              </div>
            </motion.div>
          ) : isRecovering ? (
            <form onSubmit={handleRecover} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#6e5177] mb-2">E-mail Cadastrado</label>
                <input 
                  name="email"
                  type="email" 
                  placeholder="seu@email.com" 
                  className="w-full p-3 border border-purple-100 rounded-xl outline-none focus:ring-2 focus:ring-purple-200 transition-all" 
                  required 
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-[#8126cf] text-white py-4 rounded-xl font-bold shadow-lg hover:bg-[#6b1ead] transition-all active:scale-[0.98]"
              >
                Enviar link de recuperação
              </button>
            </form>
          ) : (
            <form onSubmit={handleAuth} className="space-y-4">
               {isRegistering && (
                <div className="grid grid-cols-1 gap-4">
                  <div className="col-span-1">
                    <label className="block text-xs font-bold uppercase text-[#6e5177] mb-2">Nome Completo</label>
                    <input name="name" type="text" placeholder="Seu nome" className="w-full p-3 border border-purple-100 rounded-xl outline-none focus:ring-2 focus:ring-purple-200 transition-all font-bold text-purple-900" required />
                  </div>
                  <div className="col-span-1">
                    <CustomDatePicker 
                      label="Data de Nascimento"
                      value={authForm.birthDate}
                      onChange={(val) => setAuthForm(prev => ({...prev, birthDate: val}))}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase text-[#6e5177] mb-2">E-mail</label>
                <input 
                  name="email"
                  type="email" 
                  placeholder="seu@email.com" 
                  className="w-full p-3 border border-purple-100 rounded-xl outline-none focus:ring-2 focus:ring-purple-200 transition-all" 
                  required 
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold uppercase text-[#6e5177]">Senha</label>
                  {!isRegistering && (
                    <button 
                      type="button" 
                      onClick={() => { setIsRecovering(true); setAuthError(null); }}
                      className="text-[10px] uppercase font-bold text-[#8126cf] hover:underline"
                    >
                      Esqueci minha senha
                    </button>
                  )}
                </div>
                <input 
                  name="password"
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full p-3 border border-purple-100 rounded-xl outline-none focus:ring-2 focus:ring-purple-200 transition-all" 
                  required 
                />
                {isRegistering && (
                  <p className="text-[10px] text-purple-400 mt-1 font-medium">8+ caractere, 1 maiúscula, 1 símbolo (@, #, $...)</p>
                )}
              </div>

              {isRegistering && (
                <div>
                  <label className="block text-xs font-bold uppercase text-[#6e5177] mb-2">Confirmar Senha</label>
                  <input 
                    name="confirmPassword"
                    type="password" 
                    placeholder="••••••••" 
                    className="w-full p-3 border border-purple-100 rounded-xl outline-none focus:ring-2 focus:ring-purple-200 transition-all" 
                    required 
                  />
                </div>
              )}

              <button 
                type="submit" 
                className="w-full bg-[#8126cf] text-white py-4 rounded-xl font-bold shadow-lg hover:bg-[#6b1ead] transition-all active:scale-[0.98]"
              >
                {isRegistering ? 'Cadastrar Minha Conta' : 'Entrar no Sistema'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <button 
              onClick={() => { setIsRegistering(!isRegistering); setIsRecovering(false); setAuthError(null); }}
              className="text-sm text-[#8126cf] font-bold hover:underline"
            >
              {isRegistering ? 'Já tem uma conta? Faça login' : 'Ainda não tem conta? Registre-se aqui'}
            </button>
          </div>
          {isRecovering && (
            <div className="mt-4 text-center">
              <button 
                onClick={() => { setIsRecovering(false); setAuthError(null); }}
                className="text-sm text-gray-500 font-bold hover:underline"
              >
                Voltar para o Login
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
