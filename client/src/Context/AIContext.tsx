import {createContext, ReactNode, useContext} from "react";

interface AIContextProps {}

const AIContext = createContext<AIContextProps>({});

export default function AIContextProvider({children}: {children: ReactNode}) {
  return <AIContext.Provider value={{}}>{children}</AIContext.Provider>;
}

export const useAIContextHook = () => {
  return useContext(AIContext);
};
