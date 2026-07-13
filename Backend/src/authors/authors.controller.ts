import { Router, Request, Response } from "express";
import { AuthorsService } from "./authors.service";
import { authenticateToken, AuthRequest } from "../auth/auth.middleware";
import { authorizeBibliotecario } from "./authors.middleware";

const router = Router();
const authorsService = new AuthorsService();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const authors = await authorsService.findAll();
    return res.json(authors);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const authorId = Number(req.params.id);
    const author = await authorsService.findById(authorId);
    return res.json(author);
  } catch (error: any) {
    return res.status(404).json({ error: error.message });
  }
});

router.post("/", authenticateToken, authorizeBibliotecario, async (req: AuthRequest, res: Response) => {
  try {
    const { name, biography } = req.body;
    const author = await authorsService.createAuthor(name, biography);
    return res.status(201).json(author);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

router.put("/:id", authenticateToken, authorizeBibliotecario, async (req: Request, res: Response) => {
  try {
    const authorId = Number(req.params.id);
    const updated = await authorsService.updateAuthor(authorId, req.body);
    return res.json(updated);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", authenticateToken, authorizeBibliotecario, async (req: Request, res: Response) => {
  try {
    const authorId = Number(req.params.id);
    const result = await authorsService.deleteAuthor(authorId);
    return res.json(result);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

export default router;
