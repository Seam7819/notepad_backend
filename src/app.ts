import "dotenv/config";
import cors from "cors";
import express from "express";
import { postRouter } from "./modules/post/post.route";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

const app = express();
app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json());
app.use(cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true,
}));


app.use("/posts", postRouter);

export default app;