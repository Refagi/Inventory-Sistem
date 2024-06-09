const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const { userOne, insertUsers, admin } = require('../fixtures/user.fixture');
const { productOne, insertProducts, productTwo } = require('../fixtures/product.fixture');
const { categoryOne, insertCategorys } = require('../fixtures/category.fixture');
const prisma = require('../../prisma');
const { tokenService } = require('../../src/services');

describe.skip('Product Route', () => {
  let newProduct;
  beforeEach(async () => {
    newProduct = {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: 1000,
      quantityInStock: 20,
      categoryId: categoryOne.id,
      userId: userOne.id,
    };
  });

  describe('Authorization', () => {

    beforeEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
      await prisma.category.deleteMany();
      await prisma.product.deleteMany();
      await insertUsers([userOne]);
      await insertCategorys([categoryOne]);
      await insertProducts([productOne]);
    }, 20000);
  
    afterEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
      await prisma.category.deleteMany();
      await prisma.product.deleteMany();
    }, 20000);

    test('should return 401 unauthorized error if not access token ', async () => {
      await request(app).post('/api/products').send(newProduct).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 unauthorized error if not access token', async () => {
      const pagination = { priceExpensive: 1000, priceCheap: 10, categoryName: categoryOne.name, page: 1, size: 2 };
      await request(app).get('/api/products').query({ pagination }).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 unauthorized error if not access token', async () => {
      await request(app).get(`/api/products/${productOne.id}`).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 unauthorized error if not access token', async () => {
      await request(app).patch(`/api/products/${productOne.id}`).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 unauthorized error if not access token', async () => {
      await request(app).delete(`/api/products/${productOne.id}`).expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe('POST /api/products/', () => {
    beforeEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
      await prisma.category.deleteMany();
      await prisma.product.deleteMany();
      await insertUsers([userOne]);
      await insertCategorys([categoryOne]);
      await insertProducts([productOne]);
    }, 10000);
  
    afterEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
      await prisma.category.deleteMany();
      await prisma.product.deleteMany();
    }, 10000);

    test('should return 201 if successfully Created Product', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(userOne);

      const res = await request(app)
        .post('/api/products')
        .send(newProduct)
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.CREATED);

      const productData = res.body.data;

      expect(productData).toEqual({
        id: expect.anything(),
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.price,
        quantityInStock: newProduct.quantityInStock,
        categoryId: newProduct.categoryId,
        userId: newProduct.userId,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });

      const dbProduct = await prisma.product.findUnique({
        where: { id: productData.id },
      });

      expect(dbProduct).toBeDefined();
      expect(dbProduct).toMatchObject({
        id: expect.anything(),
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.price,
        quantityInStock: newProduct.quantityInStock,
        categoryId: newProduct.categoryId,
        userId: newProduct.userId,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });
    });

    test('should return 400 Bad Request if not data input', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(userOne);

      await request(app)
        .post('/api/products')
        .send()
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /api/products/', () => {
    beforeEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
      await prisma.category.deleteMany();
      await prisma.product.deleteMany();
      await insertUsers([userOne]);
      await insertCategorys([categoryOne]);
      await insertProducts([productOne]);
    }, 10000);
  
    afterEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
      await prisma.category.deleteMany();
      await prisma.product.deleteMany();
    }, 10000);

    test('should return 200 OK if Get Product Data is successfully', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(userOne);
      const pagination = { priceExpensive: 1000, priceCheap: 10, categoryName: categoryOne.name, page: 1, size: 2 };

      const res = await request(app)
        .get('/api/products')
        .query({ pagination })
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.OK);

      const productData = res.body.data[0];
      const productCurrentPage = res.body.currentPage;
      const productTotalData = res.body.totalData;
      const productTotalPage = res.body.totalPage;

      expect(productData).toEqual(
        {
          id: expect.anything(),
          name: productOne.name,
          description: productOne.description,
          price: productOne.price,
          quantityInStock: productOne.quantityInStock,
          categoryId: productOne.categoryId,
          category: {
            id: expect.anything(),
            name: categoryOne.name,
            createdAt: expect.anything(),
            updatedAt: expect.anything(),
          },
          userId: productOne.userId,
          createdAt: expect.anything(),
          updatedAt: expect.anything(),
        },
        {
          id: expect.anything(),
          name: categoryOne.name,
          createdAt: expect.anything(),
          updatedAt: expect.anything(),
        }
      );

      expect(productCurrentPage).toEqual(expect.any(Number));
      expect(productTotalData).toEqual(expect.any(Number));
      expect(productTotalPage).toEqual(expect.any(Number));

      const dbProduct = await prisma.product.findUnique({
        where: { id: productData.id },
      });

      expect(dbProduct).toBeDefined();
      expect(dbProduct).toMatchObject({
        id: expect.anything(),
        name: productOne.name,
        description: productOne.description,
        price: productOne.price,
        quantityInStock: productOne.quantityInStock,
        categoryId: productOne.categoryId,
        userId: productOne.userId,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });
    });

    test('shoul return 400 Bad Request if query pagination is null', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(userOne);
      await request(app)
        .get('/api/products')
        .query({ priceExpensive: null, priceCheap: null, categoryName: null, page: null, size: null })
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 Bad Request if page is grather than total page or size is greater than total data', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(userOne);
      await request(app)
        .get('/api/categories')
        .query({ priceExpensive: 1000, priceCheap: 10, categoryName: categoryOne.name, page: 1, size: 100 })
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /api/products/:productId', () => {
    beforeEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
      await prisma.category.deleteMany();
      await prisma.product.deleteMany();
      await insertUsers([userOne]);
      await insertCategorys([categoryOne]);
      await insertProducts([productOne]);
    }, 10000);
  
    afterEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
      await prisma.category.deleteMany();
      await prisma.product.deleteMany();
    }, 10000);

    test('should return 200 OK if Get Product By Id is successfully', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(userOne);
      const res = await request(app)
        .get(`/api/products/${productOne.id}`)
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.OK);

      const productData = res.body.data;

      expect(productData).toEqual({
        id: expect.anything(),
        name: productOne.name,
        description: productOne.description,
        price: productOne.price,
        quantityInStock: productOne.quantityInStock,
        categoryId: productOne.categoryId,
        userId: productOne.userId,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });
    });

    test('should return 404 if Get Product By Id is Not Found', async () => {
      await prisma.product.deleteMany();
      const validAccessToken = await tokenService.generateAuthTokens(userOne);

      await request(app)
        .get(`/api/products/${productTwo.id}`)
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('PATCH /api/products/:productId', () => {
    beforeEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
      await prisma.category.deleteMany();
      await prisma.product.deleteMany();
      await insertUsers([userOne]);
      await insertCategorys([categoryOne]);
      await insertProducts([productOne]);
    }, 10000);
  
    afterEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
      await prisma.category.deleteMany();
      await prisma.product.deleteMany();
    }, 10000);

    test('should return 200 OK if Update Data Product is succesfully', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(userOne);

      const res = await request(app)
        .patch(`/api/products/${productOne.id}`)
        .send(newProduct)
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.OK);

      const productData = res.body.data;

      expect(productData).toEqual({
        id: expect.anything(),
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.price,
        quantityInStock: newProduct.quantityInStock,
        categoryId: newProduct.categoryId,
        userId: newProduct.userId,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });

      const dbProduct = await prisma.product.findUnique({
        where: { id: productData.id },
      });

      expect(dbProduct).toBeDefined();
      expect(dbProduct).toMatchObject({
        id: expect.anything(),
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.price,
        quantityInStock: newProduct.quantityInStock,
        categoryId: newProduct.categoryId,
        userId: newProduct.userId,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });
    });

    test('should return 404 if Update Product By Id is Not Found', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(userOne);
      await request(app)
        .patch(`/api/products/${productTwo.id}`)
        .send(newProduct)
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 401 Bad Request if Update not data input', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(userOne);
      await request(app)
        .patch(`/api/products/${productOne.id}`)
        .send()
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('DELETE /api/products/:productId', () => {
    beforeEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
      await prisma.category.deleteMany();
      await prisma.product.deleteMany();
      await insertUsers([userOne]);
      await insertCategorys([categoryOne]);
      await insertProducts([productOne]);
    }, 10000);
  
    afterEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
      await prisma.category.deleteMany();
      await prisma.product.deleteMany();
    }, 10000);

    test('should return 200 OK if Delete Product By Id is successfully', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(userOne);

      const res = await request(app)
      .delete(`/api/products/${productOne.id}`)
      .set('Authorization', `Bearer ${validAccessToken.access.token}`)
      .expect(httpStatus.OK)

      const productData = res.body.data;

      expect(productData).toEqual({
        id: expect.anything(),
        name: productOne.name,
        description: productOne.description,
        price: productOne.price,
        quantityInStock: productOne.quantityInStock,
        categoryId: productOne.categoryId,
        userId: productOne.userId,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      })

      const dbProduct = await prisma.product.findUnique({
        where: {id: productData.id}
      });

      expect(dbProduct).toBeNull()
    });

    test('should return 404 if Delete Product By Id is Not Found', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(userOne);
      await request(app)
        .delete(`/api/products/${productTwo.id}`)
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.NOT_FOUND);
    });
  });
});
