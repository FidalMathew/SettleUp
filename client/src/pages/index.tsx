import {Button} from "@/components/ui/button";
import {useContractFunctionContextHook} from "@/Context/ContractContext";
import {usePrivy, useWallets} from "@privy-io/react-auth";
import {ArrowRight, Wallet} from "lucide-react";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {
  ResponsiveDialogComponent,
  ResponsiveDialogComponentContent,
  ResponsiveDialogComponentDescription,
  ResponsiveDialogComponentFooter,
  ResponsiveDialogComponentHeader,
  ResponsiveDialogComponentTitle,
} from "@/components/ui/ResponsiveDialog";
import {Field, Form, Formik} from "formik";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";

export default function Home() {
  const router = useRouter();
  const [openNameModal, setOpenNameModal] = useState(false);
  const [name, setName] = useState<string>("");

  const {connectWallet} = usePrivy();
  const {wallets, ready} = useWallets();

  const requiredWallet = wallets.find(
    (wallet) => wallet.meta.name === "MetaMask"
  );

  console.log(wallets, "reqdwallets");

  const {fetchName, gaslessTransaction} = useContractFunctionContextHook();

  useEffect(() => {
    if (wallets[0] && wallets[0].address && fetchName) {
      (async function () {
        const fetchedName = await fetchName(wallets[0].address); // Await the fetchName function call
        console.log(fetchedName, "namef");
        setName(fetchedName);
      })();
    }
  }, [wallets, fetchName]);

  useEffect(() => {
    if (!name && ready && requiredWallet && wallets[0] && wallets[0].address) {
      setOpenNameModal(true);
    }
  }, [name]);

  const create_user = async ({name}: {name: string}) => {
    if (gaslessTransaction) {
      gaslessTransaction("createUser", [name]);
    }
  };

  return (
    <div className="h-screen w-full">
      <ResponsiveDialogComponent
        open={openNameModal}
        onOpenChange={setOpenNameModal}
      >
        <ResponsiveDialogComponentContent>
          <ResponsiveDialogComponentHeader>
            <ResponsiveDialogComponentTitle>
              <p>Set your Name</p>
            </ResponsiveDialogComponentTitle>
            <ResponsiveDialogComponentDescription>
              <Formik
                initialValues={{name: ""}}
                onSubmit={(values) => {
                  create_user(values);
                }}
              >
                {(formik) => (
                  <Form className="flex flex-col gap-4 pt-7">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="name" className="ml-1">
                        Name
                      </Label>
                      <Field
                        as={Input}
                        name="name"
                        placeholder="Enter your name"
                        className="focus-visible:ring-0"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="wallet" className="ml-1">
                        Wallet Address
                      </Label>
                      <Input
                        value={wallets[0] && wallets[0].address}
                        disabled
                        name="wallet"
                        placeholder="Enter your name"
                        className="focus-visible:ring-0"
                      />
                    </div>

                    <Button className="rounded-xl bg-[#F2CC8F] hover:bg-[#F2CC8F] text-slate-600 w-full">
                      Set Name
                    </Button>
                  </Form>
                )}
              </Formik>
            </ResponsiveDialogComponentDescription>
          </ResponsiveDialogComponentHeader>
        </ResponsiveDialogComponentContent>
      </ResponsiveDialogComponent>

      <div className="h-[80px] w-full flex items-center justify-between lg:gap-5 lg:pr-32 lg:pl-32 px-6">
        <img src="/logo.png" alt="logo" className="h-[60px]" />
        {requiredWallet && ready && !name ? (
          <Button
            className="rounded-full border border-gray-400"
            variant={"outline"}
            onClick={() => setOpenNameModal(true)}
          >
            Set Name
          </Button>
        ) : requiredWallet && ready && name ? (
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
              onClick={connectWallet}
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
          {requiredWallet && ready ? (
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
          <img src="/file.png" alt="photo3" className="w-full h-full " />
        </div>
      </div>
    </div>
  );
}
