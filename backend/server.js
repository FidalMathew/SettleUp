const PORT = 8000;
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.unsubscribe(express.json());
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");
const { parse } = require("path");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

app.post("/gemini", async (req, res) => {
  console.log(req.body.message);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

  const chat = model.startChat({
    history: req.body.history,
  });
  const msg = req.body.message;

  const result = await chat.sendMessage("how are u");
  const response = result.response;
  const text = response.text();
  res.send(text);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
