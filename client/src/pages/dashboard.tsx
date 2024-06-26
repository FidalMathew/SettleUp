import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  BadgePoundSterling,
  CircleDollarSign,
  Loader2,
  Plus,
  SmilePlus,
  Wallet,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {Progress} from "@/components/ui/progress";
import {Separator} from "@radix-ui/react-separator";
import {Button} from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartToolTip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {useEffect, useState} from "react";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {useRouter} from "next/router";
import {DatePickerWithRange} from "@/components/ui/DateRangePicker";
import {
  ResponsiveDialogComponent,
  ResponsiveDialogComponentContent,
  ResponsiveDialogComponentDescription,
  ResponsiveDialogComponentHeader,
  ResponsiveDialogComponentTitle,
} from "@/components/ui/ResponsiveDialog";
import {usePrivy, useWallets} from "@privy-io/react-auth";
import axios from "axios";

import {Formik, Form, Field} from "formik";
import {useContractFunctionContextHook} from "@/Context/ContractContext";
import moment from "moment";

const data = [
  {
    name: "Jan",
    uv: 4000,
    pv: 2400,
    cv: 2400,
    amt: 2400,
  },
  {
    name: "Feb",
    uv: 3000,
    pv: 1398,
    cv: 2210,
    amt: 2210,
  },
  {
    name: "Mar",
    uv: 2000,
    pv: 9800,
    cv: 2290,
    amt: 2290,
  },
  {
    name: "Apr",
    uv: 2780,
    pv: 3908,
    cv: 2000,
    amt: 2000,
  },
  {
    name: "May",
    uv: 1890,
    pv: 4800,
    cv: 2181,
    amt: 2181,
  },
  {
    name: "Jun",
    uv: 2390,
    pv: 3800,
    cv: 2500,
    amt: 2500,
  },
  {
    name: "Jul",
    uv: 3490,
    pv: 4300,
    cv: 2100,
    amt: 2100,
  },
];

