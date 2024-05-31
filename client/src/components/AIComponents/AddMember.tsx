import {Loader2, Plus} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "../ui/avatar";
import {Input} from "../ui/input";
import {Label} from "../ui/label";
import {PreviewComponent} from "searchpal";
import {Field, Form, Formik} from "formik";
import {convertStringToJSON} from "@/lib/utils";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {
  ResponsiveDialogComponent,
  ResponsiveDialogComponentContent,
  ResponsiveDialogComponentDescription,
  ResponsiveDialogComponentFooter,
  ResponsiveDialogComponentHeader,
  ResponsiveDialogComponentTitle,
} from "@/components/ui/ResponsiveDialog";
import {emoji} from "../../lib/emoji";
import {useContractFunctionContextHook} from "@/Context/ContractContext";
import {Skeleton} from "../ui/skeleton";
import {toast} from "sonner";

function debounce<F extends (...args: any[]) => any>(func: F, delay: number) {
  let debounceTimer: NodeJS.Timeout;
  return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(this, args), delay);
  };
}

const AddMembers = ({
  datastring,
  groupId,
  membersArray,
}: {
  datastring: string;
  groupId: string;
  membersArray: any;
}) => {
  const [data, setData] = useState(convertStringToJSON(datastring));
  const [openAvatarModal, setOpenAvatarModal] = useState(false);
  const getRandomEmoji = () => emoji[Math.floor(Math.random() * emoji.length)];
  const randomAvatar = getRandomEmoji();
  const [results, setResults] = useState<string[]>([]);
  console.log(data, "from add members");

  const {fetchAddress, fetchNameAndAvatar, gaslessTransaction} =
    useContractFunctionContextHook();
  const [loading, setLoading] = useState(false);
  const [gaslessTransactionLoading, setGaslessTransactionLoading] =
    useState(false);

  const handleAddGroupMember = async (walletAddress: string) => {
    setGaslessTransactionLoading(true);

    if (!gaslessTransaction || !groupId) return;
    try {
      const res = await gaslessTransaction("addMember", [
        groupId,
        walletAddress,
      ]);
      console.log(res, "res");
      toast(
        "Member added successfully, please refresh the page to see the changes"
      );
    } catch (err) {
      console.log(err, "err");
    } finally {
      setGaslessTransactionLoading(false);
    }
  };

  useEffect(() => {
    (async function () {
      if (fetchAddress && fetchNameAndAvatar && data) {
        setLoading(true); // Set loading to true when starting the fetch process
        try {
          const response = await fetchAddress(data.member!);
          console.log("Address response:", response);

          if (response) {
            console.log("Fetching name and avatar for response:", response);
            const res = await fetchNameAndAvatar(response);
            console.log("Name and Avatar response:", res);

            const arr = [response, res];
            console.log("Final result array:", arr);

            setResults(arr);
          } else {
            console.warn("No response from fetchAddress");
            setResults([]);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          setResults([]);
        } finally {
          setLoading(false); // Set loading to false when the fetch process is completed
        }
      }
    })();
  }, [data, fetchAddress, fetchNameAndAvatar]);

  console.log(results, "results");
  return (
    <div className="w-full flex flex-col">
      <p className="text-lg font-semibold text-center w-full">Member Details</p>

      {loading === true && <Skeleton className="w-full h-[200px]" />}

      {!loading &&
        results &&
        results[1] &&
        results[1][1] === "" &&
        results[1][0] === "" && <div>not found</div>}
      {!loading &&
        results &&
        results[1] &&
        results[1][1] !== "" &&
        results[1][0] !== "" && (
          <Formik
            initialValues={{
              name: data.member || "",
              wallet: results[0],
              avatarPath: results[1][1],
            }}
            onSubmit={(values, action) => {
              // console.log(values, "values");
              handleAddGroupMember(values.wallet);
            }}
          >
            {(formik) => (
              <Form className="w-full">
                <div className="w-full pt-6 flex items-center flex-col gap-6">
                  <Avatar
                    className="w-32 h-32 relative overflow-visible"
                    onClick={() => setOpenAvatarModal((prev) => !prev)}
                  >
                    <AvatarImage src={formik.values.avatarPath} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col w-full gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="name" className="w-32">
                        Name
                      </Label>
                      <Field
                        as={Input}
                        name="name"
                        id="name"
                        type="text"
                        placeholder="Name"
                        className="w-full focus-visible:ring-0"
                      />
                    </div>

                    <div className="flex items-center">
                      <Label htmlFor="wallet" className="w-32">
                        Wallet Address
                      </Label>
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
                </div>

                {gaslessTransactionLoading ? (
                  <Button disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="bg-[#81B29A] hover:bg-[#81B29A] w-full mt-6"
                    disabled={
                      membersArray &&
                      membersArray.find(
                        (item: any) => item.address === results[0]
                      )
                    }
                  >
                    {membersArray &&
                    membersArray.find(
                      (item: any) => item.address === results[0]
                    )
                      ? "Already a Member"
                      : "Add Member"}
                  </Button>
                )}
              </Form>
            )}
          </Formik>
        )}
    </div>
  );
};

export default AddMembers;
