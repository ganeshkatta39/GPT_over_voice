require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");

// this is used to initiate express and listen to the requests
const express = require("express");
const app = express();
const port = process.env.port || 3000;
app.listen(port, function () {
  console.log("Server started successfully  and listening on PORT: ", port);
});
app.use(express.json());

// this is to allow cross site referance
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// this is used to listen for a get request with prompt in the body and send a request to the gpt and after the response is generated this is sent to the frontend
// as the process is async we need to use the async await .
app.post("/", async (req, res) => {
  let GPT_answer = await ask_GPT(req.body.prompt);
  res.send(GPT_answer.choices[0]);
});

// initilization of the GPT
const configuration = new Configuration({
  organization: "org-8VUYASlG6P7k3mxu7tLX0Ku6",
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// this function ask's the gpt based on the input
async function ask_GPT(input) {
  const res = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: input }],
  });
  return res.data;
}
