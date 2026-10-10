import { createContext, useContext, useEffect, type ReactNode } from 'react';
const Context = createContext({ paused: false });
export const useMotionPreference = () => useContext(Context);
export function MotionPreference({ children }: { children: ReactNode }) {
  // Motion always runs; there is no user-facing pause.
  const paused = false;
  useEffect(() => { document.documentElement.dataset.motion = 'running'; }, []);
  return <Context.Provider value={{ paused }}>{children}</Context.Provider>;
}
