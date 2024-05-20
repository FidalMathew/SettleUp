import {Button} from "@/components/ui/button";
import {usePrivy} from "@privy-io/react-auth";
import {ArrowRight, Wallet} from "lucide-react";
import {useRouter} from "next/router";

export default function Home() {
  const router = useRouter();

  const {login, user, logout} = usePrivy();
  console.log(user, "user");
  return (
    <div className="h-screen w-full">
      <div className="h-[80px] w-full flex items-center justify-between lg:gap-5 lg:pr-32 lg:pl-32 px-6">
        <img src="/logo.png" alt="logo" className="h-[60px]" />
        {user ? (
          <div>
            <Button
              className="rounded-full border border-gray-400"
              variant={"outline"}
              onClick={() => router.push("/dashboard")}
            >
              Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div>
            <Button
              className="rounded-full border border-gray-400"
              variant={"outline"}
              onClick={login}
            >
              <Wallet className="mr-2 h-4 w-4" /> Connect Wallet
            </Button>
          </div>
        )}
      </div>

      <div className="lg:min-h-screen h-fit bg-[#E07A5F] w-full flex items-center flex-col lg:flex-row lg:pl-20 px-10 text-center lg:text-left">
        <div className="flex flex-col gap-5 text-white justify-start lg:items-start items-center mt-20 text-7xl font-Poppins font-semibold lg:-translate-y-[100px] lg:translate-x-[10px]">
          <p className="">Share your expenses!</p>
          <p className="text-4xl">With the lowest Gas Fees possible!</p>
          <p className="text-lg font-normal leading-7">
            Experience the ease of managing group expenses <br /> with our smart
            and efficient solution.
          </p>
          {user ? (
            <Button
              className="w-[200px] rounded-xl bg-[#F2CC8F] hover:bg-[#F2CC8F] text-slate-600"
              onClick={() => router.push("/dashboard")}
            >
              Get Started
            </Button>
          ) : (
            <Button className="w-[200px] rounded-xl bg-[#F2CC8F] hover:bg-[#F2CC8F] text-slate-600">
              Connect Wallet First
            </Button>
          )}
        </div>
        <div className="w-full">
          <img
            src="/file.png"
            alt="photo3"
            className="lg:h-[700px] lg:w-full w-[470px] h-[470px] "
          />
        </div>
      </div>
    </div>
  );
}
