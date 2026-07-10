import { Router, Request, Response } from "express";
import { UsersService } from "./users.service";
import { authenticateToken, AuthRequest } from "./auth.middleware";
import { authorizeAdmin } from "./users.middleware";

const router = Router();
const usersService = new UsersService();

router.use(authenticateToken);

router.get("/", authorizeAdmin, async (_req: Request, res: Response) => {
  try {
    const users = await usersService.findAll();
    return res.json(users);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

router.get("/me", async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "No autenticado" });
    }
    const profile = await usersService.findProfile(req.user.userId);
    return res.json(profile);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

router.get("/:id", authorizeAdmin, async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);
    const user = await usersService.findById(userId);
    return res.json(user);
  } catch (error: any) {
    return res.status(404).json({ error: error.message });
  }
});

router.put("/:id", authorizeAdmin, async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);
    const { name, email, password } = req.body;
    const user = await usersService.updateUser(userId, { name, email, password });
    return res.json(user);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", authorizeAdmin, async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);
    const result = await usersService.deleteUser(userId);
    return res.json(result);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

router.patch("/:id/role", authorizeAdmin, async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);
    const { roleName } = req.body;
    const user = await usersService.changeUserRole(userId, roleName);
    return res.json(user);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

export default router;
