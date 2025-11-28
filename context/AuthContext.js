// AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth } from "../firebase";  // your firebase setup

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const USE_DUMMY = true;  // ⬅️ switch this to false when using Firebase

  useEffect(() => {
    if (USE_DUMMY) {
      setUser({
        displayName: "Miguel",
        email: "miguel@example.com",
      });
      return;
    }

    // 👉 REAL Firebase usage later:
    // const unsub = onAuthStateChanged(auth, (firebaseUser) => {
    //   if (firebaseUser) {
    //     setUser({
    //       displayName: firebaseUser.displayName,
    //       email: firebaseUser.email,
    //     });
    //   } else {
    //     setUser(null);
    //   }
    // });

    // return unsub;
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
