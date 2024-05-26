import {EIP1193Provider, useWallets} from "@privy-io/react-auth";
import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {
  createPublicClient,
  createWalletClient,
  custom,
  encodeFunctionData,
  http,
  WalletClient,
} from "viem";
import {moonbaseAlpha} from "viem/chains";
import {settleUpABI} from "@/lib/abi/settleUpAbi";
import {batchABI} from "@/lib/abi/batchABI";
import {gaslessABI} from "@/lib/abi/gaslessABI";
import {getContract} from "viem";
import {privateKeyToAccount} from "viem/accounts";
import {ethers} from "ethers";
import {toast} from "sonner";

interface ContractFunctionContextProps {
  getContractInstance?: () => void;
  performBatchTransaction?: () => void;
  gaslessTransaction?: (functionName: string, args: any) => Promise<void>;
  groups?: any[];
  totalCredit?: number;
  totalDebt?: number;
  fetchName?: (address: string) => Promise<string>;
  fetchAddress?: (name: string) => Promise<string>;
  getGroupMembers?: (groupId: number) => Promise<any>;
  getGroupSpending?: (groupId: number) => void;
  getDebt?: (groupId: number, debtor: string, creditor: string) => void;
  payDebt?: (groupId: number, creditor: string, token: number) => void;
  getAmountRemainingToBePaid?: (account: string, groupId: number) => void;
  getAmountRemainingToBeReceived?: (account: string, groupId: number) => void;
}

const ContractFunctionContext = createContext<ContractFunctionContextProps>({
  getContractInstance: () => {},
  performBatchTransaction: () => {},
  gaslessTransaction: (functionName: string, args: any) =>
    new Promise(() => {}),
  groups: [],
  totalCredit: 0,
  totalDebt: 0,
  fetchName: (address: string) => new Promise(() => {}),
  fetchAddress: (name: string) => new Promise(() => {}),
  getGroupMembers: (groupId: number) => new Promise(() => {}),
  getGroupSpending: (groupId: number) => {},
  getDebt: (groupId: number, debtor: string, creditor: string) => {},
  payDebt: (groupId: number, creditor: string, token: number) => {},
  getAmountRemainingToBePaid: (account: string, groupId: number) => {},
  getAmountRemainingToBeReceived: (account: string, groupId: number) => {},
});

