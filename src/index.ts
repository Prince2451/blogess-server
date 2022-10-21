import "./dotenv";
import express, { Router } from "express";
import cors from "cors";
import { connect } from "mongoose";
import * as routes from "./routes";

const app = express();
const router = Router();

app.use(express.json());
app.use(cors());

router.use(routes.publicRoutes);
router.use(routes.privateRoutes);

connect(process.env.MONGO_DB_URL_STRING)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Server started at", process.env.PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
