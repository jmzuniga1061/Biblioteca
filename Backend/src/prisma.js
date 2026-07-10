"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
var client_1 = require("@prisma/client");
dotenv_1.default.config();
var prisma = new client_1.PrismaClient();
exports.default = prisma;
