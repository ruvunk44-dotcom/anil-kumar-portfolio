import { createContext, useContext } from 'react';
export const ResumeCtx = createContext<() => void>(() => {});
export const useResume = () => useContext(ResumeCtx);