export default function Dashboard() {
  const {
    performBatchTransaction,
    getContractInstance,
    gaslessTransaction,
    groups,
    totalCredit,
    totalDebt,
    fetchName,
    fetchNameAndAvatar,
    getGroupMembers,
  } = useContractFunctionContextHook();

  const [openGroupCreation, setOpenGroupCreation] = useState(false);
  const [groupsInfo, setGroupsInfo] = useState<any[] | undefined>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // const {ready, user, logout} = usePrivy();
  const {ready, wallets} = useWallets();
  console.log(ready, wallets, "wallets");
  useEffect(() => {
    if (ready && wallets.length === 0) {
      router.push("/");
    }
  }, [wallets, ready]);

  useEffect(() => {
    console.log(groups, "--groups--");
    setGroupsInfo(groups);
  }, [groups, loading]);

  function formatDate(dateString: string) {
    // Create a new Date object from the input string
    const date = new Date(dateString);

    // Extract the day, month, and year
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-based
    const year = date.getFullYear();

    // Format the date as DD-MM-YYYY
    const formattedDate = `${day}-${month}-${year}`;

    return formattedDate;
  }

  const handleCreateGroup = async (values: any) => {
    setLoading(true);
    try {
      const {groupName, dateRange, category} = values;

      if (gaslessTransaction) {
        const to = formatDate(dateRange.to);
        const from = formatDate(dateRange.from ? dateRange.from : dateRange.to);
        await gaslessTransaction("createGroup", [
          groupName,
          category,
          from,
          to,
        ]);

        setOpenGroupCreation(false);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const [name, setName] = useState<string>("");
  const [avatar, setAvatar] = useState<any>();

  useEffect(() => {
    if (wallets[0] && wallets[0].address && fetchNameAndAvatar) {
      (async function () {
        const fetchedName = await fetchNameAndAvatar(wallets[0].address);
        console.log(fetchedName, "namef");
        setName(fetchedName);
      })();
    }
  }, [wallets, fetchName]);

  console.log(groups, "groupsInfofucku");

  const fetchGroupMembers = async () => {
    try {
      let avatarsArray = [];
      if (groups && getGroupMembers && fetchNameAndAvatar) {
        const groupIds = groups.map((group: any) => group.groupNumber);

        fetchNameAndAvatar;

        const groupMembersPromises = groupIds.map(async (groupId) => {
          const members = await getGroupMembers(groupId);
          return members;
        });

        const groupMembersArrays = await Promise.all(groupMembersPromises);
        for (const membersArray of groupMembersArrays) {
          const avatarPromises = membersArray.map(async (member: any) => {
            const [, avatarPath] = await fetchNameAndAvatar(member);
            return avatarPath;
          });

          const avatars = await Promise.all(avatarPromises);
          avatarsArray.push(avatars);
        }
      }

      setAvatar(avatarsArray);
      console.log(avatarsArray, "avatarsArray");
    } catch (error) {}
  };

  useEffect(() => {
    fetchGroupMembers();
  }, []);

  return (
    <div className="h-fit w-full relative px-4 pt-8 md:px-14 flex flex-col gap-7 dashboard">
      <ResponsiveDialogComponent
        open={openGroupCreation}
        onOpenChange={setOpenGroupCreation}
      >
        <ResponsiveDialogComponentContent>
          <ResponsiveDialogComponentHeader>
            <ResponsiveDialogComponentTitle>
              Create a New Group
            </ResponsiveDialogComponentTitle>
            <ResponsiveDialogComponentDescription>
              <Formik
                initialValues={{
                  groupName: "",
                  dateRange: {
                    from: new Date(),
                    to: new Date(),
                  },
                  category: "food",
                }}
                onSubmit={(values, _) => handleCreateGroup(values)}
              >
                {(formik) => (
                  <Form className="flex flex-col justify-start gap-6">
                    <div className="mt-5 flex item-center gap-4">
                      {/* <div>
                  <Input type="file" id="groupImage" className="hidden" />
                  <Label htmlFor="groupImage" className="cursor-pointer">
                    <div className="h-16 w-20 bg-gray-200 rounded-md grid place-content-center">
                      <SmilePlus />
                    </div>
                  </Label>
                </div> */}
                      <div className="flex flex-col justify-start gap-2 w-full">
                        {/* <Label htmlFor="groupName" className="text-xs ml-1">
                    Group Name
                  </Label> */}
                        <Field
                          as={Input}
                          id="groupName"
                          name="groupName"
                          placeholder="Enter Group Name"
                          className="focus-visible:ring-0 rounded-lg w-[97%]"
                        />
                      </div>
                    </div>
                    <div className="w-full">
                      <DatePickerWithRange formik={formik} className="" />
                    </div>
                    <div className="w-full">
                      <Carousel opts={{align: "start"}} className="w-full">
                        <RadioGroup
                          defaultValue="food"
                          className="w-full"
                          defaultChecked={true}
                          onValueChange={
                            (value) => formik.setFieldValue("category", value)
                            // console.log(value, "value")
                          }
                        >
                          <CarouselContent className="w-full">
                            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                              <div>
                                <RadioGroupItem
                                  value="travel"
                                  id="travel"
                                  className="peer sr-only"
                                />
                                <Label
                                  htmlFor="travel"
                                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#81B29A] [&:has([data-state=checked])]:border-[#81B29A]"
                                >
                                  <div className="flex items-center flex-col">
                                    <img
                                      src="/travel.png"
                                      className="h-10 w-10 mb-3"
                                    />
                                    <p>Travel</p>
                                  </div>
                                </Label>
                              </div>
                            </CarouselItem>
                            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                              <div>
                                <RadioGroupItem
                                  value="food"
                                  id="food"
                                  className="peer sr-only"
                                />
                                <Label
                                  htmlFor="food"
                                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#81B29A] [&:has([data-state=checked])]:border-[#81B29A]"
                                >
                                  <div className="flex items-center flex-col">
                                    <img
                                      src="/burger.png"
                                      className="h-10 w-10 mb-3"
                                    />
                                    <p>Food</p>
                                  </div>
                                </Label>
                              </div>
                            </CarouselItem>
                            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                              <div>
                                <RadioGroupItem
                                  value="fuel"
                                  id="fuel"
                                  className="peer sr-only"
                                />
                                <Label
                                  htmlFor="fuel"
                                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#81B29A] [&:has([data-state=checked])]:border-[#81B29A]"
                                >
                                  <div className="flex items-center flex-col">
                                    <img
                                      src="/fuel.png"
                                      className="h-10 w-10 mb-3"
                                    />
                                    <p>Fuel</p>
                                  </div>
                                </Label>
                              </div>
                            </CarouselItem>
                            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                              <div>
                                <RadioGroupItem
                                  value="shopping"
                                  id="shopping"
                                  className="peer sr-only"
                                />
                                <Label
                                  htmlFor="shopping"
                                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#81B29A] [&:has([data-state=checked])]:border-[#81B29A]"
                                >
                                  <div className="flex items-center flex-col">
                                    <img
                                      src="/shopping.png"
                                      className="h-10 w-10 mb-3"
                                    />
                                    <p>Shopping</p>
                                  </div>
                                </Label>
                              </div>
                            </CarouselItem>
                            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                              <div>
                                <RadioGroupItem
                                  value="cab"
                                  id="cab"
                                  className="peer sr-only"
                                />
                                <Label
                                  htmlFor="cab"
                                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#81B29A] [&:has([data-state=checked])]:border-[#81B29A]"
                                >
                                  <div className="flex items-center flex-col">
                                    <img
                                      src="/car.png"
                                      className="h-10 w-10 mb-3"
                                    />
                                    <p>Cab</p>
                                  </div>
                                </Label>
                              </div>
                            </CarouselItem>
                            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                              <div>
                                <RadioGroupItem
                                  value="grocery"
                                  id="grocery"
                                  className="peer sr-only"
                                />
                                <Label
                                  htmlFor="grocery"
                                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#81B29A] [&:has([data-state=checked])]:border-[#81B29A]"
                                >
                                  <div className="flex items-center flex-col">
                                    <img
                                      src="/vegetable.png"
                                      className="h-10 w-10 mb-3"
                                    />
                                    <p>Grocery</p>
                                  </div>
                                </Label>
                              </div>
                            </CarouselItem>
                            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                              <div>
                                <RadioGroupItem
                                  value="train"
                                  id="train"
                                  className="peer sr-only"
                                />
                                <Label
                                  htmlFor="train"
                                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#81B29A] [&:has([data-state=checked])]:border-[#81B29A]"
                                >
                                  <div className="flex items-center flex-col">
                                    <img
                                      src="/train.png"
                                      className="h-10 w-10 mb-3"
                                    />
                                    <p>Train</p>
                                  </div>
                                </Label>
                              </div>
                            </CarouselItem>
                            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                              <div>
                                <RadioGroupItem
                                  value="sports"
                                  id="sports"
                                  className="peer sr-only"
                                />
                                <Label
                                  htmlFor="sports"
                                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#81B29A] [&:has([data-state=checked])]:border-[#81B29A]"
                                >
                                  <div className="flex items-center flex-col">
                                    <img
                                      src="/sports.png"
                                      className="h-10 w-10 mb-3"
                                    />
                                    <p>Sports</p>
                                  </div>
                                </Label>
                              </div>
                            </CarouselItem>
                            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                              <div>
                                <RadioGroupItem
                                  value="temple"
                                  id="temple"
                                  className="peer sr-only"
                                />
                                <Label
                                  htmlFor="temple"
                                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#81B29A] [&:has([data-state=checked])]:border-[#81B29A]"
                                >
                                  <div className="flex items-center flex-col">
                                    <img
                                      src="/temple.png"
                                      className="h-10 w-10 mb-3"
                                    />
                                    <p>Temple</p>
                                  </div>
                                </Label>
                              </div>
                            </CarouselItem>
                          </CarouselContent>
                        </RadioGroup>
                      </Carousel>
                    </div>

                    {loading ? (
                      <Button
                        disabled
                        className="bg-[#88b59f] hover:bg-[#88b59f]"
                      >
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Please wait
                      </Button>
                    ) : (
                      <Button
                        className="bg-[#81B29A] hover:bg-[#81B29A] w-full"
                        type="submit"
                      >
                        Create
                      </Button>
                    )}
                  </Form>
                )}
              </Formik>
            </ResponsiveDialogComponentDescription>
          </ResponsiveDialogComponentHeader>
        </ResponsiveDialogComponentContent>
      </ResponsiveDialogComponent>

      <div className="h-fit mb-6 w-full flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarImage src={name && name[1]} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col justify-start text-[#3D405B]">
            <p className="text-xl font-Poppins font-semibold">
              Hi {name && name[0]}!
            </p>
            <p className="text-sm">Track your Group Expense</p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-row-reverse">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div
                  className="bg-black rounded-full h-12 w-12 grid place-content-center"
                  onClick={() => setOpenGroupCreation((prev) => !prev)}
                >
                  <Plus className="text-white cursor-pointer" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add Group</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div>
            {/* <DropdownMenu>
              <DropdownMenuTrigger>
                
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => wallets[0].disconnect()}
                  className="text-red-400"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}

            <Button variant={"outline"}>
              <Wallet className="mr-2 h-4 w-4" />{" "}
              {wallets[0] &&
                wallets[0]?.address.slice(0, 6) +
                  "..." +
                  wallets[0]?.address.slice(-4)}
            </Button>
          </div>
          <div>
            {/* <Button onClick={performBatchTransaction}>Create Group</Button> */}
            {/* <Button onClick={getContractInstance}>Contract Instance</Button> */}
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
        <Card className="w-[350px] h-fit border border-gray-500 bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-red-700 text-xl">
                Total Outstanding
              </CardTitle>
              <div>
                <img src="/usdc.png" alt="usdc" className="h-5 aspect-square" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[#3D405B]">{totalDebt} USD</p>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <div className="flex">
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
            <div>
              <div className="border grid place-content-center rounded-full border-black h-7 aspect-square">
                <ArrowRight className="" />
              </div>
            </div>
          </CardFooter>
        </Card>
        <Card className="w-[350px] h-fit border border-gray-500 bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-green-700 text-xl">
                Total Receivable
              </CardTitle>
              <div>
                <img src="/usdc.png" alt="usdc" className="h-5 aspect-square" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[#3D405B]">
              {totalCredit} USD
            </p>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <div className="flex">
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
            <div>
              <div className="border grid place-content-center rounded-full border-black h-7 aspect-square">
                <ArrowRight />
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
      <div className="">
        <div className="flex justify-between">
          <p className="font-semibold text-2xl">Groups</p>
          <Button
            size="sm"
            variant="outline"
            className="mr-7"
            onClick={() => setOpenGroupCreation((prev) => !prev)}
          >
            Add Group
          </Button>
        </div>

        {groups?.length === 0 && (
          <div className="flex justify-center items-center w-full h-[100px]">
            <p>No Groups Found</p>
          </div>
        )}
        {groups?.length !== 0 && (
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full p-6"
          >
            <CarouselContent className="">
              {groupsInfo &&
                groupsInfo.map((group, index) => (
                  <CarouselItem
                    key={index}
                    className="md:basis-1/2 lg:basis-1/3"
                  >
                    <div className="p-1">
                      <Card className="h-fit">
                        <CardHeader className="flex pt-4 pb-2 px-4 h-fit lg:px-4">
                          <div className="h-[10%] flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-12 w-12 -ml-4 first:ml-0">
                                <AvatarImage
                                  src={`/${group.groupCategory}.png`}
                                />
                                <AvatarFallback>JD</AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col justify-start">
                                <p className="text-sm lg:text-md font-semibold">
                                  {group.groupName}
                                </p>
                                <p className="text-[10px] lg:text-xs">
                                  {moment(group.groupFrom, "D-M-YYYY").format(
                                    "D MMM YYYY"
                                  )}{" "}
                                  -{" "}
                                  {moment(group.groupTo, "D-M-YYYY").format(
                                    "D MMM YYYY"
                                  )}
                                </p>
                              </div>
                            </div>
                            {/* <div className="flex gap-2 items-center">
                              <div className="rounded-full bg-yellow-500 h-2 w-2" />
                              <p className="text-xs">Unsettled Dues</p>
                            </div> */}
                          </div>
                        </CardHeader>
                        {/* <CardContent className="h-[110px] p-4 w-full mb-3">
                          <div className="flex justify-between items-center">
                            <div className="flex justify-start text-sm flex-col">
                              <p>Your Spending</p>
                              <p className="text-xl font-semibold">300 USDC</p>
                            </div>
                            <div className="flex items-end text-sm flex-col">
                              <p>Group Spending</p>
                              <p className="text-xl font-semibold">800 USDC</p>
                            </div>
                          </div>
                          <div className="pt-5">
                            <Progress
                              value={50}
                              className="h-[5px] rounded-[2px] bg-slate-900"
                              indicatorColor="bg-orange-500"
                            />
                          </div>
                        </CardContent> */}
                        {/* <Separator /> */}

                        <CardContent className="p-6 pb-3">
                          {/* <CardContent className="p-4 border-t border-slate-200"> */}
                          <div className="flex items-center justify-center w-full">
                            <div className="flex items-center gap-3">
                              <div className="flex">
                                {avatar &&
                                  avatar.length > 0 &&
                                  avatar[index] &&
                                  avatar[index].map((avatar: any) => (
                                    <div>
                                      <Avatar className="h-16 w-16 -ml-4 first:ml-0">
                                        <AvatarImage src={`${avatar}`} />
                                        <AvatarFallback>JD</AvatarFallback>
                                      </Avatar>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>

                        <CardFooter className="p-4 flex items-centerr justify-between flex-row-reverse">
                          <Button
                            size="sm"
                            variant={"outline"}
                            onClick={() =>
                              router.push(`/group/${group.groupNumber}`)
                            }
                          >
                            View Group
                          </Button>
                          <p className="text-xs pr-3">
                            {avatar &&
                              avatar.length > 0 &&
                              avatar[index] &&
                              avatar[index].length}{" "}
                            Members
                          </p>
                        </CardFooter>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext className="" />
          </Carousel>
        )}
      </div>
      <Separator className="bg-red-400 text-red-400" />
      {/* <div>
        <p className="font-semibold text-2xl">Expense History</p>

        <div className="flex justify-center items-center gap-5 flex-col lg:flex-row">
          <div className="h-[500px] overflow-y-auto border my-8 rounded-lg lg:w-[80%] w-full bg-white flex flex-col expense-box gap-5">
            {Array.from({length: 8}).map((_, index) => (
              <div className="pt-5 px-8 bg-white">
                <div className="flex items-center gap-3 justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex justify-center items-end flex-col">
                      <p className="text-lg font-semibold">24 Jan</p>
                      <p className="text-xs">12:00pm</p>
                    </div>
                    <div className="flex gap-3 items-center">
                      <Avatar className="h-14 w-14 -ml-4 first:ml-0">
                        <AvatarImage src="/travel.png" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="text-lg font-semibold">Resort Booking</p>
                        <p className="text-xs">
                          Trip to Bangalore - Paid by Manvik
                        </p>
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
                  <div className="text-red-800 font-bold">300 USDC</div>
                </div>
                <div className="bg-gray-200 h-[1px] rounded-xl w-full mt-4 mb-0 translate-y-3" />
              </div>
            ))}
          </div>
          <div className="h-[500px] border my-8 rounded-lg lg:w-[80%] w-full bg-white pt-8 pb-8 pl-7">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={500}
                height={300}
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <XAxis dataKey={"name"} />
                <YAxis
                  label={{
                    value: "Amount in USDC",
                    angle: -90,
                    position: "insideLeft",
                    offset: -10,
                  }}
                />
                <RechartToolTip />
                <Bar dataKey="pv" stackId="a" fill="#E07A5F" />
                <Bar dataKey="uv" stackId="a" fill="#82ca9d" />
                <Bar dataKey="cv" stackId="a" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div> */}
    </div>
  );
}
