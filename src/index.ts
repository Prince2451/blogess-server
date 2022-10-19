import "./dotenv";
import express from "express";
import cors from "cors";
import { connect } from "mongoose";

const app = express();

app.use(express.json());
app.use(cors());

connect(process.env.MONGO_DB_URL_STRING)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Server started at", process.env.PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
