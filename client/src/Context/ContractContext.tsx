import {createContext, ReactNode, useContext} from "react";

interface ContractFunctionContextProps {}

const ContractFunctionContext = createContext<ContractFunctionContextProps>({});
export default function ContractFunctionContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ContractFunctionContext.Provider value={{}}>
      {children}
    </ContractFunctionContext.Provider>
  );
}
