import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Plus, Sparkles, UserRoundPlus} from "lucide-react";
import {useRouter} from "next/router";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {useState} from "react";

export default function Groups() {
  const router = useRouter();
  const [openAIBox, setOpenAIBox] = useState(false);
  return (
    <div className="h-screen w-full">
      <CommandDialog open={openAIBox} onOpenChange={setOpenAIBox}>
        <CommandInput
          placeholder="Type a command or search..."
          className="-translate-y-10"
        />
        <CommandList>
          {/* <CommandEmpty>No results found.</CommandEmpty> */}
          {/* <CommandGroup heading="Suggestions">
            <CommandItem>
              <span>Calendar</span>
            </CommandItem>
            <CommandItem>
              <span>Search Emoji</span>
            </CommandItem>
            <CommandItem>
              <span>Calculator</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <span>Billing</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup> */}
        </CommandList>
      </CommandDialog>

      <div className="h-[200px] w-full">
        <img
          src="/cover.png"
          alt="cover"
          className="object-cover h-full w-full"
          style={{objectPosition: "center 30%"}}
        />
      </div>

      <div className="px-24 -translate-y-6 flex justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-[150px] w-[150px] -translate-y-6">
            <AvatarImage src="/beach.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex-col justify-start gap-2 flex text-[#3D405B]">
            <p className="text-4xl font-semibold">Trip to Bangalore</p>
            <p>24 Jan 2024 to 28 Jan 2024</p>
          </div>
        </div>
        <div className="-translate-y-5 mt-8 flex gap-3 items-center flex-row-reverse">
          <div className="flex">
            <Avatar className="h-12 w-12 -ml-4 first:ml-0">
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
      <div className="px-24 flex items-center gap-3">
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
      <div className="px-24 pb-6 flex items-center gap-6">
        <div className="h-[500px] overflow-y-auto border my-8 rounded-lg lg:w-[70%] w-full bg-white flex flex-col expense-box gap-5 relative">
          <div className="p-4 pl-5 border-b font-semibold text-xl sticky top-0 bg-white z-[20] flex justify-between items-center">
            <p className="text-lg">Expense</p>
            <Button
              size="sm"
              variant={"outline"}
              className="focus-visible:ring-0"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Expense
            </Button>
          </div>
          {Array.from({length: 8}).map((_, index) => (
            <div className="pt-1 px-8 bg-white">
              <div className="flex items-center gap-3 justify-between">
                <div className="flex items-center gap-5">
                  <div className="flex justify-center items-end flex-col">
                    <p className="text-lg font-semibold">24 Jan</p>
                    <p className="text-xs">12:00pm</p>
                  </div>
                  <div className="flex gap-3 items-center">
                    <Avatar className="h-14 w-14 -ml-4 first:ml-0">
                      <AvatarImage src="/beach.png" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-lg font-semibold">Resort Booking</p>
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
            <p className="text-lg">Group Members</p>
            <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="h-10 w-10 grid place-content-center border-2 rounded-full border-slate-300">
                      <Plus />
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
