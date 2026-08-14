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
  const [version, setVersion] = useState(0);

  useEffect(() => {
    console.log('🟢 DataProvider initializing...');
    try {
      initStorage();
      setIsReady(true);
      console.log('🟢 DataProvider ready!');
      const unsubscribe = subscribe(() => setVersion((v) => v + 1));
      return unsubscribe;
    } catch (err) {
      console.error('🔴 DataProvider initialization error:', err);
    }
  }, []);

  const resetDemoData = useCallback(() => {
    resetStorage();
    setVersion((v) => v + 1);
  }, []);

  const value = isReady ? {
    isReady,
    version,
    db,
    ...businessLogic,
    ...services,
    resetDemoData,
  } : null;

  // Always render children, even while initializing (context is just null temporarily)
  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

/**
 * Hook for accessing the data layer, e.g.:
 *   const { patientService, inventoryService, getLowStockDrugs } = useMediflowData();
 */
export function useMediflowData() {
  const context = useContext(DataContext);
  if (!context) {
    console.error('❌ useMediflowData: DataProvider context not ready or not wrapped!');
    throw new Error('useMediflowData must be used within a <DataProvider>. Make sure DataProvider wraps your entire app before Routes.');
  }
  console.log('✅ useMediflowData accessed successfully');
  return context;
}
