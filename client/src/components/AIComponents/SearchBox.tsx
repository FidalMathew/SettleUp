import {Search, Option, Detail} from "searchpal";
import {Button} from "../ui/button";
import AddMembers from "./AddMember";
import CreateGroup from "./CreateGroup";
import AddExpense from "./AddExpense";

interface SearchBoxProps {
  openAIBox: boolean;
  setOpenAIBox: (value: boolean) => void;
}
export default function SearchBox({openAIBox, setOpenAIBox}: SearchBoxProps) {
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
      <Option
        label="Add Members to a Group"
        sublabel={
          <div>
            <div>Creates a new group with the given name.</div>
          </div>
        }
        cta={"Add Members to a Group"}
        img={{
          src: "/add.png",
          alt: "Create a Group",
        }}
        button={({cta, onClick}) => {
          return (
            <Button className="w-full bg-[#81B29A]" onClick={onClick}>
              {cta}
            </Button>
          );
        }}
        preview={
          <AddMembers
            name="Team 1"
            email="jaydeep"
            phone="1234567890"
            walletAddress="0x1234567890"
          />
        }
      />

      <Option
        label="Create a Group"
        sublabel={
          <div>
            <div>Creates a new group with the given name.</div>
          </div>
        }
        img={{
          src: "/team.png",
          alt: "Create a Group",
        }}
        cta={"Create a Group"}
        button={({cta, onClick}) => {
          return (
            <Button className="w-full bg-[#81B29A]" onClick={onClick}>
              {cta}
            </Button>
          );
        }}
        preview={<CreateGroup />}
      />
      <Option
        label="Add Expense"
        sublabel={
          <div>
            <div>
              Adds an expense to the group with the given amount and
              description.
            </div>
          </div>
        }
        img={{
          src: "/money.png",
          alt: "Money",
        }}
        cta={"Add Expense"}
        button={({cta, onClick}) => {
          return (
            <Button className="w-full bg-[#81B29A]" onClick={onClick}>
              {cta}
            </Button>
          );
        }}
        preview={<AddExpense />}
      />
    </Search>
  );
}
