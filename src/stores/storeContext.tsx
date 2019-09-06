import React, { FC, createContext, useContext } from 'react';
import { RootStore } from './rootStore';

const StoreContext = createContext<RootStore | null>(null);

interface ProviderProps {
  rootStore: RootStore;
}

export const StoreProvider: FC<ProviderProps> = ({
  children,
  rootStore,
}) => {
  return (
    <StoreContext.Provider value={rootStore}>{children}</StoreContext.Provider>
  );
};

export function useStore(): RootStore {
  const store = useContext(StoreContext);

  if (!store) {
    throw new Error('You must render StoreProvider higher up in the tree');
  }

  return store;
}
