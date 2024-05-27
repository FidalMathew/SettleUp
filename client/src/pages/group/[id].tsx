import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, HandCoins, Loader2, Plus, Sparkles } from "lucide-react";
import { useRouter } from "next/router";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  ResponsiveDialogComponent,
  ResponsiveDialogComponentContent,
  ResponsiveDialogComponentDescription,
  ResponsiveDialogComponentFooter,
  ResponsiveDialogComponentHeader,
  ResponsiveDialogComponentTitle,
} from "@/components/ui/ResponsiveDialog";
import { Label } from "@/components/ui/label";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, set } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SearchBox from "@/components/AIComponents/SearchBox";
import { Field, Form, Formik } from "formik";
import { emoji } from "@/lib/emoji";
import { useContractFunctionContextHook } from "@/Context/ContractContext";
import moment from "moment";
import { toast } from "sonner";

interface SplitArray {
  name: string;
  amount: number;
  isChecked: boolean;
}

export default function Groups() {
  const router = useRouter();

  const {
    performBatchTransaction,
    getContractInstance,
    gaslessTransaction,
    groups,
    getGroupMembers,
    fetchName,
    fetchAddress,
    getGroupSpending,
    viewAllExpensesOfGroup,
    LinkTokenPrice,
    getAllDebts,
    getAllDebtsOfMember,
    createCallData
  } = useContractFunctionContextHook();

  // modal states
  const [addExpenseBox, setAddExpenseBox] = useState(false);
  const [addMemberBox, setAddMemberBox] = useState(false);
  const [date, setDate] = useState<Date>();
  const [openAIBox, setOpenAIBox] = useState(false);
  const [openPayAllBox, setOpenPayAllBox] = useState(false);
  const [openAvatarModal, setOpenAvatarModal] = useState(false);

  // loading states
  const [gaslessTransactionLoading, setGaslessTransactionLoading] =
    useState(false);

  // global form states
  const [amount, setAmount] = useState(0);
  const [splitArray, setSplitArray] = useState([] as SplitArray[]);
  const [numberOfChecked, setNumberOfChecked] = useState(0);
  const [numberOfUnequallyChecked, setNumberOfUnequallyChecked] = useState(0);
  const [unequallySplitArray, setUnequallySplitArray] = useState(
    [] as SplitArray[]
  );
  const [amountRemaining, setAmountRemaining] = useState(amount);
  const [equalSplit, setEqualSplit] = useState(true);
  const [MembersArray, setMembersArray] = useState<any>([]);
  const [groupExpenses, setGroupExpenses] = useState<any>([]);
  const [nameAddressMap, setNameAddressMap] = useState(new Map());

  const addOrUpdateNameAddress = (name: string, address: string) => {
    setNameAddressMap((prevMap) => {
      const newMap = new Map(prevMap);
      newMap.set(address, name);
      return newMap;
    });
  };

  useEffect(() => {
    const newArray = Array.from({ length: MembersArray.length }).map(
      (_, index) => {
        return {
          name: MembersArray[index].name,
          amount: 0,
          isChecked: false,
        };
      }
    );
    const newArrayUnequallySplit = Array.from({
      length: MembersArray.length,
    }).map((_, index) => {
      return {
        name: MembersArray[index].name,
        amount: 0,
        isChecked: false,
      };
    });

    setUnequallySplitArray(newArray);

    setSplitArray(newArrayUnequallySplit);
  }, [MembersArray]);

  const MembersArray1 = useMemo(
    () => [
      { name: "Manvik", due: 200 },
      { name: "Jaydeep", due: 300 },
      { name: "Fidal", due: 500 },
    ],
    []
  );

  const [membersDuesArray, setMembersDuesArray] = useState<any>([]);
  const [dueRemaining, setDueRemaining] = useState(0);

  useEffect(() => {
    const newMembersDueArray = MembersArray1.map((item: any) => {
      return {
        name: item.name,
        amount: item.due,
        isChecked: false,
      };
    });

    setMembersDuesArray(newMembersDueArray);
  }, [MembersArray1]);

  useEffect(() => {
    const checked = splitArray.filter((item) => item.isChecked);
    setNumberOfChecked(checked.length);
  }, [splitArray]);

  useEffect(() => {
    const unequallySplitArrayChecked = unequallySplitArray.filter(
      (item) => item.isChecked
    );
    setNumberOfUnequallyChecked(unequallySplitArrayChecked.length);
  }, [unequallySplitArray]);

  useEffect(() => {
    //  if equal split is false, then reset the splitArray to default values
    if (!equalSplit) {
      setSplitArray((prev) => {
        const newArray = [...prev];
        newArray.forEach((item, index) => {
          newArray[index].isChecked = false;
          newArray[index].amount = 0;
        });
        return newArray;
      });

      setNumberOfChecked(0);
    } else {
      setUnequallySplitArray((prev) => {
        const newArray = [...prev];
        newArray.forEach((item, index) => {
          newArray[index].isChecked = false;
          newArray[index].amount = 0;
        });
        return newArray;
      });

      setNumberOfUnequallyChecked(0);
      setAmountRemaining(amount);
    }
  }, [equalSplit]);

  // console.log(amount, "amountRemaining");
  // console.log(numberOfChecked, "numberOfChecked");
  // console.log(numberOfUnequallyChecked, "numberOfUnequallyChecked");
  // console.log(unequallySplitArray, "unequallySplitArray");
  // console.log(splitArray, "splitArray");

  const groupId = router.query.id;
  console.log(groupId, "groupId");

  const [groupDetails, setGroupDetails] = useState<any>(null);
  const [groupDebtMap, setGroupDebtMap] = useState(new Map());

  const [groupSpending, setGroupSpending] = useState<number>(0);

  useEffect(() => {
    if (groupId && groups) {
      console.log(groups, "groups dsa");

      const group = groups.find(
        (group) => group.groupNumber === Number(groupId)
      );
      console.log(group, "group");

      setGroupDetails(group);
    }
    (async () => {
      if (groupId && getGroupMembers && fetchName) {
        try {
          const res: string[] | undefined = await getGroupMembers(
            Number(groupId)
          );
          console.log(res, "groupMembers---");

          let temp: any[] = [];

          if (res !== undefined) {
            const namePromises = res.map(async (address) => {
              const name = await fetchName(address);
              addOrUpdateNameAddress(name, address);
              return { name: name === undefined ? "no-name" : name, address };
            });

            temp = await Promise.all(namePromises);
          }

          console.log(temp, "temp");

          setMembersArray(temp);
        } catch (error) {
          console.error("Error fetching group members or names:", error);
        }
      }

      if (getGroupSpending) {
        const spending = await getGroupSpending(Number(groupId));
        console.log(spending, "spending");
        setGroupSpending(Number(spending));
      }

      if (viewAllExpensesOfGroup) {
        const expenses = await viewAllExpensesOfGroup(Number(groupId));
        console.log(expenses, "expenses");
        setGroupExpenses(expenses);
      }

      if (getAllDebtsOfMember) {
        const debts = await getAllDebtsOfMember(Number(groupId));
        console.log(debts, "debts of member");

        let totalDue = 0;
        const newMembersDueArray = (debts as unknown as any[])?.map((item: any) => {
          totalDue += item.amount;
          return {
            name: item.name,
            amount: item.amount,
            isChecked: false,
          };
        });

        setDueRemaining(totalDue);
        setMembersDuesArray(debts);
      }
    })();
  }, [groupId, groups]);

  const handleAddGroupMember = async (values: any) => {
    if (!gaslessTransaction) return console.log("gaslessTransaction not found");

    const res = await gaslessTransaction("addMember", [groupId, values.wallet]);
    console.log(res, "res");
  };

  const handleAddExpense = async (values: any) => {
    setGaslessTransactionLoading(true);
    try {
      if (!gaslessTransaction)
        return console.log("gaslessTransaction not found");
      console.log(values, "values- expense");

      const creditor = values.paidBy;
      let debtors: string[] = [];
      let amountsArray: number[] = [];
      if (values.equalSplit && fetchAddress) {
        const fetchPromises = values.splitArray.map(async (item: any) => {
          const address = await fetchAddress(item.name);
          debtors.push(address);
          amountsArray.push(item.amount);
        });

        // Wait for all promises to resolve
        await Promise.all(fetchPromises);
      } else if (!values.equalSplit && fetchAddress) {
        const fetchPromises = values.unequallySplitArray.map(
          async (item: any) => {
            const address = await fetchAddress(item.name);
            debtors.push(address);
            amountsArray.push(item.amount);
          }
        );

        // Wait for all promises to resolve
        await Promise.all(fetchPromises);
      }

      console.log(debtors, "debtors");
      console.log(amountsArray, "debtors amountsArray");

      if (values.equalSplit && debtors.length > 0 && amountsArray.length > 0) {
        const res = await gaslessTransaction("addExpense", [
          groupId,
          creditor,
          debtors,
          amountsArray,
          values.amount,
          values.description,
          values.date.toString(),
          values.category,
        ]);
        console.log(res, "res");
        toast("Expense added successfully");
      } else {
        const res = await gaslessTransaction("addExpense", [
          groupId,
          creditor,
          debtors,
          amountsArray,
          values.amount,
          values.description,
          values.date.toString(),
          values.category,
        ]);
        console.log(res, "res");
        toast("Expense added successfully");
      }
    } catch (err: any) {
      toast(err.message);
      console.log(err, "err");
    } finally {
      setGaslessTransactionLoading(false);
    }
  };

  const [batchingLoading, setBatchingLoading] = useState(false);

  const tokenPrices = useMemo(
    () => [
      {
        name: "LINK",
        price: LinkTokenPrice,
      },
      {
        name: "USDC",
        price: 1,
      },
    ],
    [LinkTokenPrice]
  );

  const [tokenPricesArray, setTokenPricesArray] = useState<any>([]);

  useEffect(() => {
    const newTokenPriceArray = tokenPrices.map((item) => {
      if (item.name === "LINK") {
        return {
          ...item,
          isChecked: true,
        };
      }
      return {
        ...item,
        isChecked: false,
      };
    });

    setTokenPricesArray(newTokenPriceArray);
  }, [tokenPrices]);

  const handlePayDue = async (values: any) => {

    let tokenValue = 0;

    let callDataArray: any = []
    console.log(values, "values -- batch");

    if (createCallData && performBatchTransaction) {

      const arr = values.membersDuesArray.map(async (item: any) => {
        const callData = await createCallData("payDebt", [groupId, item.address, tokenValue]);
        console.log(callData, "callData-pay");
        return callData;
      });

      const resolvedCallDataArray = await Promise.all(arr);

      resolvedCallDataArray.forEach(callData => {
        callDataArray.push(callData);
      });

      console.log(callDataArray, "callDataArray----");

      const res = performBatchTransaction("LINK", callDataArray);
      console.log(res, "res");

    }

  }

  return (
    <div className="h-screen w-full">
      <SearchBox openAIBox={openAIBox} setOpenAIBox={setOpenAIBox} />
      <ResponsiveDialogComponent
        open={addExpenseBox}
        onOpenChange={setAddExpenseBox}
      >
        <ResponsiveDialogComponentContent className="h-fit">
          <ResponsiveDialogComponentHeader className="w-full">
            <ResponsiveDialogComponentTitle>
              <p>Add Expense</p>
            </ResponsiveDialogComponentTitle>
            <ResponsiveDialogComponentDescription className="">
              <Formik
                initialValues={{
                  amount: 0,
                  description: "",
                  paidBy: "",
                  category: "",
                  date: new Date(),
                  splitArray: splitArray,
                  unequallySplitArray: unequallySplitArray,
                  equalSplit: true,
                }}
                onSubmit={(values, action) => {
                  // action.resetForm()
                  console.log(values);
                  handleAddExpense(values);
                }}
              >
                {(formik) => (
                  <Form className="flex flex-col">
                    <div className="flex items-end justify-center text-6xl gap-1 w-full mb-6">
                      <Input
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setAmount(Number(e.target.value));
                          formik.setFieldValue(
                            "amount",
                            Number(e.target.value)
                          );

                          // if amount becomes 0, then reset the splitArray to default values
                          if (Number(e.target.value) === 0) {
                            setSplitArray((prev) => {
                              const newArray = [...prev];
                              newArray.forEach((item, index) => {
                                newArray[index].isChecked = false;
                                newArray[index].amount = 0;
                              });
                              return newArray;
                            });

                            setNumberOfChecked(0);
                          }
                        }}
                        type="text"
                        placeholder="0"
                        className="focus-visible:ring-0 border-none rounded-none text-6xl h-24 text-center w-[180px]"
                        inputMode="numeric"
                        id="amount"
                        name="amount"
                        maxLength={4}
                      />
                      <p className="text-3xl -translate-y-4">USD</p>
                    </div>
                    <div className="flex justify-between w-[90%] gap-3 m-auto">
                      <div className="w-[60%]">
                        <Field
                          as={Input}
                          type="text"
                          placeholder="Description"
                          className="text-sm focus-visible:ring-0"
                          id="description"
                          name="description"
                        />
                      </div>
                      <div className="w-[40%]">
                        <Select
                          onValueChange={(value) => {
                            formik.setFieldValue("paidBy", value);
                          }}
                        >
                          <SelectTrigger className="w-full focus-visible:ring-0 active:ring-0 focus:ring-0">
                            <SelectValue placeholder="Paid By" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {MembersArray.map((item: any, index: number) => (
                                <SelectItem value={item.address}>
                                  {/* picture and text */}

                                  <div className="flex items-center gap-3">
                                    <img
                                      src="/man.png"
                                      alt="man"
                                      className="h-6 w-6"
                                    />
                                    <p>{item.name}</p>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center mt-5 w-[90%] m-auto gap-3">
                      <div className="w-[60%]">
                        <Select
                          onValueChange={(value) => {
                            formik.setFieldValue("category", value);
                          }}
                        >
                          <SelectTrigger className="w-full focus-visible:ring-0 active:ring-0 focus:ring-0">
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Category</SelectLabel>
                              <SelectItem value="food">
                                {/* picture and text */}

                                <div className="flex items-center gap-3">
                                  <img src="/burger.png" className="h-6 w-6" />
                                  <p>Food</p>
                                </div>
                              </SelectItem>
                              <SelectItem value="fuel">
                                <div className="flex items-center gap-3">
                                  <img src="/fuel.png" className="h-6 w-6" />
                                  <p>Fuel</p>
                                </div>
                              </SelectItem>
                              <SelectItem value="shopping">
                                <div className="flex items-center gap-3">
                                  <img
                                    src="/shopping.png"
                                    className="h-6 w-6"
                                  />
                                  <p>Shopping</p>
                                </div>
                              </SelectItem>
                              <SelectItem value="cab">
                                <div className="flex items-center gap-3">
                                  <img src="/car.png" className="h-6 w-6" />
                                  <p>Cab</p>
                                </div>
                              </SelectItem>
                              <SelectItem value="grocery">
                                <div className="flex items-center gap-3">
                                  <img
                                    src="/vegetable.png"
                                    className="h-6 w-6"
                                  />
                                  <p>Grocery</p>
                                </div>
                              </SelectItem>
                              <SelectItem value="train">
                                <div className="flex items-center gap-3">
                                  <img src="/train.png" className="h-6 w-6" />
                                  <p>Train</p>
                                </div>
                              </SelectItem>
                              <SelectItem value="sports">
                                <div className="flex items-center gap-3">
                                  <img src="/sports.png" className="h-6 w-6" />
                                  <p>Sports</p>
                                </div>
                              </SelectItem>
                              <SelectItem value="temple">
                                <div className="flex items-center gap-3">
                                  <img src="/temple.png" className="h-6 w-6" />
                                  <p>Temple</p>
                                </div>
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-[40%]">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon
                                className="mr-2 h-4 w-4"
                                mode="single"
                              />
                              {formik.values.date ? (
                                format(formik.values.date, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={formik.values.date}
                              onSelect={(date) => {
                                formik.setFieldValue("date", date);
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <div className="p-7 pb-3 flex flex-col gap-3">
                      <p className="text-lg font-bold text-center">Split</p>
                      <Tabs
                        defaultValue="equally"
                        className="w-full flex flex-col items-center"
                        onValueChange={(value) => {
                          if (value === "equally") {
                            formik.setFieldValue("equalSplit", true);
                            setEqualSplit(true);
                            setUnequallySplitArray((prev) => {
                              const newArray = [...prev];
                              newArray.forEach((item, index) => {
                                newArray[index].isChecked = false;
                                newArray[index].amount = 0;
                              });

                              formik.setFieldValue(
                                "unequallySplitArray",
                                newArray
                              );
                              return newArray;
                            });
                          } else {
                            formik.setFieldValue("equalSplit", false);
                            setEqualSplit(false);

                            setSplitArray((prev) => {
                              const newArray = [...prev];
                              newArray.forEach((item, index) => {
                                newArray[index].isChecked = false;
                                newArray[index].amount = 0;
                              });

                              formik.setFieldValue("splitArray", newArray);
                              return newArray;
                            });

                            formik.setFieldValue("splitArray", splitArray);
                          }
                        }}
                      >
                        <TabsList className="rounded-full">
                          <TabsTrigger
                            value="equally"
                            className="data-[state=active]:bg-[#81B29A] data-[state=active]:text-white data-[state=active]:rounded-full"
                          >
                            Equally
                          </TabsTrigger>
                          <TabsTrigger
                            value="unequally"
                            className="data-[state=active]:bg-[#81B29A] data-[state=active]:text-white data-[state=active]:rounded-full"
                          >
                            Unequally
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent
                          value="equally"
                          className="w-full flex items-start flex-col focus-visible:ring-0"
                        >
                          <p className="py-3">Select to Split</p>
                          <Carousel
                            opts={{
                              align: "start",
                            }}
                            className="w-full"
                          >
                            <CarouselContent className="w-full">
                              {MembersArray.map((item: any, index: number) => (
                                <CarouselItem className="basis-1/3" key={index}>
                                  <div className="flex flex-col gap-1">
                                    <Checkbox
                                      className="peer sr-only"
                                      id={`splitArray${index + 1}`}
                                      checked={
                                        splitArray[index] &&
                                        splitArray[index].isChecked
                                      }
                                      name={`splitArray[${index}].isChecked`}
                                      onCheckedChange={(checked: boolean) => {
                                        // if amount is 0, then return
                                        if (amount === 0) {
                                          return;
                                        }
                                        setSplitArray((prev) => {
                                          const newArray = [...prev];
                                          newArray[index].isChecked = checked;

                                          const newNumberOfChecked =
                                            newArray.filter(
                                              (item) => item.isChecked
                                            ).length;

                                          console.log(
                                            newNumberOfChecked,
                                            "newNumberOfChecked"
                                          );
                                          newArray.forEach((item, i) => {
                                            if (item.isChecked) {
                                              newArray[i].amount = Number(
                                                (
                                                  amount / newNumberOfChecked
                                                ).toFixed(2)
                                              );
                                            } else {
                                              newArray[i].amount = 0;
                                            }
                                          });
                                          formik.setFieldValue(
                                            "splitArray",
                                            newArray
                                          );
                                          return newArray;
                                        });
                                      }}
                                    />
                                    <Label
                                      htmlFor={`splitArray${index + 1}`}
                                      className="flex md:w-[110%] flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#81B29A] [&:has([data-state=checked])]:border-[#81B29A]"
                                    >
                                      <img
                                        src="/man.png"
                                        alt="man"
                                        className="mb-3 h-8  w-8 "
                                      />
                                      <div className="flex flex-col items-center gap-2">
                                        <p>{item.name}</p>
                                        {splitArray[index] &&
                                          splitArray[index].isChecked ? (
                                          <p className="text-xs">
                                            {(amount / numberOfChecked).toFixed(
                                              2
                                            )}{" "}
                                            USDC
                                          </p>
                                        ) : (
                                          <p>0 USDC</p>
                                        )}
                                      </div>
                                    </Label>
                                  </div>
                                </CarouselItem>
                              ))}
                            </CarouselContent>
                          </Carousel>
                        </TabsContent>
                        <TabsContent
                          value="unequally"
                          className="w-full relative"
                        >
                          <div className="h-[30px] w-full absolute bottom-0 right-0 border bg-white z-50 rounded-t-md flex justify-between px-4 text-xs items-center">
                            <p>
                              People {numberOfUnequallyChecked}/
                              {MembersArray.length}
                            </p>
                            <p>
                              Amount Remaining:{" "}
                              <span
                                className={
                                  amountRemaining > 0 ? "text-red-600" : ""
                                }
                              >
                                {amountRemaining}
                              </span>
                              /{amount} USDC
                            </p>
                          </div>
                          <div className="flex flex-col gap-3 border p-2 h-[250px] overflow-y-auto expense-box placeholder pb-[33px]">
                            {MembersArray.map((_: any, index: number) => (
                              <div
                                className="flex items-center justify-between space-x-2 p-3 rounded-xl bg-gray-50"
                                key={index}
                              >
                                <div className="flex gap-3 items-center">
                                  <Checkbox
                                    id={`unequallySplitArray${index}`}
                                    name={`unequallySplitArray[${index}].isChecked`}
                                    className="data-[state=checked]:bg-[#81B29A] focus-visible:ring-0 border border-gray-300 bg-gray-200"
                                    checked={
                                      unequallySplitArray[index] &&
                                      unequallySplitArray[index].isChecked
                                    }
                                    onCheckedChange={(checked: boolean) => {
                                      // if amount is 0, then return
                                      if (amount === 0) {
                                        return;
                                      }
                                      setUnequallySplitArray((prev) => {
                                        const newArray = [...prev];
                                        newArray[index].isChecked = checked;

                                        const newNumberOfChecked =
                                          newArray.filter(
                                            (item) => item.isChecked
                                          ).length;

                                        setNumberOfUnequallyChecked(
                                          newNumberOfChecked
                                        );

                                        formik.setFieldValue(
                                          "unequallySplitArray",
                                          newArray
                                        );

                                        return newArray;
                                      });

                                      if (!checked) {
                                        setAmountRemaining(
                                          amountRemaining +
                                          unequallySplitArray[index].amount
                                        );

                                        // reset the input field to 0, when you check it back after uncheck the input should be 0, then we can modifiy the amount
                                        if (
                                          !unequallySplitArray[index].isChecked
                                        ) {
                                          formik.setFieldValue(
                                            `unequallySplitArray[${index}].amount`,
                                            0
                                          );

                                          setUnequallySplitArray((prev) => {
                                            const newArray = [...prev];
                                            newArray[index].amount = 0;
                                            return newArray;
                                          });
                                        }
                                      }
                                    }}
                                  />
                                  <Label
                                    htmlFor="terms2"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  />
                                  <div className="flex gap-4 items-center">
                                    <Avatar className="h-10 w-10">
                                      <AvatarImage src="/woman.png" />
                                      <AvatarFallback>JD</AvatarFallback>
                                    </Avatar>

                                    <p>You</p>
                                  </div>
                                </div>
                                <Field
                                  as={Input}
                                  name={`unequallySplitArray[${index}].amount`}
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ) => {
                                    unequallySplitArray[index].amount = Number(
                                      e.target.value
                                    );

                                    setAmountRemaining(
                                      amount -
                                      unequallySplitArray.reduce(
                                        (acc, item) => acc + item.amount,
                                        0
                                      )
                                    );
                                    formik.setFieldValue(
                                      `unequallySplitArray[${index}].amount`,
                                      Number(e.target.value)
                                    );
                                  }}
                                  type="text"
                                  placeholder="0"
                                  className="w-20 focus-visible:ring-0"
                                  disabled={
                                    !unequallySplitArray[index].isChecked
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        </TabsContent>
                      </Tabs>

                      {gaslessTransactionLoading ? (
                        <Button disabled>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Please wait
                        </Button>
                      ) : (
                        <Button
                          className="bg-[#81B29A] hover:bg-[#81B29A] mt-5 w-full"
                          type="submit"
                          disabled={
                            formik.values.equalSplit
                              ? numberOfChecked === 0
                              : amountRemaining !== 0
                          }
                        >
                          Submit Expense
                        </Button>
                      )}
                    </div>
                  </Form>
                )}
              </Formik>
            </ResponsiveDialogComponentDescription>
          </ResponsiveDialogComponentHeader>
        </ResponsiveDialogComponentContent>
      </ResponsiveDialogComponent>
      <ResponsiveDialogComponent
        open={addMemberBox}
        onOpenChange={setAddMemberBox}
      >
        <ResponsiveDialogComponentContent>
          <ResponsiveDialogComponentHeader>
            <ResponsiveDialogComponentTitle>
              Add Group Member
            </ResponsiveDialogComponentTitle>
            <ResponsiveDialogComponentDescription>
              <Formik
                initialValues={{
                  name: "",
                  email: "",
                  phone: "",
                  wallet: "",
                  avatarPath: "/user.png",
                }}
                onSubmit={(values, action) => {
                  // console.log(values);
                  handleAddGroupMember(values);
                }}
              >
                {(formik) => (
                  <Form>
                    <div className="w-full pt-6 flex items-center flex-col lg:flex-row gap-4">
                      <div>
                        <ResponsiveDialogComponent
                          open={openAvatarModal}
                          onOpenChange={setOpenAvatarModal}
                        >
                          <ResponsiveDialogComponentContent>
                            <ResponsiveDialogComponentHeader>
                              <ResponsiveDialogComponentTitle>
                                <p>Select an Emoji</p>
                              </ResponsiveDialogComponentTitle>
                              <ResponsiveDialogComponentDescription>
                                <div className="grid grid-cols-3 grid-flow-row grid-rows-3 w-full place-items-center pt-5 gap-6">
                                  {emoji.map((item, index) => (
                                    <div
                                      key={index}
                                      className="border rounded-xl p-4 flex flex-col gap-2 aspect-square h-fit items-center cursor-pointer hover:bg-muted"
                                    >
                                      <img
                                        src={item.imgpath}
                                        alt={item.name}
                                        className="h-16 w-16"
                                        onClick={() => {
                                          formik.setFieldValue(
                                            "avatarPath",
                                            item.imgpath
                                          );
                                          setOpenAvatarModal(false);
                                        }}
                                      />
                                      {/* <p>Man</p> */}
                                    </div>
                                  ))}
                                </div>
                              </ResponsiveDialogComponentDescription>
                            </ResponsiveDialogComponentHeader>
                          </ResponsiveDialogComponentContent>
                        </ResponsiveDialogComponent>

                        <Avatar
                          className="w-32 h-32 relative overflow-visible cursor-pointer"
                          onClick={() => setOpenAvatarModal((prev) => !prev)}
                        >
                          <AvatarImage src={formik.values.avatarPath} />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex flex-col w-full gap-2">
                        <Field
                          as={Input}
                          name="name"
                          id="name"
                          type="text"
                          placeholder="Name"
                          className="w-full focus-visible:ring-0"
                        />
                        <div className="flex items-center gap-3">
                          <Field
                            as={Input}
                            name="email"
                            id="email"
                            type="text"
                            placeholder="Email"
                            className="w-full focus-visible:ring-0"
                          />
                          <Field
                            as={Input}
                            name="phone"
                            id="phone"
                            type="text"
                            placeholder="Phone"
                            className="w-full focus-visible:ring-0"
                          />
                        </div>
                        <Field
                          as={Input}
                          name="wallet"
                          id="wallet"
                          type="text"
                          placeholder="Wallet Address (0x..)"
                          className="w-full focus-visible:ring-0"
                        />
                      </div>
                    </div>
                    {gaslessTransactionLoading ? (
                      <Button disabled>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Please wait
                      </Button>
                    ) : (
                      <Button
                        className="bg-[#81B29A] hover:bg-[#81B29A] w-full mt-4"
                        type="submit"
                      >
                        Add Member
                      </Button>
                    )}
                  </Form>
                )}
              </Formik>
            </ResponsiveDialogComponentDescription>
          </ResponsiveDialogComponentHeader>
        </ResponsiveDialogComponentContent>
      </ResponsiveDialogComponent>

      <ResponsiveDialogComponent
        open={openPayAllBox}
        onOpenChange={setOpenPayAllBox}
      >
        <ResponsiveDialogComponentContent>
          <ResponsiveDialogComponentHeader>
            <ResponsiveDialogComponentTitle>
              Clear Dues
            </ResponsiveDialogComponentTitle>
            <ResponsiveDialogComponentDescription className="pt-6">
              {batchingLoading ? (
                <div className="flex items-center justify-center flex-col mb-5">
                  <img src="/batching.gif" alt="loader" className="h-32 w-32" />
                  <p className="text-lg font-semibold text-center">
                    Processing Payment
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-8">
                  <div>
                    <Formik
                      initialValues={{
                        amount: dueRemaining,
                        membersDuesArray: membersDuesArray,
                        token: "LINK",
                      }}
                      onSubmit={(values, _) => handlePayDue(values)}
                    >
                      {(formik) => (
                        <Form className="flex flex-col gap-5 mb-1">
                          <div className="flex items-center justify-center flex-col gap-2">
                            <p className="">Total Due</p>
                            <p className="text-3xl text-[#c34e4c] font-semibold">
                              {dueRemaining} USD
                            </p>
                          </div>
                          <p className="ml-2">Select Token</p>

                          <Carousel
                            opts={{
                              align: "start",
                            }}
                            className="w-full"
                          >
                            <CarouselContent className="w-full">
                              {tokenPricesArray &&
                                tokenPrices.length > 0 &&
                                tokenPrices.map((item: any, index: number) => (
                                  <CarouselItem
                                    className="basis-1/3"
                                    key={index}
                                  >
                                    <div className="flex flex-col gap-1">
                                      <Checkbox
                                        className="peer sr-only"
                                        id={`tokenPricesArray${index + 1}`}
                                        name={`tokenPricesArray[${index}].isChecked`}
                                        checked={
                                          tokenPricesArray[index] &&
                                          tokenPricesArray[index].isChecked
                                        }
                                        onCheckedChange={(checked: boolean) => {
                                          setTokenPricesArray((prev: any) => {
                                            //  when one token is checked from the list, then uncheck the rest of the tokens
                                            console.log(item.name, "item.name");
                                            const newArray = prev.map(
                                              (item: any, i: number) => {
                                                if (index === i) {
                                                  return {
                                                    ...item,
                                                    isChecked: checked,
                                                  };
                                                } else {
                                                  return {
                                                    ...item,
                                                    isChecked: false,
                                                  };
                                                }
                                              }
                                            );
                                            return newArray;
                                          });

                                          formik.setFieldValue(
                                            "token",
                                            item.name
                                          );
                                        }}
                                      />
                                      <Label
                                        htmlFor={`tokenPricesArray${index + 1}`}
                                        className="flex md:w-[110%] flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#81B29A] [&:has([data-state=checked])]:border-[#81B29A]"
                                      >
                                        <img
                                          src={`/${item.name.toLowerCase()}.png`}
                                          alt="usdc"
                                          className="mb-3 h-8  w-8 "
                                        />
                                        <div className="flex flex-col items-center gap-2">
                                          <p>{item.name.toUpperCase()}</p>
                                          <p>
                                            {parseFloat(
                                              (
                                                dueRemaining / item.price
                                              ).toFixed(2)
                                            )}{" "}
                                            {item.name.toUpperCase()}
                                          </p>
                                        </div>
                                      </Label>
                                    </div>
                                  </CarouselItem>
                                ))}
                            </CarouselContent>
                          </Carousel>

                          <p className="ml-2">Select Users to Pay</p>
                          <div className="flex flex-col gap-4">
                            <Carousel
                              opts={{
                                align: "start",
                              }}
                              className="w-full"
                            >
                              <CarouselContent className="w-full">
                                {membersDuesArray &&
                                  membersDuesArray.length > 0 &&
                                  membersDuesArray.map(
                                    (item: any, index: number) => (
                                      <CarouselItem
                                        className="basis-1/3"
                                        key={index}
                                      >
                                        <div className="flex flex-col gap-1">
                                          <Checkbox
                                            className="peer sr-only"
                                            id={`membersDuesArray${index + 1}`}
                                            checked={
                                              membersDuesArray[index] &&
                                              membersDuesArray[index].isChecked
                                            }
                                            name={`membersDuesArray[${index}].isChecked`}
                                            onCheckedChange={(
                                              checked: boolean
                                            ) => {
                                              setMembersDuesArray(
                                                (prev: any) => {
                                                  const newArray = [...prev];
                                                  newArray[index].isChecked =
                                                    checked;

                                                  // substract the dueRemaining amount with the value which is checked

                                                  if (checked) {
                                                    setDueRemaining(
                                                      dueRemaining -
                                                      newArray[index].amount
                                                    );
                                                  }

                                                  if (!checked) {
                                                    setDueRemaining(
                                                      dueRemaining +
                                                      newArray[index].amount
                                                    );
                                                  }
                                                  formik.setFieldValue(
                                                    "membersDuesArray",
                                                    newArray
                                                  );
                                                  return newArray;
                                                }
                                              );
                                            }}
                                          />
                                          <Label
                                            htmlFor={`membersDuesArray${index + 1
                                              }`}
                                            className="flex md:w-[110%] flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#81B29A] [&:has([data-state=checked])]:border-[#81B29A]"
                                          >
                                            <img
                                              src="/man.png"
                                              alt="man"
                                              className="mb-3 h-8  w-8 "
                                            />
                                            <div className="flex flex-col items-center gap-2">
                                              <p>{item.name}</p>
                                              <p>{item.amount} USD</p>
                                            </div>
                                          </Label>
                                        </div>
                                      </CarouselItem>
                                    )
                                  )}
                              </CarouselContent>
                            </Carousel>
                          </div>
                          <Button
                            className="bg-[#81B29A] hover:bg-[#81B29A] w-full"
                            type="submit"
                          >
                            Pay All
                          </Button>
                        </Form>
                      )}
                    </Formik>
                  </div>
                </div>
              )}
            </ResponsiveDialogComponentDescription>
          </ResponsiveDialogComponentHeader>
        </ResponsiveDialogComponentContent>
      </ResponsiveDialogComponent>

      <div className="h-[200px] w-full">
        <img
          src="/cover.png"
          alt="cover"
          className="object-cover h-full w-full"
          style={{ objectPosition: "center 30%" }}
        />
      </div>

      <div className="px-10 lg:px-24 -translate-y-6 flex justify-between flex-col md:flex-row">
        <div className="flex items-center gap-3">
          <Avatar className="h-32 w-32 lg:h-[150px] lg:w-[150px] -translate-y-2 lg:-translate-y-6">
            <AvatarImage src="/travel.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex-col justify-start gap-2 flex text-[#3D405B]">
            <p className="text-2xl lg:text-4xl font-semibold mt-4 lg:mt-0">
              {groupDetails?.groupName}
            </p>
            <p>
              {groupDetails &&
                moment(groupDetails?.groupFrom, "DD-MM-YYYY").format(
                  "DD MMM YYYY"
                )}{" "}
              to{" "}
              {groupDetails &&
                moment(groupDetails?.groupTo, "DD-MM-YYYY").format(
                  "DD MMM YYYY"
                )}
            </p>
          </div>
        </div>
        <div className="-translate-y-5 mt-8 flex gap-3 items-center flex-row-reverse">
          <div className="flex">
            <Avatar className="lg:h-12 lg:w-12 -ml-4 first:ml-0">
              <AvatarImage src="/man.png" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Avatar className="h-12 w-12 -ml-4">
              <AvatarImage src="/woman.png" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Avatar className="h-12 w-12 -ml-4">
              <AvatarImage src="/woman1.png" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
          {/* <div className="w-12 h-12 rounded-full border-2 grid place-content-center">
            <UserRoundPlus className="text-[#3D405B]" />
          </div> */}
          <Button
            variant={"outline"}
            onClick={() => setOpenAIBox((prev: boolean) => !prev)}
          >
            <Sparkles className="mr-2 h-4 w-4" /> Ask AI
          </Button>

          <Button
            variant={"default"}
            className="bg-[#81B29A] hover:bg-[#81B29A]"
            onClick={() => setOpenPayAllBox((prev: boolean) => !prev)}
          >
            <HandCoins className="mr-2 h-4 w-4" /> Pay All
          </Button>
        </div>
      </div>
      <div className="px-10 lg:px-24 flex items-center gap-3">
        <Card className="h-fit w-64 border-2 rounded-xl flex flex-col justify-start">
          <CardHeader className="p-4 pb-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Total Group Spending</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 pb-6">
            <p className="text-3xl font-bold text-[#3D405B]">
              {groupSpending} USD
            </p>
          </CardContent>
        </Card>
        <Card className="h-fit w-64 border-2 rounded-xl">
          <CardHeader className="p-4 pb-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Your Spending</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 pb-6">
            <p className="text-3xl font-bold text-[#3D405B]">5000 USD</p>
          </CardContent>
        </Card>
      </div>
      <div className="px-10 lg:px-24 pb-6 flex flex-col lg:flex-row items-center gap-6">
        <div className="h-[500px] overflow-y-auto border my-8 rounded-lg lg:w-[70%] w-full bg-white flex flex-col expense-box gap-5 relative">
          <div className="p-4 pl-5 border-b font-semibold text-xl sticky top-0 bg-white z-[20] flex justify-between items-center">
            <p className="text-sm">Expense</p>
            <Button
              size={"sm"}
              // variant={"outline"}
              className="focus-visible:ring-0 bg-[#81B29A] hover:bg-[#81B29A]"
              onClick={() => setAddExpenseBox((prev: boolean) => !prev)}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Expense
            </Button>
          </div>
          {groupExpenses &&
            groupExpenses.map((expense: any, index: number) => (
              <div className="lg:pt-1 pl-6 lg:px-8 bg-white pr-4" key={index}>
                <div className="flex items-center gap-3 justify-between">
                  <div className="flex items-center lg:gap-5 gap-3">
                    <div className="flex justify-center items-center lg:items-end flex-col">
                      <p className="lg:text-lg font-semibold">24 Jan</p>
                      <p className="text-xs">12:00pm</p>
                    </div>
                    <div className="flex gap-3 items-center translate-y-1">
                      <Avatar className="lg:h-14 lg:w-14 -ml-4 first:ml-0">
                        <AvatarImage src="/travel.png" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="text-sm lg:text-lg font-semibold">
                          Resort Booking
                        </p>
                        <p className="text-xs">
                          Paid by {nameAddressMap.get(expense.creditor)}
                        </p>
                        {/* <p className="text-sm ">24 Jan 2024, 12:00 PM</p> */}
                      </div>
                    </div>
                  </div>

                  <div className="flex ml-6 items-center">
                    <Avatar className="h-8 w-8 -ml-4 first:ml-0">
                      <AvatarImage src="/man.png" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>

                    <Avatar className="h-8 w-8 -ml-4">
                      <AvatarImage src="/woman.png" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-8 w-8 -ml-4">
                      <AvatarImage src="/woman1.png" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                  </div>
                  <div
                    className={` font-bold ${index !== 1 ? "text-red-600" : "text-green-600"
                      }`}
                  >
                    {Number(expense.total)} USD
                  </div>
                </div>

                <div
                  className={` ${index === 7 ? "bg-white" : "bg-gray-200"
                    } h-[1px] rounded-xl w-full mt-4 mb-0 translate-y-3`}
                />
              </div>
            ))}
        </div>
        <div className="h-[500px] overflow-y-auto border my-8 rounded-lg lg:w-[30%] w-full bg-white flex flex-col expense-box gap-10 relative">
          <div className="p-4 border-b font-semibold text-xl sticky top-0 bg-white z-[20] flex justify-between items-center">
            <div>
              <p className="text-sm">Group Members</p>
              <p className="text-xs font-normal">
                {MembersArray.length} Members
              </p>
            </div>
            <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    {/* <div className="h-8 w-8 grid place-content-center border-2 rounded-full border-slate-300"> */}
                    <div
                      className="h-9 w-9 grid place-content-center rounded-full bg-[#81B29A]"
                      onClick={() => setAddMemberBox((prev: boolean) => !prev)}
                    >
                      <Plus className="h-5 w-5 text-white" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add New Members</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          {MembersArray.map((member: any, index: number) => (
            <div
              className="flex gap-3 items-center justify-between ml-3 -translate-y-4 px-3"
              key={index}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-14 w-14">
                  <AvatarImage src="/man.png" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-lg font-semibold">{member.name}</p>
                  {/* <p className="text-xs text-green-700 font-semibold">
                    Fidal and Manvik owe 20 USDC
                  </p> */}
                  <p className="text-xs text-green-700 font-semibold">
                    {member.address.slice(0, 10) +
                      "...." +
                      member.address.slice(-6)}
                  </p>
                  {/* <p className="text-sm ">24 Jan 2024, 12:00 PM</p> */}
                </div>
              </div>
              {/* {index === 0 && (
                <div>
                  <Badge className="bg-[#81B29A]">Admin</Badge>
                </div>
              )} */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
