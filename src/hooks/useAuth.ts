import { useState, useEffect } from 'react';
import { ConectorAPI, getToken, getStoredUser, removeToken } from '../api/ConectorAPI';

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('carregando...');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isRecoveringSession, setIsRecoveringSession] = useState(false);
  const [showConfirmationScreen, setShowConfirmationScreen] = useState(false);

  useEffect(() => {
    // Verificar se há sessão salva no localStorage
    const token = getToken();
    const user  = getStoredUser();

    if (token && user) {
      setIsLoggedIn(true);
      setUserEmail(user.email || 'Admin');
    } else {
      setIsLoggedIn(false);
      setUserEmail('');
    }
  }, []);

  const handleLogout = async () => {
    await ConectorAPI.auth.signOut();
    removeToken();
    setIsLoggedIn(false);
    setUserEmail('');
  };

  return {
    isLoggedIn,
    setIsLoggedIn,
    isRecoveringSession,
    userEmail,
    setUserEmail,
    authError,
    setAuthError,
    showConfirmationScreen,
    setShowConfirmationScreen,
    handleLogout,
  };
}
