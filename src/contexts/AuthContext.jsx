import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const STORAGE_KEY = 'QUIZ_USER';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { name: '', isLoggedIn: false };
  });

  const login = (name) => {
    const userData = { name, isLoggedIn: true };
    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  };

  const logout = () => {
    setUser({ name: '', isLoggedIn: false });
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('QUIZ_STATE');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
