import { Router, Request, Response } from "express";
import { CategoriesService } from "./categories.service";
import { authenticateToken } from "./auth.middleware";
import { authorizeBibliotecario } from "./authors.middleware";

const router = Router();
const categoriesService = new CategoriesService();

router.get("/", authenticateToken, async (_req: Request, res: Response) => {
  try {
    const categories = await categoriesService.findAll();
    return res.json(categories);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

router.get("/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const categoryId = Number(req.params.id);
    const category = await categoriesService.findById(categoryId);
    return res.json(category);
  } catch (error: any) {
    return res.status(404).json({ error: error.message });
  }
});

router.post("/", authenticateToken, authorizeBibliotecario, async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const category = await categoriesService.createCategory(name, description);
    return res.status(201).json(category);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

router.put("/:id", authenticateToken, authorizeBibliotecario, async (req: Request, res: Response) => {
  try {
    const categoryId = Number(req.params.id);
    const updated = await categoriesService.updateCategory(categoryId, req.body);
    return res.json(updated);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", authenticateToken, authorizeBibliotecario, async (req: Request, res: Response) => {
  try {
    const categoryId = Number(req.params.id);
    const result = await categoriesService.deleteCategory(categoryId);
    return res.json(result);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

export default router;
