const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const { userOne, insertUsers, admin } = require('../fixtures/user.fixture');
const prisma = require('../../prisma');
const { adminAccessToken, userOneAccessToken } = require('../fixtures/token.fixture');
const { orderOne, insertOrders } = require('../fixtures/order.fixture');
const { orderItemOne, orderItemTwo, insertOrderItems } = require('../fixtures/order-item.fixture');
const { productOne, insertProducts } = require('../fixtures/product.fixture');
const { categoryOne, insertCategorys } = require('../fixtures/category.fixture');
const { tokenService } = require('../../src/services');

describe.skip('Order-item Route', () => {
  let newOrderItem;
  beforeEach(async () => {
    await insertUsers([userOne, admin]);
    await insertCategorys([categoryOne]);
    await insertProducts([productOne]);
    await insertOrders([orderOne]);
    await insertOrderItems([orderItemOne]);
    newOrderItem = {
      orderId: orderOne.id,
      productId: productOne.id,
      quantity: 10,
      unitPrice: 1000,
    };
  }, 20000);

  describe('Authorization', () => {
    beforeEach(async () => {
      await prisma.orderItem.deleteMany();
      await prisma.order.deleteMany();
      await prisma.product.deleteMany();
      await prisma.category.deleteMany();
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
      await insertUsers([userOne, admin]);
      await insertCategorys([categoryOne]);
      await insertProducts([productOne]);
      await insertOrders([orderOne]);
      await insertOrderItems([orderItemOne]);
    }, 20000);

    afterEach(async () => {
      await prisma.orderItem.deleteMany();
      await prisma.order.deleteMany();
      await prisma.product.deleteMany();
      await prisma.category.deleteMany();
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
    }, 20000);

    test('should return 401 unauthorized error if role is not admin', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(userOne);
      await request(app)
        .post('/api/order-items')
        .send(newOrderItem)
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 unauthorized error if role is not admin', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(userOne);
      const pagination = { quantityLarge: 5, quantitySmall: 1, page: 1, size: 2 };

      await request(app)
        .get('/api/order-items')
        .query({ pagination })
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 unauthorized error if role is not admin', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(userOne);
      await request(app)
        .get(`/api/order-items/${orderItemOne.id}`)
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 unauthorized error if role is not admin', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(userOne);
      await request(app)
        .put(`/api/order-items/${orderItemOne.id}`)
        .send(newOrderItem)
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 unauthorized error if role is not admin', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(userOne);
      await request(app)
        .delete(`/api/order-items/${orderItemOne.id}`)
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 unauthorized error if not access token ', async () => {
      await request(app).post('/api/order-items').send(newOrderItem).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 unauthorized error if not access token', async () => {
      const pagination = { quantityLarge: 5, quantitySmall: 1, page: 1, size: 2 };
      await request(app).get('/api/order-items').query({ pagination }).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 unauthorized error if not access token', async () => {
      await request(app).get(`/api/order-items/${orderItemOne.id}`).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 unauthorized error if not access token', async () => {
      await request(app).put(`/api/order-items/${orderItemOne.id}`).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 unauthorized error if not access token', async () => {
      await request(app).delete(`/api/order-items/${orderItemOne.id}`).expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe('POST /api/order-items', () => {
    beforeEach(async () => {
      await prisma.orderItem.deleteMany();
      await prisma.order.deleteMany();
      await prisma.product.deleteMany();
      await prisma.category.deleteMany();
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
      await insertUsers([userOne, admin]);
      await insertCategorys([categoryOne]);
      await insertProducts([productOne]);
      await insertOrders([orderOne]);
      await insertOrderItems([orderItemOne]);
    }, 10000);

    afterEach(async () => {
      await prisma.orderItem.deleteMany();
      await prisma.order.deleteMany();
      await prisma.product.deleteMany();
      await prisma.category.deleteMany();
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
    }, 10000);

    test('should return 201 if successfully created Order-items', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(admin);

      const res = await request(app)
        .post('/api/order-items')
        .send(newOrderItem)
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.CREATED);

      const orderItemData = res.body.data;

      expect(orderItemData).toEqual({
        id: expect.anything(),
        orderId: newOrderItem.orderId,
        productId: newOrderItem.productId,
        quantity: newOrderItem.quantity,
        unitPrice: newOrderItem.unitPrice,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });

      const dbOrderItem = await prisma.orderItem.findUnique({
        where: { id: orderItemData.id },
      });

      expect(dbOrderItem).toBeDefined();
      expect(dbOrderItem).toMatchObject({
        id: expect.anything(),
        orderId: newOrderItem.orderId,
        productId: newOrderItem.productId,
        quantity: newOrderItem.quantity,
        unitPrice: newOrderItem.unitPrice,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });
    });

    test('should return 400 Bad Request if not data input', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(admin);

      await request(app)
        .post('/api/order-items')
        .send()
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 Bad Request if quantity is grather than quantityInStock', async () => {
      newOrderItem.quantity = 21;
      const validAccessToken = await tokenService.generateAuthTokens(admin);

      await request(app)
        .post('/api/order-items')
        .send(newOrderItem)
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 Bad Request if unitPrice is not match with price', async () => {
      newOrderItem.unitPrice = 2000;
      const validAccessToken = await tokenService.generateAuthTokens(admin);

      await request(app)
        .post('/api/order-items')
        .send(newOrderItem)
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /api/order-items/', () => {
    beforeEach(async () => {
      await insertUsers([userOne, admin]);
      await insertCategorys([categoryOne]);
      await insertProducts([productOne]);
      await insertOrders([orderOne]);
      await insertOrderItems([orderItemOne]);
    }, 10000);

    afterEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
      await prisma.order.deleteMany();
      await prisma.product.deleteMany();
      await prisma.category.deleteMany();
      await prisma.orderItem.deleteMany();
    }, 10000);

    test('should return 200 OK if Get Order-items Data is successfully', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(admin);

      const res = await request(app)
        .get('/api/order-items')
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .query({ quantityLarge: orderItemOne.quantity, quantitySmall: orderItemOne.quantity, page: 1, size: 1 })
        .expect(httpStatus.OK);

      const orderItemData = res.body.data[0];
      const orderItemCurrentPage = res.body.currentPage;
      const orderItemTotalData = res.body.totalData;
      const orderItemTotalPage = res.body.totalPage;

      expect(orderItemData).toEqual({
        id: expect.anything(),
        orderId: orderItemOne.orderId,
        productId: orderItemOne.productId,
        quantity: orderItemOne.quantity,
        unitPrice: orderItemOne.unitPrice,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });

      expect(orderItemCurrentPage).toEqual(expect.any(Number));
      expect(orderItemTotalData).toEqual(expect.any(Number));
      expect(orderItemTotalPage).toEqual(expect.any(Number));

      const dbOrderItem = await prisma.orderItem.findUnique({
        where: { id: orderItemData.id },
      });

      expect(dbOrderItem).toBeDefined();
      expect(dbOrderItem).toMatchObject({
        id: expect.anything(),
        orderId: orderItemOne.orderId,
        productId: orderItemOne.productId,
        quantity: orderItemOne.quantity,
        unitPrice: orderItemOne.unitPrice,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });
    });

    test('shoul return 400 Bad Request if query pagination is null', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(admin);
      await request(app)
        .get('/api/order-items')
        .query({ quantityLarge: null, quantitySmall: null, page: null, size: null })
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 Bad Request if page is grather than total page or size is greater than total data', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(admin);
      await request(app)
        .get('/api/order-items')
        .query({ quantityLarge: 5, quantitySmall: 1, page: 1, size: 100 })
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /api/order-items/:orderItemId', () => {
    beforeEach(async () => {
      await insertUsers([userOne, admin]);
      await insertCategorys([categoryOne]);
      await insertProducts([productOne]);
      await insertOrders([orderOne]);
      await insertOrderItems([orderItemOne]);
    }, 10000);

    afterEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
      await prisma.order.deleteMany();
      await prisma.product.deleteMany();
      await prisma.category.deleteMany();
      await prisma.orderItem.deleteMany();
    }, 10000);

    test('should return 200 OK if Get Order-items By Id is successfully', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(admin);

      const res = await request(app)
      .get(`/api/order-items/${orderItemOne.id}`)
      .set('Authorization', `Bearer ${validAccessToken.access.token}`)
      .expect(httpStatus.OK)

      const orderItemData = res.body.data;

      expect(orderItemData).toEqual({
        id: expect.anything(),
        orderId: orderItemOne.orderId,
        productId: orderItemOne.productId,
        quantity: orderItemOne.quantity,
        unitPrice: orderItemOne.unitPrice,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });
    });

    test('should return 404 if Get Order-items By Id is Not Found', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(admin);

      await request(app)
        .get(`/api/order-items/${orderItemTwo.id}`)
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('PUT /api/order-items/:orderItemId', () => {
    beforeEach(async () => {
      await insertUsers([userOne, admin]);
      await insertCategorys([categoryOne]);
      await insertProducts([productOne]);
      await insertOrders([orderOne]);
      await insertOrderItems([orderItemOne]);
    }, 10000);

    afterEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
      await prisma.order.deleteMany();
      await prisma.product.deleteMany();
      await prisma.category.deleteMany();
      await prisma.orderItem.deleteMany();
    }, 10000);

    test('should return 200 OK if Update Data Order-items is succesfully', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(admin);

      const res = await request(app)
      .put(`/api/order-items/${orderItemOne.id}`)
      .send(newOrderItem)
      .set('Authorization', `Bearer ${validAccessToken.access.token}`)
      .expect(httpStatus.OK)

      const orderItemData = res.body.data;

      expect(orderItemData).toEqual({
        id: expect.anything(),
        orderId: orderItemOne.orderId,
        productId: orderItemOne.productId,
        quantity: orderItemOne.quantity,
        unitPrice: orderItemOne.unitPrice,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });

      const dbOrderItem = await prisma.orderItem.findUnique({
        where: {id: orderItemData.id}
      });

      expect(dbOrderItem).toBeDefined()
      expect(dbOrderItem).toMatchObject({
        id: expect.anything(),
        orderId: orderItemOne.orderId,
        productId: orderItemOne.productId,
        quantity: orderItemOne.quantity,
        unitPrice: orderItemOne.unitPrice,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });
    });

    test('should return 404 if Update Order-items By Id is Not Found', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(admin);
      await request(app)
        .put(`/api/order-items/${orderItemTwo.id}`)
        .send(newOrderItem)
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 401 Bad Request if Update not data input', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(admin);
      await request(app)
        .put(`/api/order-items/${orderItemOne.id}`)
        .send()
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('DELETE /api/order-items/:orderItemId', () => {
    beforeEach(async () => {
      await insertUsers([userOne, admin]);
      await insertCategorys([categoryOne]);
      await insertProducts([productOne]);
      await insertOrders([orderOne]);
      await insertOrderItems([orderItemOne]);
    }, 10000);

    afterEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
      await prisma.order.deleteMany();
      await prisma.product.deleteMany();
      await prisma.category.deleteMany();
      await prisma.orderItem.deleteMany();
    }, 10000);

    test('should return 200 OK if Delete Order-items By Id is successfully', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(admin);

      const res = await request(app)
      .delete(`/api/order-items/${orderItemOne.id}`)
      .set('Authorization', `Bearer ${validAccessToken.access.token}`)
      .expect(httpStatus.OK)

      const orderItemData = res.body.data;

      expect(orderItemData).toEqual({
        id: expect.anything(),
        orderId: orderItemOne.orderId,
        productId: orderItemOne.productId,
        quantity: orderItemOne.quantity,
        unitPrice: orderItemOne.unitPrice,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      })

      const dbOrderItem = await prisma.orderItem.findUnique({
        where: {id: orderItemData.id}
      });

      expect(dbOrderItem).toBeNull()
    });

    test('should return 404 if Delete Order-items By Id is Not Found', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(admin);
      await request(app)
        .delete(`/api/order-items/${orderItemTwo.id}`)
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.NOT_FOUND);
    });
  })
});
