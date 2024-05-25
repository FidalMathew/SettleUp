import {useEffect, useState} from "react";

export default function ImageComponent({cmd}: {cmd: string}) {
  const [cmdString, setCmdString] = useState(cmd);
  const [parts, setParts] = useState(cmdString.split(" ")[0]);

  useEffect(() => {
    setCmdString(cmd);
    setParts(cmdString.split(" ")[0]);
  }, [cmd]);

  console.log(cmdString, parts, "parts");
  return (
    <img
      src={
        parts === "createGroup"
          ? "/add.png"
          : parts === "addMember"
          ? "/team.png"
          : parts === "addExpense"
          ? "/money.png"
          : "/user.png"
      }
      alt="Lights"
    />
  );
}
