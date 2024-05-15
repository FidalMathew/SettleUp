import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {ArrowRight} from "lucide-react";
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
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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
  return (
    <div className="h-fit w-full relative px-4 pt-8 md:px-14 flex flex-col gap-7 dashboard">
      <div className="h-fit mb-6 w-full">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarImage src="/man.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col justify-start text-[#3D405B]">
            <p className="text-xl font-Poppins font-semibold">Hi Jaydeep!</p>
            <p className="text-sm">Track your Group Expense</p>
          </div>
        </div>
        {/* <p className="text-center translate-y-12 text-[#3D405B] font-Poppins font-semibold text-xl">
          Overview
        </p> */}
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
            <p className="text-3xl font-bold text-[#3D405B]">5000 USDC</p>
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
              <div className="border-2 rounded-full border-black h-7 aspect-square">
                <ArrowRight />
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
            <p className="text-3xl font-bold text-[#3D405B]">5000 USDC</p>
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
              <div className="border-2 rounded-full border-black h-7 aspect-square">
                <ArrowRight />
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
      <div className="">
        <p className="font-semibold text-2xl">Groups</p>
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full p-6"
        >
          <CarouselContent>
            {Array.from({length: 5}).map((_, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="h-fit">
                    <CardHeader className="flex pt-4 pb-2 h-fit">
                      <div className="h-[10%] flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-12 w-12 -ml-4 first:ml-0">
                            <AvatarImage src="/trip.png" />
                            <AvatarFallback>JD</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col justify-start">
                            <p className="text-md font-semibold">
                              Trip to Bangalore
                            </p>
                            <p className="text-xs">24 Jan 2024 - 28 Jan 2024</p>
                          </div>
                        </div>
                        <div className="flex gap-2 items-center">
                          <div className="rounded-full bg-yellow-500 h-2 w-2" />
                          <p className="text-xs">Unsettled Dues</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="h-[110px] p-4 w-full mb-3">
                      <div className="flex justify-between items-center">
                        <div className="flex justify-start text-sm flex-col">
                          <p>Your Spending</p>
                          <p className="text-xl font-semibold">300 USDC</p>
                        </div>
                        <div className="flex justify-start text-sm flex-col">
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
                    </CardContent>
                    <Separator />

                    <CardFooter className="p-4 border-t border-slate-200">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
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
                          <p className="text-xs">4 Members</p>
                        </div>

                        <Button size="sm" variant={"outline"}>
                          View Group
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext className="" />
        </Carousel>
      </div>
      <Separator className="bg-red-400 text-red-400" />
      <div>
        <p className="font-semibold text-2xl">Expense History</p>

        <div className="flex justify-center items-center gap-5 flex-col lg:flex-row">
          <div className="h-[500px] overflow-y-auto border my-8 rounded-lg lg:w-[80%] w-full bg-white flex flex-col gap-5 expense-box">
            {Array.from({length: 5}).map((_, index) => (
              <div className="py-5 px-8">
                <div className="flex items-center gap-3 justify-between">
                  <div className="flex items-center gap-3">
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
                        <p className="text-xs">
                          Trip to Bangalore - Paid by Manvik
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
                  <div className="text-red-800 font-bold">300 USDC</div>
                </div>
                <Separator className="bg-red-400 text-red-400" />
              </div>
            ))}
          </div>
          <div className="h-[500px] border my-8 rounded-lg lg:w-[80%] w-full bg-white pt-8 pb-8">
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
                {/* <CartesianGrid strokeDasharray="3 3" /> */}
                <XAxis dataKey={"name"} />
                <YAxis />
                <Tooltip />
                {/* <Legend />   */}
                <Bar dataKey="pv" stackId="a" fill="#E07A5F" />
                <Bar dataKey="uv" stackId="a" fill="#82ca9d" />
                <Bar dataKey="cv" stackId="a" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
