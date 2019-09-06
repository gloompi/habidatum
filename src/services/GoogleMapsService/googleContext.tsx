import React, { FC, createContext, useContext } from 'react';
import { GoogleMapsSession } from './index';

const GoogleContext = createContext<GoogleMapsSession | null>(null);

interface IProviderProps {
  google: GoogleMapsSession;
}

export const GoogleProvider: FC<IProviderProps> = ({ children, google }) => (
  <GoogleContext.Provider value={google}>
    {children}
  </GoogleContext.Provider>
);

export const useGoogleSession = (): GoogleMapsSession => {
  const googleSession = useContext(GoogleContext);

  if (!googleSession) {
    throw new Error('You must render GoogleProvider higher up in the tree');
  }

  return googleSession;
};
