// State and Logic Layer (§7.2): "React Context provides a shared
// application state accessible to any component without prop drilling."
//
// This provider seeds localStorage on first mount, then exposes `db` (raw
// table access), every businessLogic function, and every domain service to
// components via useMediflowData(). It subscribes to changeEmitter so any
// write — whether made through db.<table> directly or through a service —
// triggers a re-render, without DataContext needing to know about every
// possible write path itself.

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { initStorage, resetStorage } from '../data/storage.js';
import { db } from '../data/repositories.js';
import { subscribe } from '../data/changeEmitter.js';
import * as businessLogic from '../data/businessLogic.js';
import * as services from '../services/index.js';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [isReady, setIsReady] = useState(false);
  // Bumped on every write (see changeEmitter.js). Components that read from
  // context re-render because this value is part of the context object,
  // even though the actual data lives in localStorage, not React state.
  const [version, setVersion] = useState(0);

  useEffect(() => {
    initStorage();
    setIsReady(true);
    const unsubscribe = subscribe(() => setVersion((v) => v + 1));
    return unsubscribe;
  }, []);

  const resetDemoData = useCallback(() => {
    resetStorage();
    setVersion((v) => v + 1);
  }, []);

  const value = {
    isReady,
    version,
    db,
    ...businessLogic,
    ...services,
    resetDemoData,
  };

  if (!isReady) return null;

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

/**
 * Hook for accessing the data layer, e.g.:
 *   const { patientService, inventoryService, getLowStockDrugs } = useMediflowData();
 */
export function useMediflowData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useMediflowData must be used within a <DataProvider>');
  }
  return context;
}
