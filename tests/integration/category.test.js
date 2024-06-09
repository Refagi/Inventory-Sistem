const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const prisma = require('../../prisma');
const { categoryOne, categoryTwo, insertCategorys } = require('../fixtures/category.fixture');
const { userOneAccessToken } = require('../fixtures/token.fixture');
const { tokenService } = require('../../src/services');
const { userOne, insertUsers } = require('../fixtures/user.fixture');

describe.skip('Category routes', () => {
  let newCategory;
  beforeEach(async () => {
    newCategory = {
      name: faker.commerce.product(),
    };
  });

  describe('Authorization', () => {
    beforeEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
      await prisma.category.deleteMany();
      await insertUsers([userOne]);
    }, 10000);

    afterEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
      await prisma.category.deleteMany();
    }, 10000);

    test('should return 401 unauthorized error if not access token ', async () => {
      await request(app).post('/api/categories').send(newCategory).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 unauthorized error if not access token', async () => {
      const pagination = { role: categoryOne.role, page: 1, size: 2 };
      await request(app).get('/api/categories').query({ pagination }).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 unauthorized error if not access token', async () => {
      await request(app).get(`/api/categories/${categoryOne.id}`).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 unauthorized error if not access token', async () => {
      await request(app).patch(`/api/categories/${categoryOne.id}`).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 unauthorized error if not access token', async () => {
      await request(app).delete(`/api/categories/${categoryOne.id}`).expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe('POST /api/categories/', () => {
    beforeEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
      await prisma.category.deleteMany();
      await insertUsers([userOne]);
      await insertCategorys([categoryOne]);
    }, 10000);

    afterEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
      await prisma.category.deleteMany();
    }, 10000);

    test('should return 201 if successfully created category', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(userOne);

      const res = await request(app)
        .post('/api/categories')
        .send(newCategory)
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.CREATED);

      const categoryData = res.body.data;

      expect(categoryData).toEqual({
        id: expect.anything(),
        name: newCategory.name,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });

      const dbCategory = await prisma.category.findUnique({
        where: {
          id: categoryData.id,
        },
      });

      expect(dbCategory).toBeDefined();
      expect(dbCategory).toMatchObject({
        id: expect.anything(),
        name: newCategory.name,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });
    });

    test('should return 400 Bad Request if not data input', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(userOne);

      await request(app)
        .post('/api/categories')
        .send()
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /api/categories', () => {
    beforeEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
      await prisma.category.deleteMany();
      await insertUsers([userOne]);
      await insertCategorys([categoryOne]);
    }, 10000);

    afterEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
      await prisma.category.deleteMany();
    }, 10000);

    test('should return 200 OK if Get Categories Data is successfully', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(userOne);

      const res = await request(app)
        .get('/api/categories')
        .query( { name: categoryOne.name, page: 1, size: 1 })
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.OK);

      const categoryData = res.body.data[0];
      const categoryCurrentPage = res.body.currentPage;
      const categoryTotalData = res.body.totalData;
      const categoryTotalPage = res.body.totalPage;

      expect(categoryData).toEqual({
        id: expect.anything(),
        name: categoryOne.name,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });

      expect(categoryCurrentPage).toEqual(expect.any(Number));
      expect(categoryTotalData).toEqual(expect.any(Number));
      expect(categoryTotalPage).toEqual(expect.any(Number));

      const dbCategory = await prisma.category.findUnique({
        where: { id: categoryData.id },
      });

      expect(dbCategory).toBeDefined();
      expect(dbCategory).toMatchObject({
        id: expect.anything(),
        name: categoryOne.name,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });
    });

    test('shoul return 400 Bad Request if query pagination is null', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(userOne);
      await request(app)
        .get('/api/categories')
        .query({ name: null, page: null, size: null })
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 Bad Request if page is grather than total page or size is greater than total data', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(userOne);
      await request(app)
        .get('/api/categories')
        .query({ category: categoryOne.name, page: 1, size: 100 })
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /api/categories/:categoryId', () => {
    beforeEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
      await prisma.category.deleteMany();
      await insertUsers([userOne]);
      await insertCategorys([categoryOne]);
    }, 10000);

    afterEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
      await prisma.category.deleteMany();
    }, 10000);

    test('should return 200 OK if Get Category By Id is successfully', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(userOne);

      const res = await request(app)
        .get(`/api/categories/${categoryOne.id}`)
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.OK);

      const categoryData = res.body.data;

      expect(categoryData).toEqual({
        id: expect.anything(),
        name: categoryOne.name,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });
    });

    test('should return 404 if Id category is Not Found', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(userOne);
      await request(app)
        .get(`/api/categories/${categoryTwo.id}`)
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('PATCH /api/categories/:categoryId', () => {
    beforeEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
      await prisma.category.deleteMany();
      await insertUsers([userOne]);
      await insertCategorys([categoryOne]);
    }, 10000);

    afterEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
      await prisma.category.deleteMany();
    }, 10000);

    test('should return 200 OK if Update Data Category By Id is successfully', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(userOne);

      const res = await request(app)
        .patch(`/api/categories/${categoryOne.id}`)
        .send(newCategory)
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.OK);

      const categoryData = res.body.data;

      expect(categoryData).toEqual({
        id: expect.anything(),
        name: newCategory.name,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });

      const dbCategory = await prisma.category.findUnique({
        where: { id: categoryData.id },
      });

      expect(dbCategory).toBeDefined();
      expect(dbCategory).toMatchObject({
        id: expect.anything(),
        name: newCategory.name,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });
    });

    test('should return 404 if Update User By Id is Not Found', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(userOne);
      await request(app)
        .patch(`/api/cataegories/${categoryTwo.id}`)
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .send(newCategory)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 401 Bad Request if Update not data input', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(userOne);
      await request(app)
        .patch(`/api/categories/${categoryOne.id}`)
        .send()
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('DELETE /api/categories/:categoryId', () => {
    beforeEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
      await prisma.category.deleteMany();
      await insertUsers([userOne]);
      await insertCategorys([categoryOne]);
    }, 10000);

    afterEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
      await prisma.category.deleteMany();
    }, 10000);

    test('should return Ok if Delete Category By Id successfully', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(userOne);
      const res = await request(app)
        .delete(`/api/categories/${categoryOne.id}`)
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.OK);

      const categoryData = res.body.data;

      expect(categoryData).toEqual({
        id: expect.anything(),
        name: categoryOne.name,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      })

      const dbCategory = await prisma.category.findUnique({
        where: { id: categoryData.id },
      });

      expect(dbCategory).toBeNull()
    });

    test('should return 404 if Delete User By Id is Not Found', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(userOne);
      await request(app)
        .delete(`/api/categories/${categoryTwo.id}`)
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.NOT_FOUND);
    });
  });
});
