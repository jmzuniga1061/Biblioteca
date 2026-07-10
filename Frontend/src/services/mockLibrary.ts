import { canCreateBook, canBorrow, calculateLoanPrice, maxLoanDays, calculateFine } from "../utils/loanRules";

export type Role = "cliente" | "estudiante" | "bibliotecario" | "profesor" | "admin";

export type User = {
  email: string;
  password: string;
  role: Role;
  name: string;
};

export type Book = {
  id: string;
  title: string;
  author?: string;
  year?: number;
  publisher?: string;
  keywords?: string[];
  available: boolean;
};

export type Loan = {
  id: string;
  bookId: string;
  userEmail: string;
  startDate: string;
  dueDate: string;
  returned: boolean;
  returnedAt?: string | null;
  pricePaid: number;
};

const users: User[] = [
  { email: "cliente@example.com", password: "pass", role: "cliente", name: "Cliente" },
  { email: "estudiante@example.com", password: "pass", role: "estudiante", name: "Estudiante" },
  { email: "bibliotecario@example.com", password: "pass", role: "bibliotecario", name: "Bibliotecario" },
  { email: "profesor@example.com", password: "pass", role: "profesor", name: "Profesor" },
  { email: "admin@example.com", password: "pass", role: "admin", name: "Administrador" },
];

// In-memory store for demo purposes
const books: Book[] = [
  { id: "1", title: "El Principito", author: "Antoine de Saint-Exupéry", year: 1943, publisher: "Reynal & Hitchcock", keywords: ["infantil"], available: true },
  { id: "2", title: "Cien Años de Soledad", author: "Gabriel García Márquez", year: 1967, publisher: "Editorial Sudamericana", keywords: ["realismo mágico"], available: true },
  { id: "3", title: "Don Quijote de la Mancha", author: "Miguel de Cervantes", year: 1605, publisher: "Francisco de Robles", keywords: ["clásico"], available: true },
];

const loans: Loan[] = [];

export function searchBooks(query: { title?: string; author?: string; year?: number; publisher?: string; keywords?: string[] }) {
  return books.filter((b) => {
    if (query.title && !b.title.toLowerCase().includes(query.title.toLowerCase())) return false;
    if (query.author && !(b.author || "").toLowerCase().includes(query.author.toLowerCase())) return false;
    if (query.year && b.year !== query.year) return false;
    if (query.publisher && !(b.publisher || "").toLowerCase().includes(query.publisher.toLowerCase())) return false;
    if (query.keywords && query.keywords.length > 0) {
      const has = query.keywords.some(k => (b.keywords || []).some(bk => bk.toLowerCase().includes(k.toLowerCase())));
      if (!has) return false;
    }
    return true;
  });
}

export function findUserByEmail(email: string) {
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export function getUsers() {
  return users.slice();
}

export function createUser(actorRole: Role | null, user: Omit<User, "password"> & { password: string }) {
  if (actorRole !== "admin") throw new Error("No tienes permiso para crear usuarios");
  if (findUserByEmail(user.email)) throw new Error("El usuario ya existe");
  const newUser: User = { ...user };
  users.push(newUser);
  return newUser;
}

export function deleteUser(actorRole: Role | null, email: string) {
  if (actorRole !== "admin") throw new Error("No tienes permiso para eliminar usuarios");
  if (email.toLowerCase() === "admin@example.com") throw new Error("No puedes eliminar al administrador principal");
  const index = users.findIndex((user) => user.email.toLowerCase() === email.toLowerCase());
  if (index === -1) throw new Error("Usuario no encontrado");
  users.splice(index, 1);
}

export function updateUserRole(actorRole: Role | null, email: string, role: Role) {
  if (actorRole !== "admin") throw new Error("No tienes permiso para cambiar roles");
  const user = findUserByEmail(email);
  if (!user) throw new Error("Usuario no encontrado");
  if (user.email.toLowerCase() === "admin@example.com" && role !== "admin") throw new Error("No puedes cambiar el rol del administrador principal");
  user.role = role;
  return user;
}

export function listBooks() {
  return books.slice();
}

export function createBook(actorRole: Role | null, book: Omit<Book, "id" | "available">) {
  if (!canCreateBook(actorRole)) throw new Error("No tienes permiso para crear libros");
  const newBook: Book = { id: String(Date.now()), ...book, available: true };
  books.push(newBook);
  return newBook;
}

export function borrowBook(userEmail: string, actorRole: Role | null, bookId: string, basePrice = 10) {
  // check book
  const book = books.find(b => b.id === bookId);
  if (!book || !book.available) throw new Error("Libro no disponible");

  // check active loans
  const activeLoans = loans.filter(l => l.userEmail === userEmail && !l.returned);
  if (!canBorrow(activeLoans.length)) throw new Error("Has alcanzado el número máximo de préstamos activos (3)");

  // price and duration
  const price = calculateLoanPrice(basePrice, actorRole);
  const maxDays = maxLoanDays(actorRole);
  const start = new Date();
  const due = new Date();
  if (maxDays > 0) due.setDate(start.getDate() + maxDays);
  else due.setFullYear(start.getFullYear() + 1); // arbitrario para profesor

  const loan: Loan = {
    id: String(Date.now()),
    bookId,
    userEmail,
    startDate: start.toISOString(),
    dueDate: due.toISOString(),
    returned: false,
    pricePaid: price,
  };

  loans.push(loan);
  book.available = false;
  return loan;
}

export function returnBook(actorRole: Role | null, loanId: string) {
  const loan = loans.find(l => l.id === loanId);
  if (!loan) throw new Error("Préstamo no encontrado");
  if (loan.returned) throw new Error("El libro ya fue devuelto");

  // Only bibliotecario or admin or the user themselves can register return
  if (actorRole !== "bibliotecario" && actorRole !== "admin") {
    // allow the borrower to return but not to "register" in some systems; we'll allow return
  }

  loan.returned = true;
  loan.returnedAt = new Date().toISOString();

  const book = books.find(b => b.id === loan.bookId);
  if (book) book.available = true;

  // compute fines
  const due = new Date(loan.dueDate);
  const returnedAt = new Date(loan.returnedAt);
  const diff = Math.ceil((returnedAt.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
  const fine = calculateFine(diff > 0 ? diff : 0, actorRole);

  return { loan, fine };
}

export function getUserLoans(userEmail: string) {
  return loans.filter((l) => l.userEmail === userEmail);
}

export function getAllLoans() {
  return loans.slice();
}

export function getBookLoan(bookId: string) {
  return loans.find((l) => l.bookId === bookId && !l.returned) ?? null;
}
