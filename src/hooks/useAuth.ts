import { useState, useEffect } from 'react';
import { ConectorSupabase } from '../supabase/ConectorSupabase';

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('carregando...');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isRecoveringSession, setIsRecoveringSession] = useState(false);
  const [showConfirmationScreen, setShowConfirmationScreen] = useState(false);

  useEffect(() => {
    // Sincroniza a sessão do Supabase com o estado local
    ConectorSupabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsLoggedIn(true);
        setUserEmail(session.user.email || 'Admin');
      }
    });

    // Detectar fluxo de recuperação pela URL antes do evento disparar
    if (window.location.hash.includes('type=recovery')) {
      setIsRecoveringSession(true);
    }

    const { data: { subscription } } = ConectorSupabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecoveringSession(true);
      }
      
      if (session) {
        setIsLoggedIn(true);
        setUserEmail(session.user.email || 'Admin');
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await ConectorSupabase.auth.signOut();
    setIsLoggedIn(false);
  };

  return {
    isLoggedIn,
    setIsLoggedIn,
    isRecoveringSession,
    userEmail,
    authError,
    setAuthError,
    showConfirmationScreen,
    setShowConfirmationScreen,
    handleLogout,
  };
}
