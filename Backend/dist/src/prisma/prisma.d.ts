import { PrismaClient } from "../generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
export declare const prisma: PrismaClient<{
    adapter: PrismaPg;
}, never, import("src/generated/client/runtime/library").DefaultArgs>;
export declare function ensureRoles(): Promise<void>;
export default prisma;
