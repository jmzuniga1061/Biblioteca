"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
const prisma_1 = require("./prisma/prisma");
const port = process.env.PORT || 3000;
app_1.default.listen(port, async () => {
    try {
        await (0, prisma_1.ensureRoles)();
        console.log("Roles ensured successfully.");
    }
    catch (error) {
        console.error("Error ensuring roles:", error);
    }
    console.log(`Server listening on http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map