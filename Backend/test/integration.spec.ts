import request from 'supertest';
import app from '../src/app';
import prisma from '../src/prisma';

describe('Backend integration tests', () => {
  const adminUser = { name: 'Admin Test', email: 'admin@test.local', password: 'Password123!', roleName: 'admin' };
  const bibliotecarioUser = { name: 'Biblio Test', email: 'biblio@test.local', password: 'Password123!', roleName: 'bibliotecario' };
  const estudianteUser = { name: 'Estudiante Test', email: 'estudiante@test.local', password: 'Password123!', roleName: 'estudiante' };
  const clienteUser = { name: 'Cliente Test', email: 'cliente@test.local', password: 'Password123!', roleName: 'cliente' };
  const professorUser = { name: 'Profesor Test', email: 'profesor@test.local', password: 'Password123!', roleName: 'profesor' };

  let adminToken: string;
  let bibliotecarioToken: string;
  let estudianteToken: string;
  let clienteToken: string;
  let profesorToken: string;
  let createdBookId: number;
  let createdLoanId: number;

  beforeAll(async () => {
    await prisma.$connect();
    await prisma.loan.deleteMany();
    await prisma.book.deleteMany();
    await prisma.user.deleteMany();
    await prisma.author.deleteMany();
    await prisma.category.deleteMany();
    await prisma.rolePermission.deleteMany();
    await prisma.permission.deleteMany();
    await prisma.role.deleteMany();

    await prisma.role.createMany({
      data: [
        { name: 'admin', description: 'Administrador' },
        { name: 'bibliotecario', description: 'Bibliotecario' },
        { name: 'cliente', description: 'Cliente' },
        { name: 'estudiante', description: 'Estudiante' },
        { name: 'profesor', description: 'Profesor' },
      ],
    });

    const category = await prisma.category.create({ data: { name: 'Test Category', description: 'Categoría para pruebas' } });
    const author = await prisma.author.create({ data: { name: 'Test Author', biography: 'Autor de prueba' } });

    const createdBook = await prisma.book.create({
      data: {
        title: 'Test Book',
        isbn: 'ISBN-TEST-0001',
        description: 'Libro de prueba',
        stock: 1,
        available: true,
        authorId: author.id,
        categoryId: category.id,
      },
    });

    createdBookId = createdBook.id;

    const registerUser = async (user: typeof adminUser) => {
      const res = await request(app).post('/auth/register').send(user).expect(201);
      return res.body.token as string;
    };

    adminToken = await registerUser(adminUser);
    bibliotecarioToken = await registerUser(bibliotecarioUser);
    estudianteToken = await registerUser(estudianteUser);
    clienteToken = await registerUser(clienteUser);
    profesorToken = await registerUser(professorUser);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  afterEach(async () => {
    await prisma.loan.deleteMany();
  });

  describe('AuthModule', () => {
    it('POST /auth/register debe crear usuario nuevo', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({ name: 'Nueva Cuenta', email: 'nueva@test.local', password: 'Password123!', roleName: 'cliente' })
        .expect(201);

      expect(response.body.token).toBeDefined();
    });

    it('POST /auth/login debe devolver JWT válido', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: bibliotecarioUser.email, password: bibliotecarioUser.password })
        .expect(200);

      expect(response.body.token).toBeDefined();
      expect(typeof response.body.token).toBe('string');
    });

    it('middleware debe rechazar token inválido', async () => {
      await request(app)
        .get('/users/me')
        .set('Authorization', 'Bearer invalid.token.value')
        .expect(401)
        .expect((res) => {
          expect(res.body.error).toMatch(/Token inválido|Token inválido o expirado/);
        });
    });
  });

  describe('UsersModule', () => {
    it('GET /users solo admin puede listar usuarios', async () => {
      await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });

      await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${clienteToken}`)
        .expect(403);
    });

    it('PATCH /users/:id/role solo admin puede cambiar rol', async () => {
      const user = await prisma.user.findUnique({ where: { email: clienteUser.email } });
      expect(user).toBeTruthy();

      await request(app)
        .patch(`/users/${user!.id}/role`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ roleName: 'estudiante' })
        .expect(200)
        .expect((res) => {
          expect(res.body.role).toBe('estudiante');
        });

      await request(app)
        .patch(`/users/${user!.id}/role`)
        .set('Authorization', `Bearer ${clienteToken}`)
        .send({ roleName: 'admin' })
        .expect(403);
    });

    it('GET /me debe devolver perfil del usuario autenticado', async () => {
      const response = await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${bibliotecarioToken}`)
        .expect(200);

      expect(response.body.email).toBe(bibliotecarioUser.email);
      expect(response.body.role).toBe(bibliotecarioUser.roleName);
    });
  });

  describe('BooksModule', () => {
    it('GET /books todos los roles pueden ver catálogo', async () => {
      const tokens = [adminToken, bibliotecarioToken, estudianteToken, clienteToken, profesorToken];
      for (const token of tokens) {
        await request(app)
          .get('/books')
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .expect((res) => {
            expect(Array.isArray(res.body)).toBe(true);
          });
      }
    });

    it('POST /books solo bibliotecario puede agregar libro', async () => {
      const newBook = {
        title: 'Libro Nuevo',
        isbn: 'ISBN-TEST-BOOK-002',
        authorId: 1,
        categoryId: 1,
        description: 'Descripción de prueba',
        stock: 2,
      };

      await request(app)
        .post('/books')
        .set('Authorization', `Bearer ${bibliotecarioToken}`)
        .send(newBook)
        .expect(201)
        .expect((res) => {
          expect(res.body.id).toBeDefined();
        });

      await request(app)
        .post('/books')
        .set('Authorization', `Bearer ${clienteToken}`)
        .send(newBook)
        .expect(403);
    });

    it('PUT /books/:id solo bibliotecario puede actualizar libro', async () => {
      const response = await request(app)
        .post('/books')
        .set('Authorization', `Bearer ${bibliotecarioToken}`)
        .send({
          title: 'Libro a actualizar',
          isbn: 'ISBN-TEST-BOOK-003',
          authorId: 1,
          categoryId: 1,
          description: 'Original',
          stock: 1,
        })
        .expect(201);

      const bookId = response.body.id;

      await request(app)
        .put(`/books/${bookId}`)
        .set('Authorization', `Bearer ${bibliotecarioToken}`)
        .send({ title: 'Libro actualizado' })
        .expect(200)
        .expect((res) => {
          expect(res.body.title).toBe('Libro actualizado');
        });

      await request(app)
        .put(`/books/${bookId}`)
        .set('Authorization', `Bearer ${clienteToken}`)
        .send({ title: 'Libro hackeado' })
        .expect(403);
    });
  });

  describe('LoansModule', () => {
    it('POST /loans debe respetar límite de 3 préstamos activos', async () => {
      const bookIds: number[] = [];
      for (let i = 0; i < 4; i++) {
        const book = await prisma.book.create({
          data: {
            title: `Loan Book ${i}`,
            isbn: `ISBN-LOAN-${i}`,
            authorId: 1,
            categoryId: 1,
            description: 'Book for loan test',
            stock: 1,
            available: true,
          },
        });
        bookIds.push(book.id);
      }

      for (let i = 0; i < 3; i++) {
        await request(app)
          .post('/loans')
          .set('Authorization', `Bearer ${clienteToken}`)
          .send({ bookId: bookIds[i] })
          .expect(201);
      }

      await request(app)
        .post('/loans')
        .set('Authorization', `Bearer ${clienteToken}`)
        .send({ bookId: bookIds[3] })
        .expect(400)
        .expect((res) => {
          expect(res.body.error).toMatch(/número máximo de préstamos activos/i);
        });
    });

    it('PATCH /loans/:id/return debe registrar devolución', async () => {
      const loanResponse = await request(app)
        .post('/loans')
        .set('Authorization', `Bearer ${clienteToken}`)
        .send({ bookId: createdBookId })
        .expect(201);

      const loanId = loanResponse.body.loan.id;
      createdLoanId = loanId;

      await request(app)
        .patch(`/loans/${loanId}/return`)
        .set('Authorization', `Bearer ${bibliotecarioToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.fine).toBeDefined();
        });
    });

    it('Reglas de negocio: cliente 10 días, estudiante 50% descuento, profesor gratis', async () => {
      const testLoanForRole = async (token: string, userRole: string, expectedDays: number, expectedDiscountOrFree: string) => {
        const book = await prisma.book.create({
          data: {
            title: `Role Test Book ${userRole}`,
            isbn: `ISBN-ROLE-${userRole}`,
            authorId: 1,
            categoryId: 1,
            description: 'Role based loan',
            stock: 1,
            available: true,
          },
        });

        const response = await request(app)
          .post('/loans')
          .set('Authorization', `Bearer ${token}`)
          .send({ bookId: book.id })
          .expect(201);

        const loanPayload = response.body;
        expect(new Date(loanPayload.dueDate).getDate()).toBeGreaterThan(0);
        expect(loanPayload.feePolicy.maxDays).toBe(expectedDays);
        expect(loanPayload.feePolicy.discount).toBe(expectedDiscountOrFree);
      };

      await testLoanForRole(clienteToken, 'cliente', 10, '0%');
      await testLoanForRole(estudianteToken, 'estudiante', 10, '50%');
      await testLoanForRole(profesorToken, 'profesor', 365, '100%');
    });
  });

  describe('ReportsModule', () => {
    it('GET /reports/books/top debe devolver libros más prestados', async () => {
      await request(app)
        .get('/reports/books/top')
        .set('Authorization', `Bearer ${bibliotecarioToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('GET /reports/users/active debe devolver usuarios más activos', async () => {
      await request(app)
        .get('/reports/users/active')
        .set('Authorization', `Bearer ${bibliotecarioToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('solo admin y bibliotecario pueden acceder', async () => {
      await request(app)
        .get('/reports/books/top')
        .set('Authorization', `Bearer ${clienteToken}`)
        .expect(403);

      await request(app)
        .get('/reports/users/active')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });
  });
});
