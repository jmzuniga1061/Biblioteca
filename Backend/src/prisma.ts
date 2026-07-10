import * as dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

dotenv.config();
if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: ".env.test" });
}

const databaseUrl = process.env.DATABASE_URL ?? process.env.DATABASE_URL_TEST;
if (!databaseUrl) {
  throw new Error("DATABASE_URL or DATABASE_URL_TEST must be defined");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg(databaseUrl),
});

export default prisma;
