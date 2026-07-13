import express from "express";
import dotenv from "dotenv";
import authRouter from "./auth/auth.controller";
import usersRouter from "./users/users.controller";
import booksRouter from "./books/books.controller";
import loansRouter from "./loans/loans.controller";
import authorsRouter from "./authors/authors.controller";
import categoriesRouter from "./categories/categories.controller";
import reportsRouter from "./reports/reports.controller";

dotenv.config();

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/books", booksRouter);
app.use("/loans", loansRouter);
app.use("/authors", authorsRouter);
app.use("/categories", categoriesRouter);
app.use("/reports", reportsRouter);

app.get("/health", (_req, res) => res.json({ status: "ok" }));

export default app;
