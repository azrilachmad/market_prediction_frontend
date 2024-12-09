// src/contexts/UserContext.js
import { createContext } from "react";

// Create a context for user data
export const DataContext = createContext(null);  // Default value is `null`
// You can also initialize it with an empty object if you prefer:
// export const DataContext = createContext({});