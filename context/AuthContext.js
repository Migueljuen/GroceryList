// AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { auth, onAuthStateChanged } from "../firebase/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const USE_DUMMY = false;  

  useEffect(() => {
    if (USE_DUMMY) {
      setUser({
        displayName: "Maedein",
        email: "miguel@example.com",
      });
      return;
    }

    // Use the modular onAuthStateChanged
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          email: firebaseUser.email,
        });
      } else {
        setUser(null);
      }
    });

    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}