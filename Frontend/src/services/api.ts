const API_BASE_URL =
import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// 🔐 TOKEN
function getAuthToken() {
return localStorage.getItem("auth_token");
}

// 🔐 HEADERS
function authHeaders(): HeadersInit {
const token = getAuthToken();

const headers: Record<string, string> = {
"Content-Type": "application/json",
};

if (token) {
headers["Authorization"] = `Bearer ${token}`;
}

return headers;
}

// 🔁 RESPUESTAS
async function handleResponse(response: Response) {
if (!response.ok) {
const body = await response.json().catch(() => ({}));
const error = body.error || response.statusText || "Error en la petición";
throw new Error(error);
}
return response.json();
}

// ==================
// 📊 TIPOS
// ==================

type ReportsResponse = {
monthly: any[];
topBooks: any[];
activeUsers: any[];
overdue: any[];
};

// ==================
// 🔐 AUTH
// ==================

export async function login(email: string, password: string) {
const response = await fetch(`${API_BASE_URL}/auth/login`, {
method: "POST",
headers: authHeaders(),
body: JSON.stringify({ email, password }),
});
return handleResponse(response);
}

export async function register(
name: string,
email: string,
password: string,
role = "cliente"
) {
const response = await fetch(`${API_BASE_URL}/auth/register`, {
method: "POST",
headers: authHeaders(),
body: JSON.stringify({ name, email, password, roleName: role }),
});
return handleResponse(response);
}

export async function refreshToken(token: string) {
const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
method: "POST",
headers: authHeaders(),
body: JSON.stringify({ token }),
});
return handleResponse(response);
}

// ==================
// 📚 BOOKS
// ==================

export async function getBooks() {
const response = await fetch(`${API_BASE_URL}/books`, {
headers: authHeaders(),
});
return handleResponse(response);
}

export async function getBookDetail(id: number) {
const response = await fetch(`${API_BASE_URL}/books/${id}`, {
headers: authHeaders(),
});
return handleResponse(response);
}

export async function createBook(book: any) {
const response = await fetch(`${API_BASE_URL}/books`, {
method: "POST",
headers: authHeaders(),
body: JSON.stringify(book),
});
return handleResponse(response);
}

// ==================
// 📖 LOANS
// ==================

export async function createLoan(bookId: number, documentType?: string) {
const response = await fetch(`${API_BASE_URL}/loans`, {
method: "POST",
headers: authHeaders(),
body: JSON.stringify({ bookId, documentType }),
});
return handleResponse(response);
}

export async function getLoans() {
const response = await fetch(`${API_BASE_URL}/loans`, {
headers: authHeaders(),
});
return handleResponse(response);
}

export async function returnLoan(id: number) {
const response = await fetch(`${API_BASE_URL}/loans/${id}/return`, {
method: "PATCH",
headers: authHeaders(),
});
return handleResponse(response);
}

export async function getBookLoanStatus(bookId: number) {
const response = await fetch(`${API_BASE_URL}/loans/book/${bookId}`, {
headers: authHeaders(),
});
return handleResponse(response);
}

// ==================
// ✍️ AUTHORS
// ==================

export async function getAuthors() {
const response = await fetch(`${API_BASE_URL}/authors`, {
headers: authHeaders(),
});
return handleResponse(response);
}

export async function createAuthor(author: any) {
const response = await fetch(`${API_BASE_URL}/authors`, {
method: "POST",
headers: authHeaders(),
body: JSON.stringify(author),
});
return handleResponse(response);
}

// ==================
// 🏷️ CATEGORIES
// ==================

export async function getCategories() {
const response = await fetch(`${API_BASE_URL}/categories`, {
headers: authHeaders(),
});
return handleResponse(response);
}

export async function createCategory(category: any) {
const response = await fetch(`${API_BASE_URL}/categories`, {
method: "POST",
headers: authHeaders(),
body: JSON.stringify(category),
});
return handleResponse(response);
}

// ==================
// 👤 USERS
// ==================

export async function getUsers() {
const response = await fetch(`${API_BASE_URL}/users`, {
headers: authHeaders(),
});
return handleResponse(response);
}

export async function deleteUser(id: number) {
const response = await fetch(`${API_BASE_URL}/users/${id}`, {
method: "DELETE",
headers: authHeaders(),
});
return handleResponse(response);
}

export async function changeUserRole(id: number, roleName: string) {
const response = await fetch(`${API_BASE_URL}/users/${id}/role`, {
method: "PATCH",
headers: authHeaders(),
body: JSON.stringify({ roleName }),
});
return handleResponse(response);
}

// ==================
// 📊 REPORTS (CORREGIDO + TIPADO)
// ==================

export async function getReports(): Promise<ReportsResponse> {
const [monthly, topBooks, activeUsers, overdue] = await Promise.all([
fetch(`${API_BASE_URL}/reports/loans/monthly`, {
headers: authHeaders(),
}),
fetch(`${API_BASE_URL}/reports/books/top`, {
headers: authHeaders(),
}),
fetch(`${API_BASE_URL}/reports/users/active`, {
headers: authHeaders(),
}),
fetch(`${API_BASE_URL}/reports/loans/overdue`, {
headers: authHeaders(),
}),
]);

return {
monthly: await handleResponse(monthly),
topBooks: await handleResponse(topBooks),
activeUsers: await handleResponse(activeUsers),
overdue: await handleResponse(overdue),
};
}
