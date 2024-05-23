import { EIP1193Provider, useWallets } from "@privy-io/react-auth";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import {
  createPublicClient,
  createWalletClient,
  custom,
  encodeFunctionData,
  WalletClient,
} from "viem";
import { moonbaseAlpha } from "viem/chains";
import { settleUpABI } from "@/lib/abi/settleUpAbi";
import { batchABI } from "@/lib/abi/batchABI";
import { getContract } from 'viem'



interface ContractFunctionContextProps {
  createGroup?: (args: any) => void;
  getContractInstance?: () => void;
  performBatchTransaction?: () => void;
}

const ContractFunctionContext = createContext<ContractFunctionContextProps>({
  createGroup: (args: any) => { },
  getContractInstance: () => { },
  performBatchTransaction: () => { },
});
export default function ContractFunctionContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const CONTRACT_ADDRESS = "0xb3be431a0A1a4eD5c2a2B6ea240732908A9A0E22";
  const { wallets } = useWallets();

  const [provider, setProvider] = useState<EIP1193Provider>();

  useEffect(() => {
    if (wallets[0]) {
      (async function () {
        const provider = await wallets[0].getEthereumProvider();
        setProvider(provider);
      })();
    }
  }, [wallets]);

  const createGroup = async (args: any) => {
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

      const { request } = await publicClient.simulateContract({
        address: CONTRACT_ADDRESS,
        abi: settleUpABI,
        functionName: "createGroup",
        args: args,
      });
      await walletClient.writeContract(request);
    } catch (err) {
      console.log(err);
    }
  };

  const getContractInstance = async (CONTRACT_ADDRESS: `0x${string}`, settleUpABI: any) => {

    const walletClient = createWalletClient({
      account: wallets[0].address as `0x${string}`,
      chain: moonbaseAlpha,
      transport: custom(provider!),
    });

    const publicClient = createPublicClient({
      chain: moonbaseAlpha,
      transport: custom(provider!),
    });

    const contract = getContract({
      address: CONTRACT_ADDRESS,
      abi: settleUpABI,
      // 1a. Insert a single client
      // client: publicClient,
      // 1b. Or public and/or wallet clients
      client: { public: publicClient, wallet: walletClient }
    })

    console.log(contract, "contract instance")
    return contract;
  }

  const createGroupCalldata = encodeFunctionData({
    abi: settleUpABI,
    functionName: 'createGroup',
    args: ['VIT']
  })

  const batchAddress = "0x0000000000000000000000000000000000000808";
  // const batch = await ethers.getContractAt("Batch", batchAddress);

  const settleUpContract = getContractInstance(CONTRACT_ADDRESS, settleUpABI);

  console.log(createGroupCalldata, "createGroupCalldata")

  const performBatchTransaction = async () => {
    const batchContract = await getContractInstance(batchAddress, batchABI);
    console.log(batchContract, "batchContract")
    const batchAll = await batchContract.write.batchAll(
      [[CONTRACT_ADDRESS],
      [],
      [createGroupCalldata],
      []],
    );
    console.log(batchAll, "batchAll")
    // await batchAll.wait();
    // console.log(`worked: ${batchAll.hash}`);
  }
  // performBatchTransaction();
  return (
    <ContractFunctionContext.Provider value={{ createGroup, performBatchTransaction }}>
      {children}
    </ContractFunctionContext.Provider>
  );
}

export function useContractFunctionContextHook() {
  return useContext(ContractFunctionContext);
}
