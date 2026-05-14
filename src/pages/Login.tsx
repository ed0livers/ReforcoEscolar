import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { CustomDatePicker } from '../components/common/CustomDatePicker';
import { ConectorAPI } from '../api/ConectorAPI';

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
  const [isLoading, setIsLoading] = useState(false);
  const [recoverySuccess, setRecoverySuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    setIsLoading(true);
    try {
      if (isRegistering) {
        const nome = (form.elements.namedItem('name') as HTMLInputElement).value;
        const birthDateVal = authForm.birthDate;
        const confirmPassword = (form.elements.namedItem('confirmPassword') as HTMLInputElement).value;

        // VALIDAR FORMATO DE E-MAIL
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          setAuthError('Por favor, insira um e-mail válido.');
          setIsLoading(false);
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
          setIsLoading(false);
          return;
        }

        // VALIDAÇÕES DE SENHA
        if (password !== confirmPassword) {
          setAuthError('As senhas não coincidem! Verifique e tente novamente.');
          setIsLoading(false);
          return;
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
        if (!passwordRegex.test(password)) {
          setAuthError('Sua senha é fraca! Use pelo menos 8 caracteres, 1 letra maiúscula e 1 símbolo (ex: @, #, $).');
          setIsLoading(false);
          return;
        }

        const { data, error } = await ConectorAPI.auth.signUp({
          email,
          password,
          nome,
          data_nasc: birthDateVal,
        });

        if (error) {
          if (error.message.includes('já está cadastrado')) {
            setAuthError('Este e-mail já está cadastrado em nossa base. Faça login ou recupere sua senha.');
          } else {
            setAuthError(error.message);
          }
        } else if (data) {
          setIsLoggedIn(true);
          addToast('✅ Conta criada com sucesso! Bem-vindo(a)!');
        }
      } else {
        const { error } = await ConectorAPI.auth.signInWithPassword({ email, password });
        if (error) {
          setAuthError('E-mail ou senha incorretos.');
        } else {
          addToast('Acesso concedido!');
          setIsLoggedIn(true);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoading(true);
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;

    try {
      const result = await ConectorAPI.auth.resetPasswordForEmail(email);
      const error = (result as any).error;
      const data = (result as any).data;
      
      if (error) {
        setAuthError(error.message);
      } else {
        setRecoverySuccess(email);
        addToast('✅ E-mail de recuperação enviado!');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-[#eef2ff] to-[#f5f7ff] flex items-center justify-center p-6 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[1000px] grid md:grid-cols-2 bg-white rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative"
      >
        <div className="hidden md:flex flex-col justify-center p-16 bg-[#1e1b4b] text-white relative overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-[#4f46e5] rounded-full blur-[100px] opacity-20"></div>
          <div className="relative z-10 space-y-12">
            <div>
              <h1 className="text-5xl font-black leading-[1.1] tracking-tighter mb-6">
                Excelência na <br /><span className="text-[#a5b4fc]">Educação</span> <br />para todos.
              </h1>
              <p className="text-indigo-200 text-lg leading-relaxed max-w-sm">Faça parte da nossa rede de ensino e transforme a experiência de aprendizagem.</p>
            </div>
            
            <div className="logo-container scale-125 origin-left">
              <div className="logo-icon">
                <div className="circle">
                  <span className="plus-badge">+</span>
                </div>
              </div>
              <div className="logo-text">
                <h1>
                  <span className="edu-text">Edu</span><span className="gest-text">Gest</span><span className="plus-accent">+</span>
                </h1>
                <div className="logo-line"></div>
                <p className="logo-tagline uppercase">Educação • Gestão • Inovação</p>
              </div>
            </div>
          </div>
        </div>
        <div className="p-16 flex flex-col justify-center">
          <div className="logo-container mb-10 opacity-90 scale-90 origin-left md:hidden">
            <div className="logo-icon">
              <div className="circle !w-12 !h-12 after:!text-xl">
                <span className="plus-badge !w-5 !h-5 !text-xs !-top-1 !-right-1">+</span>
              </div>
            </div>
            <div className="logo-text">
              <h1 className="!text-xl !text-[#1e1b4b]">
                <span className="!text-[#4f46e5]">Edu</span><span className="!text-[#8ea2ff]">Gest</span><span className="plus-accent">+</span>
              </h1>
            </div>
          </div>
          
          <h2 className="text-3xl font-black text-[#1e1b4b] mb-2">
            {recoverySuccess ? 'E-mail Enviado!' : isRecovering ? 'Recuperar Senha' : isRegistering ? 'Criar Nova Conta' : 'Boas-vindas!'}
          </h2>
          <p className="text-indigo-900/50 text-sm font-bold mb-8">
            {isRegistering ? 'Preencha os dados para se cadastrar' : 'Entre com suas credenciais para acessar'}
          </p>

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
              <h3 className="text-2xl font-bold text-gray-800">Conta criada!</h3>
              <p className="text-[#6e5177] leading-relaxed">
                Sua conta foi criada com sucesso.<br />
                <strong>Você já pode fazer login no sistema.</strong>
              </p>
              <div className="pt-6">
                <button
                  onClick={() => setShowConfirmationScreen(false)}
                  className="w-full bg-[#4f46e5] text-white py-4 rounded-xl font-bold shadow-lg hover:bg-[#1e1b4b] transition-all"
                >
                  Fazer Login
                </button>
              </div>
            </motion.div>
          ) : recoverySuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Verifique seu e-mail</h3>
              <p className="text-[#6e5177] leading-relaxed">
                Encontramos sua conta! Um link de recuperação foi enviado para:<br />
                <strong className="text-[#4f46e5]">{recoverySuccess}</strong>
              </p>
              <div className="pt-6">
                <button
                  onClick={() => { setRecoverySuccess(null); setIsRecovering(false); }}
                  className="w-full bg-[#4f46e5] text-white py-4 rounded-xl font-bold shadow-lg hover:bg-[#1e1b4b] transition-all"
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
                  className="w-full p-3 border border-[#e0e7ff] rounded-xl outline-none focus:ring-2 focus:ring-[#bfdbfe] transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#4f46e5] text-white py-4 rounded-xl font-bold shadow-lg hover:bg-[#1e1b4b] transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Enviando...' : 'Recuperar Senha'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleAuth} className="space-y-4">
               {isRegistering && (
                <div className="grid grid-cols-1 gap-4">
                  <div className="col-span-1">
                    <label className="block text-xs font-bold uppercase text-[#6e5177] mb-2">Nome Completo</label>
                    <input name="name" type="text" placeholder="Seu nome" className="w-full p-3 border border-[#e0e7ff] rounded-xl outline-none focus:ring-2 focus:ring-[#bfdbfe] transition-all font-bold text-blue-900" required />
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
                  className="w-full p-3 border border-[#e0e7ff] rounded-xl outline-none focus:ring-2 focus:ring-[#bfdbfe] transition-all"
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
                      className="text-[10px] uppercase font-bold text-[#4f46e5] hover:underline"
                    >
                      Esqueci minha senha
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full p-3 pr-12 border border-[#e0e7ff] rounded-xl outline-none focus:ring-2 focus:ring-[#bfdbfe] transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-300 hover:text-indigo-500 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5 text-[#bfdbfe]" /> : <Eye className="w-5 h-5 text-[#bfdbfe]" />}
                  </button>
                </div>
                {isRegistering && (
                  <p className="text-[10px] text-indigo-400 mt-1 font-medium">8+ caractere, 1 maiúscula, 1 símbolo (@, #, $...)</p>
                )}
              </div>

              {isRegistering && (
                <div>
                  <label className="block text-xs font-bold uppercase text-[#6e5177] mb-2">Confirmar Senha</label>
                  <div className="relative">
                    <input
                      name="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="w-full p-3 pr-12 border border-indigo-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200 transition-all"
                      required
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#4f46e5] text-white py-4 rounded-xl font-bold shadow-lg hover:bg-[#1e1b4b] transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {isLoading ? 'Carregando...' : (isRegistering ? 'Cadastrar' : 'Entrar')}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => { setIsRegistering(!isRegistering); setIsRecovering(false); setAuthError(null); setRecoverySuccess(null); }}
              className="text-sm text-[#4f46e5] font-bold hover:underline"
            >
              {isRegistering ? 'Já tem uma conta? Faça login' : 'Ainda não tem conta? Registre-se aqui'}
            </button>
          </div>
          {isRecovering && (
            <div className="mt-4 text-center">
              <button
                onClick={() => { setIsRecovering(false); setAuthError(null); setRecoverySuccess(null); }}
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
