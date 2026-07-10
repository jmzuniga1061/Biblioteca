type Role = "cliente" | "estudiante" | "bibliotecario" | "profesor" | "admin";

export function canCreateBook(role: Role | null) {
  return role === "bibliotecario";
}

export function maxLoanDays(role: Role | null) {
  if (role === "cliente") return 10;
  if (role === "estudiante") return 10;
  if (role === "profesor") return 0; // 0 -> unlimited
  return 30; // bibliotecario/admin default
}

export function calculateLoanPrice(basePrice: number, role: Role | null) {
  if (role === "profesor") return 0; // free
  if (role === "estudiante") return basePrice * 0.5; // 50% discount
  return basePrice;
}

export function canBorrow(activeLoansCount: number) {
  // no user can have more than 3 active loans
  return activeLoansCount < 3;
}

export function calculateFine(daysOverdue: number, role: Role | null) {
  if (daysOverdue <= 0) return 0;
  if (role === "cliente") {
    // cliente: higher fines
    return daysOverdue * 2; // arbitrary units
  }
  return daysOverdue * 1; // standard fine
}
