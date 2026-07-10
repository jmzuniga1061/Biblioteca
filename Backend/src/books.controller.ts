import { Router, Request, Response } from "express";
import { BooksService } from "./books.service";
import { authenticateToken, AuthRequest } from "./auth.middleware";
import { authorizeBibliotecario } from "./books.middleware";

const router = Router();
const booksService = new BooksService();

router.get("/", authenticateToken, async (_req: Request, res: Response) => {
  try {
    const books = await booksService.findAll();
    return res.json(books);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

router.get("/search", authenticateToken, async (req: Request, res: Response) => {
  try {
    const books = await booksService.searchBooks(req.query.query as string | undefined);
    return res.json(books);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

router.get("/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const bookId = Number(req.params.id);
    const book = await booksService.findById(bookId);
    return res.json(book);
  } catch (error: any) {
    return res.status(404).json({ error: error.message });
  }
});

router.post("/", authenticateToken, authorizeBibliotecario, async (req: AuthRequest, res: Response) => {
  try {
    const created = await booksService.createBook(req.body);
    return res.status(201).json(created);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

router.put("/:id", authenticateToken, authorizeBibliotecario, async (req: AuthRequest, res: Response) => {
  try {
    const bookId = Number(req.params.id);
    const updated = await booksService.updateBook(bookId, req.body);
    return res.json(updated);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", authenticateToken, authorizeBibliotecario, async (req: AuthRequest, res: Response) => {
  try {
    const bookId = Number(req.params.id);
    const result = await booksService.deleteBook(bookId);
    return res.json(result);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

export default router;
