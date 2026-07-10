const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

function getAuthToken() {
  return localStorage.getItem("auth_token");
}

function authHeaders() {
  const token = getAuthToken();
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const error = body.error || response.statusText || "Error en la petición";
    throw new Error(error);
  }
  return response.json();
}

function authHeaders() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function login(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
}

export async function register(name: string, email: string, password: string, role = "cliente") {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, roleName: role }),
  });
  return handleResponse(response);
}

export async function refreshToken(token: string) {
  const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  return handleResponse(response);
}

export async function getBooks() {
  const response = await fetch(`${API_BASE_URL}/books`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return handleResponse(response);
}

export async function getBookDetail(id: number) {
  const response = await fetch(`${API_BASE_URL}/books/${id}`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return handleResponse(response);
}

export async function createBook(book: any) {
  const response = await fetch(`${API_BASE_URL}/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(book),
  });
  return handleResponse(response);
}

export async function createLoan(bookId: number) {
  const response = await fetch(`${API_BASE_URL}/loans`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ bookId }),
  });
  return handleResponse(response);
}

export async function getLoans() {
  const response = await fetch(`${API_BASE_URL}/loans`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return handleResponse(response);
}

export async function returnLoan(id: number) {
  const response = await fetch(`${API_BASE_URL}/loans/${id}/return`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return handleResponse(response);
}

export async function getAuthors() {
  const response = await fetch(`${API_BASE_URL}/authors`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return handleResponse(response);
}

export async function createAuthor(author: any) {
  const response = await fetch(`${API_BASE_URL}/authors`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(author),
  });
  return handleResponse(response);
}

export async function getCategories() {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return handleResponse(response);
}

export async function createCategory(category: any) {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(category),
  });
  return handleResponse(response);
}

export async function getUsers() {
  const response = await fetch(`${API_BASE_URL}/users`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return handleResponse(response);
}

export async function getReports() {
  const [monthly, topBooks, activeUsers, overdue] = await Promise.all([
    fetch(`${API_BASE_URL}/reports/loans/monthly`, { headers: { "Content-Type": "application/json", ...authHeaders() } }),
    fetch(`${API_BASE_URL}/reports/books/top`, { headers: { "Content-Type": "application/json", ...authHeaders() } }),
    fetch(`${API_BASE_URL}/reports/users/active`, { headers: { "Content-Type": "application/json", ...authHeaders() } }),
    fetch(`${API_BASE_URL}/reports/loans/overdue`, { headers: { "Content-Type": "application/json", ...authHeaders() } }),
  ]);

  return {
    monthly: await handleResponse(monthly),
    topBooks: await handleResponse(topBooks),
    activeUsers: await handleResponse(activeUsers),
    overdue: await handleResponse(overdue),
  };
}

export async function getBookLoanStatus(bookId: number) {
  const response = await fetch(`${API_BASE_URL}/loans/book/${bookId}`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return handleResponse(response);
}
