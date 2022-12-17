import "./dotenv";
import express from "express";
import cors from "cors";
import { connect } from "mongoose";
import * as routes from "./routes";
import * as middlewares from "./middlewares";
import { STATIC_FILES_BASE_PATH, STATIC_FILES_ROUTE } from "./utils/constants";

const app = express();

app.use(express.json());
app.use(cors());
app.use(STATIC_FILES_ROUTE, express.static(STATIC_FILES_BASE_PATH));
app.use(express.urlencoded({ extended: false }));

app.use(routes.publicRoutes);

app.use(middlewares.authMiddleware);

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