export default function ContractFunctionContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const CONTRACT_ADDRESS = "0xF73972ACe5Bd3A9363Bc1F12052f18fAeF26139B";
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

  const getContractInstance = async (
    CONTRACT_ADDRESS: `0x${string}`,
    settleUpABI: any
  ) => {
    if (wallets[0] && provider) {
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
        client: {public: publicClient, wallet: walletClient},
      });

      console.log(contract, "contract instance");
      return contract;
    }
  };

  const performBatchTransaction = async () => {
    const createGroupCalldata = encodeFunctionData({
      abi: settleUpABI,
      functionName: "createGroup",
      args: ["VIT"],
    });

    const batchAddress = "0x0000000000000000000000000000000000000808";

    console.log(createGroupCalldata, "createGroupCalldata");

    const batchContract = await getContractInstance(batchAddress, batchABI);
    console.log(batchContract, "batchContract");
    const batchAll = await batchContract?.write.batchAll([
      [CONTRACT_ADDRESS],
      [],
      [createGroupCalldata],
      [],
    ]);
    console.log(batchAll, "batchAll");
  };

  const gaslessTransaction = async (functionName: string, args: any) => {
    try {
      const PKey: string = process.env.NEXT_PUBLIC_PRIVATE_KEY || "";
      console.log(PKey, "PKey");
      const account = privateKeyToAccount(`0x${PKey}`);
      console.log(account, "account");

      const types = {
        CallPermit: [
          {name: "from", type: "address"},
          {name: "to", type: "address"},
          {name: "value", type: "uint256"},
          {name: "data", type: "bytes"},
          {name: "gaslimit", type: "uint64"},
          {name: "nonce", type: "uint256"},
          {name: "deadline", type: "uint256"},
        ],
      };

      const callData = encodeFunctionData({
        abi: settleUpABI,
        functionName: functionName,
        args: args,
      });

      const publicClient = createPublicClient({
        chain: moonbaseAlpha,
        transport: custom(provider!),
      });

      const gasEstimate = await publicClient.estimateGas({
        account: wallets[0].address as `0x${string}`,
        to: CONTRACT_ADDRESS,
        data: callData,
      });

      console.log(gasEstimate, "estimate gas");

      const privateWalletClient = createWalletClient({
        account: account.address as `0x${string}`,
        chain: moonbaseAlpha,
        transport: http("https://moonbase-alpha.public.blastapi.io"),
      });

      console.log(privateWalletClient, "privateWalletClient");

      const userWalletClient = createWalletClient({
        account: wallets[0].address as `0x${string}`,
        chain: moonbaseAlpha,
        transport: custom(provider!),
      });

      const gaslessContractPermit = getContract({
        address: "0x000000000000000000000000000000000000080a",
        abi: gaslessABI,
        client: privateWalletClient,
      });

      console.log(gaslessContractPermit, "gaslessContractPermit");

      const providerRPC = {
        moonbeam: {
          name: "moonbeam",
          rpc: "https://moonbase-alpha.public.blastapi.io", // Insert your RPC URL here
          chainId: 1287, // 0x504 in hex,
        },
      };
      const providerEthers = new ethers.JsonRpcProvider(
        providerRPC.moonbeam.rpc,
        {
          chainId: providerRPC.moonbeam.chainId,
          name: providerRPC.moonbeam.name,
        }
      );

      const thirdPartyGasSigner = new ethers.Wallet(PKey, providerEthers); // manager-voter

      const callPermit = new ethers.Contract(
        "0x000000000000000000000000000000000000080a", // Call Permit contract
        gaslessABI,
        thirdPartyGasSigner
      );

      const nonce = await callPermit.nonces(wallets[0].address);
      console.log("nonce", nonce, BigInt(nonce));

      const message = {
        from: wallets[0].address,
        to: CONTRACT_ADDRESS, // Cartographer V1 contract
        value: 0,
        data: callData,
        gaslimit: BigInt(gasEstimate) + BigInt(50000),
        nonce: BigInt(nonce),
        deadline: "1714762357000", // Randomly created deadline in the future
      };

      console.log("userWAllet Client", userWalletClient);

      const domain = {
        name: "Call Permit Precompile",
        version: "1",
        chainId: 1287,
        verifyingContract:
          "0x000000000000000000000000000000000000080a" as `0x${string}`,
      };

      const signature = await userWalletClient.signTypedData({
        domain,
        types,
        primaryType: "CallPermit",
        message,
      });
      console.log(`Signature hash: ${signature}`);

      const formattedSignature = ethers.Signature.from(signature);

      console.log("formattedSignature", callPermit);

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
    } catch (err: any) {
      toast(err.message);
    }
  };

  const [groups, setGroups] = useState<any[]>([]);

  const [groupIds, setGroupIds] = useState<number[]>([]);

  const viewAllGroups = async () => {
    const contract = await getContractInstance(CONTRACT_ADDRESS, settleUpABI);
    const groups: any = await contract?.read.getGroupsForMember([
      wallets[0].address as `0x${string}`,
    ]);
    console.log(groups, "groups");

    const groupNumbers = groups[0] as any;
    const groupNames = groups[1] as any;
    const groupCategories = groups[2] as any;
    const groupFrom = groups[3] as any;
    const groupTo = groups[4] as any;

    const tempGroups = [];
    const tempGroupIds = [];

    for (let i = 0; i < groupNumbers.length; i++) {
      tempGroups.push({
        groupNumber: Number(groupNumbers[i]),
        groupName: groupNames[i],
        groupCategory: groupCategories[i],
        groupFrom: groupFrom[i],
        groupTo: groupTo[i],
      });
      tempGroupIds.push(Number(groupNumbers[i]));
    }
    console.log(tempGroups, "tempGroups");
    setGroups(tempGroups);
    setGroupIds(tempGroupIds);
  };

  const [allExpenses, setAllExpenses] = useState<any[]>([]);

  useEffect(() => {
    const viewAllExpensesOfGroup = async (groupId: number) => {
      const contract = await getContractInstance(CONTRACT_ADDRESS, settleUpABI);
      const expenses = await contract?.read.viewAllExpensesOfGroup([groupId]);
      console.log(expenses, "expenses");
    };

    groupIds &&
      groupIds.map((groupId) => {
        viewAllExpensesOfGroup(groupId);
      });
  }, [groupIds]);

  const getGroupMembers = async (groupId: number) => {
    const contract = await getContractInstance(CONTRACT_ADDRESS, settleUpABI);
    if (!contract) return;
    const groupMembers = await contract.read.getGroupMembers([groupId]);
    console.log(groupMembers, "groupMembers");
    return groupMembers;
  };

  const viewAllExpensesOfGroup = async (groupId: number) => {
    const contract = await getContractInstance(CONTRACT_ADDRESS, settleUpABI);
    if (!contract) return;
    const expenses = await contract.read.getExpensesOfGroup([groupId]);
    console.log(expenses, "expenses");
    return expenses;
  };

  const getAllDebts = async (groupId: number) => {
    const contract = await getContractInstance(CONTRACT_ADDRESS, settleUpABI);
    if (!contract) return;
    const debts = await contract.read.getAllDebts([groupId]);
    console.log(debts, "debts");
    return debts;
  };

  const [totalCredit, setTotalCredit] = useState<number>(0);
  const [totalDebt, setTotalDebt] = useState<number>(0);

  const getTotalCredit = async () => {
    const contract = await getContractInstance(CONTRACT_ADDRESS, settleUpABI);
    const totalCredit = await contract?.read.getTotalCredit([
      wallets[0].address as `0x${string}`,
    ]);
    console.log(totalCredit, "totalCredit");
    setTotalCredit(Number(totalCredit));
  };

  const getTotalDebt = async () => {
    const contract = await getContractInstance(CONTRACT_ADDRESS, settleUpABI);
    const totalDebt = await contract?.read.getTotalDebt([
      wallets[0].address as `0x${string}`,
    ]);
    console.log(totalDebt, "totalDebt");
    setTotalDebt(Number(totalDebt));
  };

  const fetchName = async (address: string) => {
    const contract = await getContractInstance(CONTRACT_ADDRESS, settleUpABI);
    const name = await contract?.read.fetchName([address]);
    console.log(name, "name");
    return name as string;
  };

  const fetchAddress = async (name: string): Promise<string> => {
    const contract = await getContractInstance(CONTRACT_ADDRESS, settleUpABI);
    const address = await contract?.read.fetchAddress([name]);
    console.log(address, "address");
    return address as string;
  };

  const getGroupSpending = async (groupId: number) => {
    const contract = await getContractInstance(CONTRACT_ADDRESS, settleUpABI);
    const groupSpending = await contract?.read.getGroupSpending([groupId]);
    console.log(groupSpending, "groupSpending");
    return groupSpending;
  };

  // getDebt(uint256 groupId, address debtor, address creditor)
  const getDebt = async (groupId: number, debtor: string, creditor: string) => {
    const contract = await getContractInstance(CONTRACT_ADDRESS, settleUpABI);
    const debt = await contract?.read.getDebt([groupId, debtor, creditor]);
    console.log(debt, "debt");
  };

  // function payDebt(uint256 _groupId, address _creditor, uint256 token) public {
  const payDebt = async (groupId: number, creditor: string, token: number) => {
    const contract = await getContractInstance(CONTRACT_ADDRESS, settleUpABI);
    const payDebt = await contract?.write.payDebt([groupId, creditor, token]);
    console.log(payDebt, "payDebt");
  };

  // function getAmountRemainingToBePaid(address account, uint256 groupId) public view returns(uint256) {
  const getAmountRemainingToBePaid = async (
    account: string,
    groupId: number
  ) => {
    const contract = await getContractInstance(CONTRACT_ADDRESS, settleUpABI);
    const amount = await contract?.read.getAmountRemainingToBePaid([
      account,
      groupId,
    ]);
    console.log(amount, "amount");
  };

  // function getAmountRemainingToBeReceived(address account, uint256 groupId) public view returns(uint256) {
  const getAmountRemainingToBeReceived = async (
    account: string,
    groupId: number
  ) => {
    const contract = await getContractInstance(CONTRACT_ADDRESS, settleUpABI);
    const amount = await contract?.read.getAmountRemainingToBeReceived([
      account,
      groupId,
    ]);
    console.log(amount, "amount");
  };

  const [createUserLoading, setCreateUserLoading] = useState(false);

  const createUser = async (name: string) => {
    setCreateUserLoading(true); // Set loading to true when function starts
    try {
      const contract = await getContractInstance(CONTRACT_ADDRESS, settleUpABI);
      const createUserResponse = await contract?.write.createUser([name]);
      console.log(createUserResponse, "createUser");
    } catch (error) {
      console.error("Error creating user:", error);
    } finally {
      setCreateUserLoading(false); // Set loading to false when function ends
    }
  };

  useEffect(() => {
    if (provider) {
      viewAllGroups();
      getTotalCredit();
      getTotalDebt();
    }
  }, [provider]);

  return (
    <ContractFunctionContext.Provider
      value={{
        performBatchTransaction,
        gaslessTransaction,
        groups,
        totalDebt,
        totalCredit,
        getGroupMembers,
        fetchName,
        fetchAddress,
        getGroupSpending,
        getDebt,
        payDebt,
        getAmountRemainingToBePaid,
        getAmountRemainingToBeReceived,
      }}
    >
      {children}
    </ContractFunctionContext.Provider>
  );
}

export function useContractFunctionContextHook() {
  return useContext(ContractFunctionContext);
}
