import { Router, Request, Response } from "express";
import { AuthService } from "./auth.service";

const authService = new AuthService();
const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password, roleName } = req.body;
    const token = await authService.register(name, email, password, roleName || "cliente");
    return res.status(201).json({ token });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const token = await authService.login(email, password);
    return res.json({ token });
  } catch (error: any) {
    return res.status(401).json({ error: error.message });
  }
});

router.post("/refresh-token", async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const refreshedToken = await authService.refreshToken(token);
    return res.json({ token: refreshedToken });
  } catch (error: any) {
    return res.status(401).json({ error: error.message });
  }
});

router.post("/logout", async (_req: Request, res: Response) => {
  const result = await authService.logout();
  return res.json(result);
});

export default router;
