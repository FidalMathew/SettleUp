import axios from "axios";
import {useCallback, useEffect, useState} from "react";
import CreateGroup from "./CreateGroup";
import AddMembers from "./AddMember";
import AddExpense from "./AddExpense";

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

export default function PreviewComponent({q}: {q: string}) {
  const [query, setQuery] = useState<string>(q);
  const [functionInterpretation, setFunctionInterpretation] = useState("");
  const [chatHistory, setChatHistory] = useState([] as any);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length === 0) {
      return;
    }

    setLoading(true);
    axios
      .post("http://localhost:8000/gemini", {
        history: chatHistory,
        message: q,
      })
      .then(({data}) => {
        setFunctionInterpretation(data);
        setChatHistory((oldchathistory: any) => [
          ...oldchathistory,
          {
            role: "user",
            parts: [{text: q}],
          },
          {
            role: "model",
            parts: [{text: data}],
          },
        ]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [query]);

  console.log(query, "query");
  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : functionInterpretation.split(" ")[0] === "createGroup" ? (
        <CreateGroup datastring={functionInterpretation} />
      ) : functionInterpretation.split(" ")[0] === "addMember" ? (
        <AddMembers datastring={functionInterpretation} />
      ) : functionInterpretation.split(" ")[0] === "addExpense" ? (
        <AddExpense datastring={functionInterpretation} />
      ) : (
        <div>Sorry Didn't understand you</div>
      )}
    </div>
  );
}
