import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export function convertStringToJSON(input: string) {
  const parts = input.split(" ");

  let jsonObject;

  if (parts[0] === "createGroup") {
    jsonObject = {
      function: parts[0],
      group: parts[1],
      start_date: parts[2],
      end_date: parts[3],
    }
  } else if (parts[0] === "addMember") {
    jsonObject = {
      function: parts[0],
      member: parts[1],
      wallet_address: parts[2],
      email: parts[3],
      phone: parts[4],
      group: parts[5],
    };
  } else if (parts[0] === "addExpense") {
    jsonObject = {
      function: parts[0],
      payer: parts[1],
      total_amount: parts[2],
      members: parts[3],
      category: parts[4],
      group: parts[5],
      split: parts[6],
      individual_cost: parts[7],
    };
  } else {
    jsonObject = {
      function: "Invalid",
    };
  }
  console.log(jsonObject);
  return jsonObject;
}