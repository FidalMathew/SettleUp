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
  createGroup?: (args: any) => void;
  getContractInstance?: () => void;
  performBatchTransaction?: () => void;
  gaslessTransaction?: () => void;
}

const ContractFunctionContext = createContext<ContractFunctionContextProps>({
  createGroup: (args: any) => { },
  getContractInstance: () => { },
  performBatchTransaction: () => { },
  gaslessTransaction: () => { },
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

  // const settleUpContract = getContractInstance(CONTRACT_ADDRESS, settleUpABI);

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



  const gaslessTransaction = async () => {

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

    const settleUpContract = getContractInstance(CONTRACT_ADDRESS, settleUpABI);

    const createGroupCalldata = encodeFunctionData({
      abi: settleUpABI,
      functionName: 'createGroup',
      args: ['VIT']
    })


    const publicClient = createPublicClient({
      chain: moonbaseAlpha,
      transport: custom(provider!),
    });

    const gasEstimate = await publicClient.estimateGas({
      account: wallets[0].address as `0x${string}`,
      to: CONTRACT_ADDRESS,
      data: createGroupCalldata
    })

    console.log(gasEstimate, 'estimate gas')
    const gaslessContractInstance = await getContractInstance(batchAddress, batchABI);

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
      data: createGroupCalldata,
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


    // const signature = await userSigner.signTypedData(domain, types, message);
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


    // console.log(dispatch, "workingg");

    // const formattedSignature = ethers.Signature.from(signature);

    // // This gets dispatched using the dApps signer
    // const dispatch = await callPermit.dispatch(
    //   message.from,
    //   message.to,
    //   message.value,
    //   message.data,
    //   message.gaslimit,
    //   message.deadline,
    //   formattedSignature.v,
    //   formattedSignature.r,
    //   formattedSignature.s
    // );

    // await dispatch.wait();
    // console.log(`Transaction hash: ${dispatch.hash}`);
  }



  return (
    <ContractFunctionContext.Provider value={{ createGroup, performBatchTransaction, gaslessTransaction }}>
      {children}
    </ContractFunctionContext.Provider>
  );
}

export function useContractFunctionContextHook() {
  return useContext(ContractFunctionContext);
}
