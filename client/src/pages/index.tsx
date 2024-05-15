import {Button} from "@/components/ui/button";
import {Wallet} from "lucide-react";
import {useRouter} from "next/router";

export default function Home() {
  const router = useRouter();
  return (
    <div className="h-screen w-full">
      <div className="h-[10%] w-full flex items-center justify-between pr-44 pl-32">
        <img src="/logo.png" alt="logo" className="h-[60px]" />
        <div>
          <Button
            className="rounded-full border border-gray-400"
            variant={"outline"}
          >
            <Wallet className="mr-2 h-4 w-4" /> Connect Wallet
          </Button>
        </div>
      </div>
      <div className="h-[90%] bg-[#E07A5F] w-full flex items-center px-20">
        <div className="flex flex-col gap-5 text-white justify-start mt-20 text-7xl font-Poppins font-semibold -translate-y-[100px] translate-x-[10px]">
          <p className="">Share your expenses!</p>
          <p className="text-4xl">With the lowest Gas Fees possible!</p>
          <p className="text-lg font-normal leading-7">
            Experience the ease of managing group expenses <br /> with our smart
            and efficient solution.
          </p>

          <Button
            className="w-[200px] rounded-xl bg-[#F2CC8F] hover:bg-[#F2CC8F] text-slate-600"
            onClick={() => router.push("/dashboard")}
          >
            Get Started
          </Button>
        </div>
        <img src="/photo4.png" alt="photo3" className="h-[600px]" />
      </div>
    </div>
  );
}
