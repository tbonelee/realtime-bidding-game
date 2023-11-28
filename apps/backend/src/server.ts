import * as fs from "fs";
import * as dotenv from "dotenv";
import express from "express";

const envConfig = dotenv.parse(fs.readFileSync(".env.local"));

console.log("envConfig", envConfig);

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3001, () => {
  console.log("Example app listening on port 3000!");
});
