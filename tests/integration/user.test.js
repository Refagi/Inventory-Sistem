const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const { userOne, userTwo, insertUsers, admin } = require('../fixtures/user.fixture');
const prisma = require('../../prisma');
const { adminAccessToken, userOneAccessToken } = require('../fixtures/token.fixture');
const { tokenService } = require('../../src/services');

describe.skip('User Route ', () => {
  let newUser;
  beforeEach(async () => {
    newUser = {
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      email: 'brong@gmail.com',
      password: 'password1',
      role: 'user',
    };
  }, 50000);

  describe('Authorization', () => {
    beforeEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
      await insertUsers([userOne, admin]);
    }, 50000);

    afterEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
    });
    test('should return 401 unauthorized error if role is not admin', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(userOne);
      await request(app)
        .post('/api/users')
        .send(newUser)
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 unauthorized error if role is not admin', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(userOne);
      const pagination = { role: userOne.role, page: 1, size: 2 };

      await request(app)
        .get('/api/users')
        .query({pagination})
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 unauthorized error if role is not admin', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(userOne);
      await request(app)
        .get(`/api/users/${userOne.id}`)
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 unauthorized error if role is not admin', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(userOne);
      await request(app)
        .put(`/api/users/${userOne.id}`)
        .send(newUser)
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 unauthorized error if role is not admin', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(userOne);
      await request(app)
        .delete(`/api/users/${userOne.id}`)
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 unauthorized error if not access token', async () => {
      await request(app).post('/api/users').send(newUser).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 unauthorized error if not access token', async () => {
      const pagination = { role: userOne.role, page: 1, size: 2 };
      await request(app).get('/api/users').query({pagination}).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 unauthorized error if not access token', async () => {
      await request(app).get(`/api/users/${userOne.id}`).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 unauthorized error if not access token', async () => {
      await request(app).put(`/api/users/${userOne.id}`).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 unauthorized error if not access token', async () => {
      await request(app).delete(`/api/users/${userOne.id}`).expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe('POST /api/users/', () => {
    beforeEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
      await insertUsers([userOne, admin]);
    });

    afterEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
    });

    test('should return 201 if successfully created user', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(admin);
      const newUserTwo = { ...newUser, role: 'admin' };
      const res = await request(app)
        .post('/api/users/')
        .send(newUserTwo)
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.CREATED);

      const userData = res.body.data;

      expect(userData).toEqual({
        id: expect.anything(),
        name: newUserTwo.name,
        password: expect.anything(),
        email: newUserTwo.email,
        role: newUserTwo.role,
        isEmailVerified: false,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });

      const dbUser = await prisma.user.findUnique({
        where: { id: userData.id },
      });

      expect(dbUser).toBeDefined();
      expect(dbUser.password).not.toBe(newUserTwo.password);

      expect(dbUser).toMatchObject({
        id: expect.anything(),
        name: newUserTwo.name,
        password: expect.anything(),
        email: newUserTwo.email,
        role: newUserTwo.role,
        isEmailVerified: false,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });
    });

    test('should return 400 Bad Request if format email invalid', async () => {
      newUser.email = 'brongz@yahoo';
      const validAccessToken = await tokenService.generateAuthTokens(admin);
      await request(app)
        .post('/api/users')
        .send(newUser)
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 Bad Request if password length is less than 8 characters', async () => {
      newUser.password = 'brong1';
      const validAccessToken = await tokenService.generateAuthTokens(admin);
      await request(app)
        .post('/api/users')
        .send(newUser)
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 Bad Request if password is not contain 1 latter or 1 number', async () => {
      newUser.password = 'brongz';
      const validAccessToken = await tokenService.generateAuthTokens(admin);
      await request(app)
        .post('/api/users')
        .send(newUser)
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 Bad Request if not data input', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(admin);
      await request(app)
        .post('/api/users')
        .send()
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /api/users', () => {
    beforeEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
      await insertUsers([userOne, admin]);
    });

    afterEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
    });

    test('should return 200 OK if Get Users Data is successfully', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(admin);
      const pagination = { role: userOne.role, page: 1, size: 2 };

      const res = await request(app)
        .get('/api/users')
        .query({ pagination })
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.OK);

      // console.log('Response body:', res.body);

      const userData = res.body.data;
      const userCurrentPage = res.body.currentPage;
      const userTotalData = res.body.totalData;
      const userTotalPage = res.body.totalPage;

      expect(userData).toEqual([
        {
          id: expect.anything(),
          name: admin.name,
          password: expect.anything(),
          email: admin.email,
          role: admin.role,
          isEmailVerified: false,
          createdAt: expect.anything(),
          updatedAt: expect.anything(),
        },
        {
          id: expect.anything(),
          name: userOne.name,
          password: expect.anything(),
          email: userOne.email,
          role: userOne.role,
          isEmailVerified: false,
          createdAt: expect.anything(),
          updatedAt: expect.anything(),
        },
      ]);

      expect(userCurrentPage).toEqual(expect.any(Number));
      expect(userTotalData).toEqual(expect.any(Number));
      expect(userTotalPage).toEqual(expect.any(Number));

      const dbUser = await prisma.user.findUnique({
        where: { id: userData[0].id, id: userData[1].id },
      });

      expect(dbUser).toBeDefined();
      expect(dbUser).toMatchObject({
        id: expect.anything(),
        name: userOne.name,
        password: expect.anything(),
        email: userOne.email,
        role: userOne.role,
        isEmailVerified: false,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });
    });

    test('shoul return 400 Bad Request if query pagination is null', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(admin);
      await request(app)
        .get('/api/users')
        .query({ role: null, page: null, size: null })
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 Bad Request if page is grather than total page or size is greater than total data', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(admin);
      await request(app)
        .get('/api/users')
        .query({ role: userOne.role, page: 1, size: 100 })
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /api/users/:userId', () => {
    beforeEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
      await insertUsers([userOne, admin]);
    });

    afterEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
    });

    test('should return 200 OK if Get User By Id is successfully', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(admin);

      const res = await request(app)
        .get(`/api/users/${userOne.id}`)
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.OK);

      const userData = res.body.data;

      expect(userData).toEqual({
        id: expect.anything(),
        name: userOne.name,
        password: expect.anything(),
        email: userOne.email,
        role: userOne.role,
        isEmailVerified: false,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });
    });

    test('should return 404 if Id user is Not Found', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(admin);
      await request(app)
        .get(`/api/users/${userTwo.id}`)
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('GET /api/user/email/:email', () => {
    beforeEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
      await insertUsers([userOne, admin]);
    });

    afterEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
    });

    test('should return 200 OK if Get user By Email is successfully', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(admin);

      const res = await request(app)
        .get(`/api/users/email/${userOne.email}`)
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.OK);

      const userData = res.body.data;

      expect(userData).toEqual({
        id: expect.anything(),
        name: userOne.name,
        password: expect.anything(),
        email: userOne.email,
        role: userOne.role,
        isEmailVerified: false,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });
    });

    test('should return 404 if Email user is Not Found', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(admin);
      await request(app)
        .get(`/api/users/email/${userTwo.email}`)
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 Bad Request if format email invalid', async () => {
      userOne.email = 'brongz@yahoo';
      const validAccessToken = await tokenService.generateAuthTokens(admin);
      await request(app)
        .get(`/api/users/email/${userOne.email}`)
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('PUT /api/users/:userId', () => {
    beforeEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
      await insertUsers([userOne, admin]);
    });

    afterEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
    });

    test('should return 200 Ok if Update data user By Id is successfully', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(admin);

      const res = await request(app)
        .put(`/api/users/${userOne.id}`)
        .send(newUser)
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.OK);

      const userData = res.body.data;

      expect(userData).toEqual({
        id: expect.anything(),
        name: newUser.name,
        password: expect.anything(),
        email: newUser.email,
        role: newUser.role,
        isEmailVerified: false,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });

      const dbUser = await prisma.user.findUnique({
        where: { id: userData.id },
      });

      expect(dbUser).toBeDefined();
      expect(dbUser).toMatchObject({
        id: expect.anything(),
        name: newUser.name,
        password: expect.anything(),
        email: newUser.email,
        role: newUser.role,
        isEmailVerified: false,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });
    });

    test('should return 400 Bad Request if format Email is invalid', async () => {
      newUser.email = 'brongz@yahoo';
      const validAccessToken = await tokenService.generateAuthTokens(admin);
      await request(app)
        .put(`/api/users/${userOne.id}`)
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .send(newUser)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 if Update User By Id is Not Found', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(admin);
      await request(app)
        .put(`/api/users/${userTwo.id}`)
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .send(newUser)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 401 Bad Request if Update not data input', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(admin);
      await request(app)
        .put(`/api/users/${userOne.id}`)
        .send()
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('DELETE /api/users/:userId', () => {
    beforeEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
      await insertUsers([userOne, admin]);
    });

    afterEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
    });

    test('should return Ok if Delete User By Id successfully', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(admin);
      const res = await request(app)
        .delete(`/api/users/${userOne.id}`)
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.OK);

      const userData = res.body.data;

      expect(userData).toEqual({
          id: expect.anything(),
          name: userOne.name,
          password: expect.anything(),
          email: userOne.email,
          role: userOne.role,
          isEmailVerified: false,
          createdAt: expect.anything(),
          updatedAt: expect.anything(),
      })

      const dbUser = await prisma.user.findUnique({
        where: { id: userData.id },
      });

      expect(dbUser).toBeNull();
    });

    test('should return 404 if Delete User By Id is Not Found', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(admin);
      await request(app)
        .delete(`/api/users/${userTwo.id}`)
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('GET /api/users/:userId/products', () => {
    beforeEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
      await insertUsers([userOne, admin]);
    });

    afterEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
    });

    test('should return 200 OK if Get Products By UserId is successfully', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(admin);

      const res = await request(app)
      .get(`/api/users/${userOne.id}/products`)
      .set('Authorization', `Bearer ${validAccessToken.access.token}`)
      .expect(httpStatus.OK)

      const userData = res.body.data;

      expect(userData).toEqual([{
        id: expect.anything(),
        name: userOne.name,
        password: expect.anything(),
        email: userOne.email,
        role: userOne.role,
        isEmailVerified: false,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
        products: expect.anything(),
      }]);
    });

    test('should return 404 if Id user is Not Found', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(admin);
      await request(app)
        .get(`/api/users/${userTwo.id}/products`)
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('GET /api/users/:userId/orders', () => {
    beforeEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
      await insertUsers([userOne, admin]);
    });

    afterEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
    });

    test('should return 200 Ok if Get Orders By UserId is successfully', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(admin);
      const res = await request(app)
      .get(`/api/users/${userOne.id}/orders`)
      .set('Authorization', `Bearer ${validAccessToken.access.token}`)
      .expect(httpStatus.OK)

      const userData = res.body.data;

      expect(userData).toEqual([{
        id: expect.anything(),
        name: userOne.name,
        password: expect.anything(),
        email: userOne.email,
        role: userOne.role,
        isEmailVerified: false,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
        orders: expect.anything(),
      }]);
    });

    test('should return 404 if Id user is Not Found', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(admin);
      await request(app)
        .get(`/api/users/${userTwo.id}/orders`)
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.NOT_FOUND);
    });
  });
});
