import "./dotenv";
import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.listen(process.env.PORT, () => {
  console.log("Server started at", process.env.PORT);
});
