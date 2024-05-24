import { EIP1193Provider, useWallets } from "@privy-io/react-auth";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import {
  createPublicClient,
  createWalletClient,
  custom,
  encodeFunctionData,
  http,
  WalletClient,
} from "viem";
import { moonbaseAlpha } from "viem/chains";
import { settleUpABI } from "@/lib/abi/settleUpAbi";
import { batchABI } from "@/lib/abi/batchABI";
import { gaslessABI } from "@/lib/abi/gaslessABI";
import { getContract } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { ethers } from 'ethers'



interface ContractFunctionContextProps {
  getContractInstance?: () => void;
  performBatchTransaction?: () => void;
  gaslessTransaction?: (functionName: string, args: any) => void;
  groups?: any[];
}

const ContractFunctionContext = createContext<ContractFunctionContextProps>({
  getContractInstance: () => { },
  performBatchTransaction: () => { },
  gaslessTransaction: (functionName: string, args: any) => { },
  groups: []
});


export default function ContractFunctionContextProvider({
  children,
}: {
  children: ReactNode;
}) {

  const CONTRACT_ADDRESS = "0xDD02674D915b3FD1Cff72531276428Eca20D9ee0";
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


  const performBatchTransaction = async () => {

    const createGroupCalldata = encodeFunctionData({
      abi: settleUpABI,
      functionName: 'createGroup',
      args: ['VIT']
    })

    const batchAddress = "0x0000000000000000000000000000000000000808";

    console.log(createGroupCalldata, "createGroupCalldata")

    const batchContract = await getContractInstance(batchAddress, batchABI);
    console.log(batchContract, "batchContract")
    const batchAll = await batchContract.write.batchAll(
      [[CONTRACT_ADDRESS],
      [],
      [createGroupCalldata],
      []],
    );
    console.log(batchAll, "batchAll")
  }


  const gaslessTransaction = async (functionName: string, args: any) => {

    const PKey: string = process.env.NEXT_PUBLIC_PRIVATE_KEY || "";
    console.log(PKey, "PKey")
    const account = privateKeyToAccount(`0x${PKey}`);
    console.log(account, "account")


    const types = {
      CallPermit: [
        { name: "from", type: "address" },
        { name: "to", type: "address" },
        { name: "value", type: "uint256" },
        { name: "data", type: "bytes" },
        { name: "gaslimit", type: "uint64" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    };

    const callData = encodeFunctionData({
      abi: settleUpABI,
      functionName: functionName,
      args: args
    })


    const publicClient = createPublicClient({
      chain: moonbaseAlpha,
      transport: custom(provider!),
    });

    const gasEstimate = await publicClient.estimateGas({
      account: wallets[0].address as `0x${string}`,
      to: CONTRACT_ADDRESS,
      data: callData
    })

    console.log(gasEstimate, 'estimate gas')

    const privateWalletClient = createWalletClient({
      account: account.address as `0x${string}`,
      chain: moonbaseAlpha,
      transport: http("https://moonbase-alpha.public.blastapi.io"),
    });

    console.log(privateWalletClient, 'privateWalletClient')

    const userWalletClient = createWalletClient({
      account: wallets[0].address as `0x${string}`,
      chain: moonbaseAlpha,
      transport: custom(provider!),
    });


    const gaslessContractPermit = getContract({
      address: "0x000000000000000000000000000000000000080a",
      abi: gaslessABI,
      client: privateWalletClient,
    })

    console.log(gaslessContractPermit, "gaslessContractPermit")

    const providerRPC = {
      moonbeam: {
        name: "moonbeam",
        rpc: "https://moonbase-alpha.public.blastapi.io", // Insert your RPC URL here
        chainId: 1287, // 0x504 in hex,
      },
    };
    const providerEthers = new ethers.JsonRpcProvider(providerRPC.moonbeam.rpc, {
      chainId: providerRPC.moonbeam.chainId,
      name: providerRPC.moonbeam.name,
    });


    const thirdPartyGasSigner = new ethers.Wallet(
      "e7f03f41697dc0e5922fc67a859a617a5ede8bfd4eb0d0b0383694dc7c8e7b91",
      providerEthers
    ); // manager-voter

    const callPermit = new ethers.Contract(
      "0x000000000000000000000000000000000000080a", // Call Permit contract
      gaslessABI,
      thirdPartyGasSigner
    );

    const nonce = await callPermit.nonces(wallets[0].address);
    console.log("nonce", nonce, BigInt(nonce))

    const message = {
      from: wallets[0].address,
      to: CONTRACT_ADDRESS, // Cartographer V1 contract
      value: 0,
      data: callData,
      gaslimit: BigInt(gasEstimate) + BigInt(50000),
      nonce: BigInt(nonce),
      deadline: "1714762357000", // Randomly created deadline in the future
    };

    console.log("userWAllet Client", userWalletClient)


    const domain = {
      name: "Call Permit Precompile",
      version: "1",
      chainId: 1287,
      verifyingContract: "0x000000000000000000000000000000000000080a" as `0x${string}`,
    };

    const signature = await userWalletClient.signTypedData({ domain, types, primaryType: 'CallPermit', message });
    console.log(`Signature hash: ${signature}`);


    const formattedSignature = ethers.Signature.from(signature);

    console.log("formattedSignature",
      callPermit
    );

    // This gets dispatched using the dApps signer
    const dispatch = await callPermit.dispatch(
      message.from,
      message.to,
      message.value,
      message.data,
      message.gaslimit,
      message.deadline,
      formattedSignature.v,
      formattedSignature.r,
      formattedSignature.s
    );

    await dispatch.wait();
    console.log(`Transaction hash: ${dispatch.hash}`);

  }

  const [groups, setGroups] = useState<any[]>([])

  const viewAllGroups = async () => {
    const contract = await getContractInstance(CONTRACT_ADDRESS, settleUpABI);
    const groups: any = await contract.read.getGroupsForMember([wallets[0].address as `0x${string}`]);
    console.log(groups, "groups")

    const groupNumbers = groups[0] as any;
    const groupNames = groups[1] as any;
    const groupCategories = groups[2] as any;
    const groupFrom = groups[3] as any;
    const groupTo = groups[4] as any;

    const tempGroups = [];
    for (let i = 0; i < groupNumbers.length; i++) {
      tempGroups.push({
        groupNumber: Number(groupNumbers[i]),
        groupName: groupNames[i],
        groupCategory: groupCategories[i],
        groupFrom: groupFrom[i],
        groupTo: groupTo[i]
      })
    }
    console.log(tempGroups, "tempGroups")
    setGroups(tempGroups)
    // return groups;
  }

  const getGroupMembers = async (groupId: number) => {
    const contract = await getContractInstance(CONTRACT_ADDRESS, settleUpABI);
    const groupMembers = await contract.read.getGroupMembers([groupId])
    console.log(groupMembers, "groupMembers")

  }

  const viewAllExpensesOfGroup = async (groupId: number) => {
    const contract = await getContractInstance(CONTRACT_ADDRESS, settleUpABI);
    const expenses = await contract.read.getExpensesOfGroup([groupId])
    console.log(expenses, "expenses")
  }

  const getAllDebts = async (groupId: number) => {
    const contract = await getContractInstance(CONTRACT_ADDRESS, settleUpABI);
    const debts = await contract.read.getAllDebts([groupId])
    console.log(debts, "debts")
  }

  useEffect(() => {
    if (provider) {
      viewAllGroups();
    }
  }, [provider])

  return (
    <ContractFunctionContext.Provider value={{ performBatchTransaction, gaslessTransaction, groups }}>
      {children}
    </ContractFunctionContext.Provider>
  );
}

export function useContractFunctionContextHook() {
  return useContext(ContractFunctionContext);
}
