import React , { useContext, useEffect, useState } from "react";

const AuthContext = React.createContext({});


export const AuthProvider = ({ children }) => {
  
  const [auth, setAuth] = useState({});

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context==null){
    throw new Error("useAuth most be used inside of an AuthProvider")
  }

  return context 
}