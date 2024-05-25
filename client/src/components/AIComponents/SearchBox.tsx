import {Search, Option, Detail, Searcher} from "searchpal";
import {useState} from "react";
import PreviewComponent from "./PreviewComponent";
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
      {async (q) => {
        return (
          <Option
            label={q}
            key={q}
            media={<img src="/gemini.png" alt="Lights" />}
            sublabel={
              <div>
                <div>Creates a new group with the given name.</div>
              </div>
            }
            preview={<PreviewComponent q={q} />}
          />
        );
      }}
    </Search>
  );
}
