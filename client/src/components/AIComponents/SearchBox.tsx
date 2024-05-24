import {Search, Option, Detail, Searcher} from "searchpal";
import {Button} from "../ui/button";
import AddMembers from "./AddMember";
import CreateGroup from "./CreateGroup";
import AddExpense from "./AddExpense";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
interface SearchBoxProps {
  openAIBox: boolean;
  setOpenAIBox: (value: boolean) => void;
}
export default function SearchBox({openAIBox, setOpenAIBox}: SearchBoxProps) {
  const searcher: Searcher = async (query: string) => {
    const functionInterpretation = "create a group";

    console.log(query, "query");

    return (
      <Option
        label={query}
        key={query}
        media={
          <img
            src={
              query === "create a group"
                ? "/add.png"
                : query === "add members"
                ? "/team.png"
                : query === "add expense"
                ? "/money.png"
                : "/user.png"
            }
            alt=""
          />
        }
        sublabel={
          <div>
            <div>Creates a new group with the given name.</div>
          </div>
        }
        preview={
          query === "create a group" ? (
            <CreateGroup />
          ) : query === "add members" ? (
            <AddMembers />
          ) : query === "add expense" ? (
            <AddExpense />
          ) : (
            <div>Not found</div>
          )
        }
      />
    );
  };
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
        const results = await searcher(q);
        return results;
      }}
    </Search>
  );
}
