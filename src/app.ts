import "dotenv/config";
import cors from "cors";
import express from "express";
import { postRouter } from "./modules/post/post.route";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/posts", postRouter);

export default app;