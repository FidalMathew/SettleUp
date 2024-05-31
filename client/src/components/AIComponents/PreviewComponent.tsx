import axios from "axios";
import {useCallback, useEffect, useRef, useState} from "react";
import CreateGroup from "./CreateGroup";
import AddMembers from "./AddMember";
import AddExpense from "./AddExpense";
import {Skeleton} from "../ui/skeleton";

type DebouncedFunction = (...args: any[]) => void;

const debounce = (
  func: DebouncedFunction,
  delay: number
): DebouncedFunction => {
  let debounceTimer: NodeJS.Timeout;
  return function (this: any, ...args: any[]) {
    const context = this;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(context, args), delay);
  };
};

export default function PreviewComponent({
  q,
  groupId,
  membersArray,
}: {
  q: string;
  groupId: string;
  membersArray: any;
}) {
  const [query, setQuery] = useState<string>(q);
  const [functionInterpretation, setFunctionInterpretation] = useState("");
  const [chatHistory, setChatHistory] = useState([] as any);
  const [loading, setLoading] = useState(false);

  const hasMounted = useRef(false);

  useEffect(() => {
    const storedChatHistory = localStorage.getItem("chatHistory");
    if (storedChatHistory) {
      setChatHistory((oldChatHistory: any) => [
        ...oldChatHistory,
        ...JSON.parse(storedChatHistory),
      ]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    if (query.length === 0) {
      return;
    }

    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    console.log("Query changed:", query);
    setLoading(true);
    axios
      .post("http://localhost:8000/gemini", {
        history: chatHistory,
        message: query,
      })
      .then(({data}) => {
        setFunctionInterpretation(data);
        setChatHistory((oldChatHistory: any) => [
          ...oldChatHistory,
          {
            role: "user",
            parts: [{text: query}],
          },
          {
            role: "model",
            parts: [{text: data}],
          },
        ]);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setFunctionInterpretation("");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [query]);

  console.log(functionInterpretation, "functionInterpretation");
  return (
    <div className="w-full">
      {loading ? (
        <Skeleton className="w-full h-[200px]" />
      ) : functionInterpretation.split(" ")[0] === "createGroup" ? (
        <CreateGroup datastring={functionInterpretation} />
      ) : functionInterpretation.split(" ")[0] === "addMember" ? (
        <AddMembers
          datastring={functionInterpretation}
          groupId={groupId}
          membersArray={membersArray}
        />
      ) : functionInterpretation.split(" ")[0] === "addExpense" ? (
        <AddExpense datastring={functionInterpretation} />
      ) : (
        <div>
          <p className="text-lg font-semibold text-center w-full">
            Invalid Command
          </p>

          <div className="w-full flex flex-col items-center">
            <p className="text-lg font-semibold text-center w-full">
              Please try again
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
