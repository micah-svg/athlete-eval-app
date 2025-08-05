// src/context/GlobalContext.js
import { createContext } from 'react';

export const GlobalContext = createContext({
  orgId: '',
  evaluatorName: '',
  tryoutDate: ''
});
