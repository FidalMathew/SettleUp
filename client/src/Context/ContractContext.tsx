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
import {tokenABI} from "@/lib/abi/tokenAbi";
import {getContract} from "viem";
import {privateKeyToAccount} from "viem/accounts";
import {ethers} from "ethers";
import {toast} from "sonner";
import axios from "axios";

interface ContractFunctionContextProps {
  getContractInstance?: () => Promise<any>;
  gaslessTransaction?: (functionName: string, args: any) => Promise<void>;
  groups?: any[];
  totalCredit?: number;
  totalDebt?: number;
  fetchName?: (address: string) => Promise<any>;
  fetchNameAndAvatar?: (address: string) => Promise<any>;
  fetchAddress?: (name: string) => Promise<string>;
  viewAllExpensesOfGroup?: (groupId: number) => Promise<any>;
  getGroupMembers?: (groupId: number) => Promise<any>;
  getGroupSpending?: (groupId: number) => Promise<number>;
  getDebt?: (groupId: number, debtor: string, creditor: string) => Promise<any>;
  payDebt?: (groupId: number, creditor: string, token: number) => Promise<void>;
  getAmountRemainingToBePaid?: (
    account: string,
    groupId: number
  ) => Promise<void>;
  getAmountRemainingToBeReceived?: (
    account: string,
    groupId: number
  ) => Promise<void>;
  LinkTokenPrice?: number;
  getAllDebts?: (groupId: number) => Promise<any>;
  getAllDebtsOfMember?: (groupId: number) => Promise<any>;
  createCallData?: (functionName: string, args: any) => Promise<string>;
  performBatchTransaction?: (
    token: string,
    callDataArray: any
  ) => Promise<void>;
}

const ContractFunctionContext = createContext<ContractFunctionContextProps>({
  getContractInstance: () => new Promise(() => {}),
  gaslessTransaction: (functionName: string, args: any) =>
    new Promise(() => {}),
  groups: [],
  totalCredit: 0,
  totalDebt: 0,
  fetchName: (address: string) => new Promise(() => {}),
  fetchNameAndAvatar: (address: string) => new Promise(() => {}),
  fetchAddress: (name: string) => new Promise(() => {}),
  getGroupMembers: (groupId: number) => new Promise(() => {}),
  viewAllExpensesOfGroup: (groupId: number) => new Promise(() => {}),
  getGroupSpending: (groupId: number) => new Promise(() => {}),
  getDebt: (groupId: number, debtor: string, creditor: string) =>
    new Promise(() => {}),
  payDebt: (groupId: number, creditor: string, token: number) =>
    new Promise(() => {}),
  getAmountRemainingToBePaid: (account: string, groupId: number) =>
    new Promise(() => {}),
  getAmountRemainingToBeReceived: (account: string, groupId: number) =>
    new Promise(() => {}),
  LinkTokenPrice: 0,
  getAllDebts: (groupId: number) => new Promise(() => {}),
  getAllDebtsOfMember: (groupId: number) => new Promise(() => {}),
  createCallData: (functionName: string, args: any) => new Promise(() => {}),
  performBatchTransaction: (token: string, callDataArray: any) =>
    new Promise(() => {}),
});

