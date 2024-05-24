import axios from "axios";
import {createContext, ReactNode, useContext, useEffect, useState} from "react";

interface AIContextProps {}

const AIContext = createContext<AIContextProps>({});

export default function AIContextProvider({children}: {children: ReactNode}) {
  const [chatHistory, setChatHistory] = useState([] as any);

  const getResponse = async (text: string) => {
    const {data} = await axios.post("http://localhost:8000/gemini", {
      history: chatHistory,
      message: text,
    });

    setChatHistory(() => [
      ...chatHistory,
      {
        role: "user",
        parts: [{text: text}],
      },
      {
        role: "model",
        parts: [{text: data}],
      },
    ]);
  };

  return <AIContext.Provider value={{}}>{children}</AIContext.Provider>;
}

export const useAIContextHook = () => {
  return useContext(AIContext);
};

// const App = () => {
//   const [error, setError] = useState("");
//   const [value, setValue] = useState("");
//   const [chatHistory, setChatHistory] = useState([]);

//   const getResponse = async () => {
//     if (!value) {
//       setError("Please enter a message");
//       return;
//     }
//     try {
//       const options = {
//         headers: { "Content-Type": "application/json" },
//         method: "POST",
//         body: JSON.stringify({ history: chatHistory, message: value }),
//       };
//       // Parse the JSON string back into an object
//       // const parsedBody = JSON.parse(options.body);
//       // Access the message property
//       // console.log(parsedBody.message);

//       const response = await fetch("http://localhost:8000/gemini", options);
//       const data = await response.text();
//       console.log(data);
//       setChatHistory((oldChatHistory) => [
//         ...chatHistory,
//         {
//           role: "user",
//           parts: [{ text: value }],
//         },
//         {
//           role: "model",
//           parts: [{ text: data }],
//         },
//       ]);
//       setValue("");
//     } catch (error) {
//       console.log(error);
//       setError("Something went wrong");
//     }
//   };

//   return (
//     <div className="app">
//       <h1>Chatbot</h1>
//       <section className="chat-window">
//         <div className="chat-container">
//           <div className="chat-message">
//             <p>Hello, how can I help you today?</p>
//           </div>
//           <div className="input-container">
//             <input
//               value={value}
//               placeholder="Type your message here"
//               onChange={(e) => setValue(e.target.value)}
//             />
//             <button className="chat-button" onClick={getResponse}>
//               Send
//             </button>
//           </div>
//         </div>
//         {error && <p className="error">{error}</p>}
//         <div className="search-results">
//           {chatHistory.map((chatItem, _index) => (
//             <div key={_index}>
//               <p className="answer">
//                 {chatItem.role} :{" "}
//                 {chatItem.parts.map((part, partIndex) => (
//                   <span key={partIndex}>{part.text}</span>
//                 ))}
//               </p>
//             </div>
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// };
