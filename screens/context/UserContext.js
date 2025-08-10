import React, { createContext, useContext, useState } from "react";

// Create the context
const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
  const [user_id, setUserId] = useState(null); // default to null

  return (
    <UserContext.Provider value={{ user_id, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the context
export const useUserContext = () => useContext(UserContext);
