import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Sparkles, UserRoundPlus} from "lucide-react";
import {useRouter} from "next/router";

export default function Groups() {
  const router = useRouter();
  return (
    <div className="h-screen w-full">
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

          <Button variant={"outline"}>
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
    </div>
  );
}
