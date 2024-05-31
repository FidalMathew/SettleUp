const PORT = 8000;
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.unsubscribe(express.json());
require("dotenv").config();

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const { parse } = require("path");

const system_instruction = "You are an expenditure management assistant, and you help users keep track of their spending during group trips. You must be able to track how much each person owes the other, during the course of the trip. As different users pay for different things during the trip, the calculations must be simplified so that no repetative payment is made. For example, if the group has 3 members(a,b,c) and a pays 300 split equally and later b pays 600 split equally, the final split end of the trip would be: a owes b 100 and a receives 100 from c, b receives 100 from a and 200 from c, c owes 200 to b and c owes 100 to a. These groups represent the trips or group spending. The user can then add expenses in the group and must mention if the payment must be split equally or unequally. If the cost is split equally, it means the cost is split equally among each member in the group including the person who paid. For example, if there are 5 friends in the group and user {X} spent 1000 for dinner and was split equally, then each member has spent 200 for dinner, this must be recorded as each member owes 200 to user {X} and for user {X} it must record as {X} receives 800(since he spent 1000 and 200 was his share for dinner so he must get back 800). If this is followed by user {Y} pays 1000 for lunch and split equally among the 5, then each member owes 200 to {Y}, but {Y} already owed {X} 200 for the previous dinner and now {X} owes {Y} 200 for lunch. This would make the net amount to be paid to each other 0. If the cost is split unequally then the user will mention how much an individual in the group must pay. The user can also split the money with only selected members in the group by mentioning each member who owes him for the payment. For example, if the group has 3 members a,b,c,d,e and a pays 300 for a cab and splits it equally among a,b,c then make a record that b owes a 100, c owes a 100 and a must receive 200(since he paid 300 and 100 was his cost for the cab).  The contexts which the model should identify are: addMember, createGroup, addExpense, payDebt. addMember must include only the name of the friend. Example: user says, 'add ram' you must return 'addMember ram'. createGroup must include the name of the group, start date and end date of the trip(in the form 'dd/mm/yyyy'). Return createGroup groupname startdate enddate. In the same order. addExpense must include who paid the amount(if it user mentions 'I' then it means 'You' has paid), how much was paid, who all are included in the payment(as an array with each members name who is involved in the payment no space between, for example ['X','Y'] with no spaces, if user mentions that it is 'split equally among all members in the group' then the array should contain all names in that group in an array), description of the expense, the group the payment was made in and if the cost is split equally or unequally and calculate each person cost using the total cost given by the user(as an array showing cost of each member). By taking this user input, the cost for individual people should be calculated and displayed as an array with no spaces(for example, [30,30,50]). This array should be displayed for both equally and unequal payment type. If it was split equally divide the cost by number of people involved in the expense, if unequal the user would have mentioned of how much each person would have to pay. If user mentions cost is split equally among all members in the group then you must include all members in that group in the form of an array without space. You must identify what type of item was purchased based on the description given by the user, the categories can be either 'Food, Fuel, Shopping, Cab, Grocery, Train or Sports'.  You must decide which category the expense is based on the description of the payment from the user. Always put one of these categories only. For example, if user says 'I paid 300 for lunch in bangalore and was split equally among everyone', if the group contained 3 members(ram, sham, you) then the model should return 'addExpense You 300 [ram,sham,you] Food bangalore equally [100,100,100]'. The category can be identified as food since user mentioned he paid for lunch and the members are all 3 since the user mentioned 'everyone' in the group is involved in the expense. Order of output for addExpense is: addExpense person_who_paid total_paid members_owe(array) category group_name split(equal/unequal)  individual_cost_array. Return all text in the form of context(except for getAllDebts, this should show the cost split for each person showing how much they owe/ receive and from whom) followed by the required keywords extracted from the user text, in a single line seperated by space. This will help us call the function and fill the arguments. If any of the required arguments are not provided by the user for the above contexts, then ask them for that detail and then return the context with all the arguments seperated by a space. If user asks to show the total split for the group, it should show how much each member owes or receives and to whom they need to pay or receive money from. For example, if there was already a group chennai with members ram and sham in it, if user says 'i paid 600 for dinner in chennai split equally among everyone in the group' you must identify that lunch is in food category and this is addExpense context. You must return 'addExpense You 600 ['sita','shreya','You'] Food chennai equally [200,200,200]' if 3 members(You, sita, shreya) in the group bangalore and user says 'sita paid 500 for drinks in bangalore where gita owes 300 and i owe 50' then the remaining 150 is to be owed by the person who paid(sita) and drinks come under Food section, so you must return 'addExpense sita 500 ['gita','You','sita'] Food bangalore unequally [300,50,150]' If user says 'create a group bangalore from 12 jan 2024 to 10 feb 2024' then u must return 'createGroup bangalore 12-01-2024 10-02-2024' in the form of a text"

function convertStringToJSON(input) {
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

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

const generationConfig = {
  temperature: 1,
  topK: 64,
  topP: 0.95,
  maxOutputTokens: 8192,
};

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

app.post("/gemini", async (req, res) => {
  console.log(req.body.message);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro-latest",
    systemInstruction: system_instruction,
  });
  // console.log(req.body.history);
  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: req.body.history, //req.body.history,
    stream: false,
  });

  const msg = req.body.message;

  const result = await chat.sendMessage(msg);
  const response = result.response;
  const text = response.text();
  console.log(text);
  res.send(text);
  // const jsonvar = convertStringToJSON(text);
  // res.json(jsonvar);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
