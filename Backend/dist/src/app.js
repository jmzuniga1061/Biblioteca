"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_controller_1 = __importDefault(require("./auth/auth.controller"));
const users_controller_1 = __importDefault(require("./users/users.controller"));
const books_controller_1 = __importDefault(require("./books/books.controller"));
const loans_controller_1 = __importDefault(require("./loans/loans.controller"));
const authors_controller_1 = __importDefault(require("./authors/authors.controller"));
const categories_controller_1 = __importDefault(require("./categories/categories.controller"));
const reports_controller_1 = __importDefault(require("./reports/reports.controller"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }
    next();
});
app.use("/auth", auth_controller_1.default);
app.use("/users", users_controller_1.default);
app.use("/books", books_controller_1.default);
app.use("/loans", loans_controller_1.default);
app.use("/authors", authors_controller_1.default);
app.use("/categories", categories_controller_1.default);
app.use("/reports", reports_controller_1.default);
app.get("/health", (_req, res) => res.json({ status: "ok" }));
exports.default = app;
//# sourceMappingURL=app.js.map