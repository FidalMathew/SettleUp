import {Search, Option, Detail, Searcher} from "searchpal";
import {Button} from "../ui/button";
import AddMembers from "./AddMember";
import CreateGroup from "./CreateGroup";
import AddExpense from "./AddExpense";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import useDebounce from "@/hooks/useDebounce";
import {useCallback, useEffect, useState} from "react";
import axios from "axios";
interface SearchBoxProps {
  openAIBox: boolean;
  setOpenAIBox: (value: boolean) => void;
}

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

export default function SearchBox({openAIBox, setOpenAIBox}: SearchBoxProps) {
  const [query, setQuery] = useState<string>("");
  const [functionInterpretation, setFunctionInterpretation] = useState(
    {} as any
  );
  const [chatHistory, setChatHistory] = useState([] as any);

  const debouncedQuery = useCallback(
    debounce((q: string) => {
      if (q === "") return;

      console.log(q, "my query");
      axios
        .post("http://localhost:8000/gemini", {
          history: chatHistory,
          message: q,
        })
        .then(({data}) => {
          setFunctionInterpretation(data);
          setChatHistory(() => [
            ...chatHistory,
            {
              role: "user",
              parts: [{text: q}],
            },
            {
              role: "model",
              parts: [{text: data}],
            },
          ]);
        });
    }, 2000),
    []
  );

  useEffect(() => {
    debouncedQuery(query);
  }, [query, debouncedQuery]);

  // const searcher: Searcher = async () => {
  //   return (
  //     <Option
  //       label={query}
  //       key={query}
  //       media={
  //         <img
  //           src={
  //             query === "create a group"
  //               ? "/add.png"
  //               : query === "add members"
  //               ? "/team.png"
  //               : query === "add expense"
  //               ? "/money.png"
  //               : "/user.png"
  //           }
  //           alt=""
  //         />
  //       }
  //       sublabel={
  //         <div>
  //           <div>Creates a new group with the given name.</div>
  //         </div>
  //       }
  //       preview={
  //         functionInterpretation.split(" ")[0] === "createGroup" ? (
  //           <CreateGroup />
  //         ) : functionInterpretation.split(" ")[0] === "add members" ? (
  //           <AddMembers />
  //         ) : functionInterpretation.split(" ")[0] === "add expense" ? (
  //           <AddExpense />
  //         ) : (
  //           <div>Not found</div>
  //         )
  //       }
  //     />
  //   );
  // };
  return (
    <Search
      label="Query a Command Using AI"
      labels={{
        title: "Search prompt",
        subtitle: "Use this dialog to perform a web3 search.",
        results: "Search results",
        noResults: {
          title: "No results found for query.",
          subtitle: "Try searching for something else.",
        },
      }}
      open={openAIBox}
      onClose={() => setOpenAIBox(false)}
      link={({href, children}) => (
        <a
          href={href}
          style={{textDecoration: "none", color: "initial"}}
          target="_blank"
        >
          {children}
        </a>
      )}
      animate="fade"
      dark={false}
    >
      {async (q) => {
        setQuery(q);

        return (
          <Option
            label={q}
            key={q}
            media={
              <Avatar>
                <AvatarFallback>
                  <AvatarImage src="/user.png" alt="" />
                </AvatarFallback>
              </Avatar>
            }
            sublabel={
              <div>
                <div>Creates a new group with the given name.</div>
              </div>
            }
            preview={
              functionInterpretation.split(" ")[0] === "createGroup" ? (
                <CreateGroup />
              ) : functionInterpretation.split(" ")[0] === "add members" ? (
                <AddMembers />
              ) : functionInterpretation.split(" ")[0] === "add expense" ? (
                <AddExpense />
              ) : (
                <div>Not found</div>
              )
            }
          />
        );
      }}
    </Search>
  );
}
