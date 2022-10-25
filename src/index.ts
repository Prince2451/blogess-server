import "./dotenv";
import express from "express";
import cors from "cors";
import { connect } from "mongoose";
import * as routes from "./routes";
import * as middlewares from "./middlewares";

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.use(routes.publicRoutes);
app.use(routes.privateRoutes);

app.use(middlewares.errorMiddleware);

connect(process.env.MONGO_DB_URL_STRING)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Server started at", process.env.PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
