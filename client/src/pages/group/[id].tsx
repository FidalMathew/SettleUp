import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {
  BadgePoundSterling,
  Bold,
  CircleDollarSign,
  DollarSign,
  Euro,
  Italic,
  Plus,
  Sparkles,
  Underline,
  UserRoundPlus,
} from "lucide-react";
import {useRouter} from "next/router";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {useState} from "react";
import {Input} from "@/components/ui/input";
import {
  ResponsiveDialogComponent,
  ResponsiveDialogComponentContent,
  ResponsiveDialogComponentDescription,
  ResponsiveDialogComponentHeader,
  ResponsiveDialogComponentTitle,
} from "@/components/ui/ResponsiveDialog";
import {Label} from "@/components/ui/label";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {Checkbox} from "@/components/ui/checkbox";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

export default function Groups() {
  const router = useRouter();
  const [openAIBox, setOpenAIBox] = useState(false);
  const [addExpenseBox, setAddExpenseBox] = useState(false);
  const [addMemberBox, setAddMemberBox] = useState(false);

  return (
    <div className="h-screen w-full">
      <ResponsiveDialogComponent
        open={addExpenseBox}
        onOpenChange={setAddExpenseBox}
      >
        <ResponsiveDialogComponentContent className="h-fit">
          <ResponsiveDialogComponentHeader>
            <ResponsiveDialogComponentTitle>
              Add Expense
            </ResponsiveDialogComponentTitle>
            <ResponsiveDialogComponentDescription className="">
              <div className="mt-5 w-full">
                <div className="flex items-end justify-center text-6xl gap-1 w-full mb-6">
                  <Input
                    type="text"
                    placeholder="0"
                    className="focus-visible:ring-0 border-none rounded-none text-6xl h-24 text-center w-[180px]"
                    inputMode="numeric"
                    maxLength={4}
                  />
                  <p className="text-3xl -translate-y-4">USDC</p>
                </div>
              </div>
              <div className="w-full flex justify-center">
                <Input
                  type="text"
                  placeholder="Description"
                  className="w-[90%] text-sm focus-visible:ring-0 border-none bg-gray-100"
                />
              </div>
              <div className="p-7 flex flex-col gap-3">
                <p className="text-lg font-bold text-center">Split</p>
                <Tabs
                  defaultValue="equally"
                  className="w-full flex flex-col items-start"
                >
                  <TabsList className="rounded-full">
                    <TabsTrigger
                      value="equally"
                      className="data-[state=active]:bg-purple-400 data-[state=active]:text-white data-[state=active]:rounded-full"
                    >
                      Equally
                    </TabsTrigger>
                    <TabsTrigger
                      value="password"
                      className="data-[state=active]:bg-purple-400 data-[state=active]:text-white data-[state=active]:rounded-full"
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
                        <CarouselItem className="basis-1/3">
                          <div className="">
                            <Checkbox id="option1" className="peer sr-only" />
                            <Label
                              htmlFor="option1"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                              <img
                                src="/man.png"
                                alt="man"
                                className="mb-3 h-8  w-8 "
                              />
                              23 USDC
                            </Label>
                          </div>
                        </CarouselItem>

                        <CarouselItem className="basis-1/3">
                          <div className="">
                            <Checkbox id="option2" className="peer sr-only" />
                            <Label
                              htmlFor="option2"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                              <img
                                src="/man.png"
                                alt="man"
                                className="mb-3 h-8  w-8 "
                              />
                              23 USDC
                            </Label>
                          </div>
                        </CarouselItem>
                        <CarouselItem className="basis-1/3">
                          <div className="">
                            <Checkbox id="option3" className="peer sr-only" />
                            <Label
                              htmlFor="option3"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                              <img
                                src="/man.png"
                                alt="man"
                                className="mb-3 h-8  w-8 "
                              />
                              23 USDC
                            </Label>
                          </div>
                        </CarouselItem>
                        <CarouselItem className="basis-1/3">
                          <div className="">
                            <Checkbox id="option4" className="peer sr-only" />
                            <Label
                              htmlFor="option4"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                              <img
                                src="/man.png"
                                alt="man"
                                className="mb-3 h-8  w-8 "
                              />
                              23 USDC
                            </Label>
                          </div>
                        </CarouselItem>
                      </CarouselContent>
                    </Carousel>
                  </TabsContent>
                  <TabsContent value="unequally">
                    Change your password here.
                  </TabsContent>
                </Tabs>
              </div>
            </ResponsiveDialogComponentDescription>
          </ResponsiveDialogComponentHeader>
        </ResponsiveDialogComponentContent>
      </ResponsiveDialogComponent>
      <Dialog open={addMemberBox} onOpenChange={setAddMemberBox}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <div className="h-[200px] w-full">
        <img
          src="/cover.png"
          alt="cover"
          className="object-cover h-full w-full"
          style={{objectPosition: "center 30%"}}
        />
      </div>

      <div className="px-10 lg:px-24 -translate-y-6 flex justify-between flex-col lg:flex-row">
        <div className="flex items-center gap-3">
          <Avatar className="h-32 w-32 lg:h-[150px] lg:w-[150px] -translate-y-2 lg:-translate-y-6">
            <AvatarImage src="/beach.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex-col justify-start gap-2 flex text-[#3D405B]">
            <p className="text-2xl lg:text-4xl font-semibold mt-4 lg:mt-0">
              Trip to Bangalore
            </p>
            <p>24 Jan 2024 to 28 Jan 2024</p>
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
          <div className="w-12 h-12 rounded-full border-2 grid place-content-center">
            <UserRoundPlus className="text-[#3D405B]" />
          </div>

          <Button
            variant={"outline"}
            onClick={() => setOpenAIBox((prev: boolean) => !prev)}
          >
            <Sparkles className="mr-2 h-4 w-4" /> Ask AI
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
            <p className="text-3xl font-bold text-[#3D405B]">5000 USDC</p>
          </CardContent>
        </Card>
        <Card className="h-fit w-64 border-2 rounded-xl">
          <CardHeader className="p-4 pb-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Your Spending</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 pb-6">
            <p className="text-3xl font-bold text-[#3D405B]">5000 USDC</p>
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
          {Array.from({length: 8}).map((_, index) => (
            <div className="lg:pt-1 pl-6 lg:px-8 bg-white">
              <div className="flex items-center gap-3 justify-between">
                <div className="flex items-center lg:gap-5">
                  <div className="flex justify-center lg:items-end flex-col">
                    <p className="text-lg font-semibold">24 Jan</p>
                    <p className="text-xs">12:00pm</p>
                  </div>
                  <div className="flex gap-3 items-center">
                    <Avatar className="lg:h-14 lg:w-14 -ml-4 first:ml-0">
                      <AvatarImage src="/beach.png" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm lg:text-lg font-semibold">
                        Resort Booking
                      </p>
                      <p className="text-xs">Paid by Manvik</p>
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
                <div className="text-slate-800 font-bold">300 USDC</div>
              </div>

              <div
                className={` ${
                  index === 7 ? "bg-white" : "bg-gray-200"
                } h-[1px] rounded-xl w-full mt-4 mb-0 translate-y-3`}
              />
            </div>
          ))}
        </div>
        <div className="h-[500px] overflow-y-auto border my-8 rounded-lg lg:w-[30%] w-full bg-white flex flex-col expense-box gap-10 relative">
          <div className="p-4 border-b font-semibold text-xl sticky top-0 bg-white z-[20] flex justify-between items-center">
            <p className="text-sm">Group Members</p>
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
          {Array.from({length: 4}).map((_, index) => (
            <div className="flex gap-3 items-center ml-3 -translate-y-4 px-3">
              <Avatar className="h-14 w-14">
                <AvatarImage src="/man.png" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-lg font-semibold">Jaydeep</p>
                <p className="text-xs text-green-700 font-semibold">
                  Gets Back 20 USDC
                </p>
                {/* <p className="text-sm ">24 Jan 2024, 12:00 PM</p> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
