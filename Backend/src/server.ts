import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { ensureRoles } from "./prisma/prisma";

const port = process.env.PORT || 3000;
app.listen(port, async () => {
  try {
    await ensureRoles();
    console.log("Roles ensured successfully.");
  } catch (error) {
    console.error("Error ensuring roles:", error);
  }
  console.log(`Server listening on http://localhost:${port}`);
});