export default function ContractFunctionContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const CONTRACT_ADDRESS = "0x1e383F71e84c6Feda9A78e09593D77593DbF8cAe";
  const {wallets} = useWallets();
  const [provider, setProvider] = useState<EIP1193Provider>();

  useEffect(() => {
    (async function () {
      if (wallets && wallets[0] && wallets[0].chainId !== "1287") {
        await wallets[0].switchChain(1287 as `0x${string}` | number);
      }
    })();
  }, []);

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
    // if (wallets[0] && wallets[0].chainId === "1287" && provider) {
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

  const createCallData = async (functionName: string, args: any) => {
    const data = encodeFunctionData({
      abi: settleUpABI,
      functionName: functionName,
      args: args,
    });
    return data;
  };

  const performBatchTransaction = async (token: string, callDataArray: any) => {
    try {
      console.log(callDataArray, "callDataArray", token, "token");
      // const createGroupCalldata = encodeFunctionData({
      //   abi: settleUpABI,
      //   functionName: "createGroup",
      //   args: ["VIT"],
      // });

      console.log(callDataArray, "callDataArray");

      const LINKAddress = "0x0F5CC78D949c3cD5B6264A9Fb1a423A6075bf68A";
      let contractAddressArray: string[] = [];
      if (token === "LINK") {
        contractAddressArray.push("0x0F5CC78D949c3cD5B6264A9Fb1a423A6075bf68A");
      }

      for (let i = 0; i < callDataArray.length; i++) {
        contractAddressArray.push(CONTRACT_ADDRESS);
      }

      const allowanceCallData = encodeFunctionData({
        abi: tokenABI,
        functionName: "approve",
        args: [CONTRACT_ADDRESS, "30000000000000000000"],
      });

      const transCallData = encodeFunctionData({
        abi: settleUpABI,
        functionName: "payDebt",
        args: [1, "0x45B5175beB39B86609c9e0e7E5A7E5B0f1d65115", 0],
      });

      console.log(callDataArray, "pre callDataArray");

      callDataArray = [allowanceCallData, ...callDataArray];
      console.log(callDataArray, "final callDataArray");

      const batchAddress = "0x0000000000000000000000000000000000000808";

      console.log(
        contractAddressArray,
        callDataArray,
        contractAddressArray.length,
        callDataArray.length,
        "testing"
      );

      const batchContract = await getContractInstance(batchAddress, batchABI);
      console.log(batchContract, "batchContract");
      const batchAll = await batchContract?.write.batchAll([
        ["0x0F5CC78D949c3cD5B6264A9Fb1a423A6075bf68A", CONTRACT_ADDRESS], //contractAddressArray,
        [],
        callDataArray, // callDataArray,
        [],
      ]);
      console.log(batchAll, "batchAll");
    } catch (err) {}
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
    // if (wallets[0] && wallets[0].chainId !== "1287") return;
    const contract = await getContractInstance(CONTRACT_ADDRESS, settleUpABI);
    const groups: any = await contract?.read.getGroupsForMember([
      wallets[0].address as `0x${string}`,
    ]);

    console.log(groups, "groups from context");

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
    const expenses = await contract.read.viewAllExpensesOfGroup([groupId]);
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

  const getAllDebtsOfMember = async (groupId: number) => {
    if (!wallets[0]) return;

    const member = wallets[0].address as `0x${string}`;
    const contract = await getContractInstance(CONTRACT_ADDRESS, settleUpABI);
    if (!contract) return;

    const debts: any = await contract.read.getAllDebts([groupId]);
    console.log(debts, "debts");

    if (!debts) return;

    let memberDebts = [];

    console.log("hello");
    for (let i = 0; i < debts[0].length; i++) {
      console.log(debts[0][i], member, "debtor");
      if (debts[0][i] === member) {
        let name = await fetchName(debts[1][i]);
        memberDebts.push({
          name: name,
          address: debts[1][i],
          amount: Number(debts[2][i]),
          isChecked: false,
        });
      }
    }

    console.log(memberDebts, "memberDebts");

    return memberDebts;
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
    try {
      const contract = await getContractInstance(CONTRACT_ADDRESS, settleUpABI);
      const name = await contract?.read.fetchName([address]);
      console.log(name, "name");
      return name as string;
    } catch (err) {
      console.log(err, "error in fetchName");
    }
  };

  const fetchNameAndAvatar = async (address: string) => {
    try {
      const contract = await getContractInstance(CONTRACT_ADDRESS, settleUpABI);
      const name1 = await contract?.read.fetchNameTest([address]);
      console.log(name1, "holdup fuckers");
      return name1 as string;
    } catch (err) {
      console.log(err, "error in fetchName");
    }
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
    return groupSpending as number;
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

  const [LinkTokenPrice, setLinkTokenPrice] = useState<number>(0);

  useEffect(() => {
    const network_id = "1"; // See https://docs.chainbase.com/reference/supported-chains to get the id of different chains.
    const token_addr = "0x514910771AF9Ca656af840dff83E8264EcF986CA"; // Take USDT as an example.

    async function tokenPrice() {
      try {
        const {data} = await axios.get(
          `https://api.chainbase.online/v1/token/price?chain_id=${network_id}&contract_address=${token_addr}`,
          {
            headers: {
              "x-api-key": process.env.NEXT_PUBLIC_CHAINBASE_API_KEY!,
              accept: "application/json",
            },
          }
        );
        console.log(data, "tokendata");
        setLinkTokenPrice(data.data.price);
      } catch (err) {
        console.log(err, "error");
      }
    }

    tokenPrice();

    // const intervalId = setInterval(tokenPrice, 300000);

    // return () => {
    //   clearInterval(intervalId);
    // };
  }, []);

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
        fetchNameAndAvatar,
        fetchAddress,
        getGroupSpending,
        getDebt,
        payDebt,
        getAmountRemainingToBePaid,
        getAmountRemainingToBeReceived,
        viewAllExpensesOfGroup,
        LinkTokenPrice,
        getAllDebts,
        getAllDebtsOfMember,
        createCallData,
      }}
    >
      {children}
    </ContractFunctionContext.Provider>
  );
}

export function useContractFunctionContextHook() {
  return useContext(ContractFunctionContext);
}
