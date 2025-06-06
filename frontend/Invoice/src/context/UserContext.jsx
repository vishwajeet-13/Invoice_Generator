import { createContext, useState, useContext, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  const isAuthenticated = !!user;

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const parsedUser = savedUser && savedUser !== "undefined" ? JSON.parse(savedUser) : null;
    setUser(parsedUser);
    setLoading(false); 
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isAuthenticated, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
