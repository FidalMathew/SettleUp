import {EIP1193Provider, useWallets} from "@privy-io/react-auth";
import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {
  createPublicClient,
  createWalletClient,
  custom,
  WalletClient,
} from "viem";
import {moonbaseAlpha} from "viem/chains";
import {settleUpABI} from "@/lib/abi/settleUpAbi";

interface ContractFunctionContextProps {
  createGroup?: () => void;
}

const ContractFunctionContext = createContext<ContractFunctionContextProps>({
  createGroup: () => {},
});
export default function ContractFunctionContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const CONTRACT_ADDRESS = "0xb3be431a0A1a4eD5c2a2B6ea240732908A9A0E22";
  const {wallets} = useWallets();

  const [provider, setProvider] = useState<EIP1193Provider>();

  useEffect(() => {
    if (wallets[0]) {
      (async function () {
        const provider = await wallets[0].getEthereumProvider();
        setProvider(provider);
      })();
    }
  }, [wallets]);

  const createGroup = async () => {
    try {
      const walletClient = createWalletClient({
        account: wallets[0].address as `0x${string}`,
        chain: moonbaseAlpha,
        transport: custom(provider!),
      });

      const publicClient = createPublicClient({
        chain: moonbaseAlpha,
        transport: custom(provider!),
      });

      const {request} = await publicClient.simulateContract({
        address: CONTRACT_ADDRESS,
        abi: settleUpABI,
        functionName: "createGroup",
        args: ["VIT"],
      });
      await walletClient.writeContract(request);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <ContractFunctionContext.Provider value={{createGroup}}>
      {children}
    </ContractFunctionContext.Provider>
  );
}

export function useContractFunctionContextHook() {
  return useContext(ContractFunctionContext);
}
