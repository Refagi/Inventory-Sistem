const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const { userOne, insertUsers, admin } = require('../fixtures/user.fixture');
const prisma = require('../../prisma');
const { adminAccessToken, userOneAccessToken } = require('../fixtures/token.fixture');
const { orderOne, orderTwo, insertOrders } = require('../fixtures/order.fixture');
const { tokenService } = require('../../src/services');

describe.skip('Order Route', () => {
  let newOrder;
  beforeEach(async () => {
    await insertUsers([userOne, admin]);
    newOrder = {
      date: '2024-09-11T00:00:00.000Z',
      customerName: `${faker.name.firstName()} ${faker.name.lastName()}`,
      customerEmail: faker.internet.email(),
      userId: userOne.id,
    };
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
  });

  describe('Authorization', () => {
    beforeEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
      await prisma.order.deleteMany();
      await insertUsers([userOne, admin]);
      await insertOrders([orderOne]);
    }, 10000);

    afterEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
      await prisma.order.deleteMany();
    }, 10000);

    test('should return 401 unauthorized error if role is not admin', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(userOne);
      await request(app)
        .post('/api/orders')
        .send(newOrder)
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 unauthorized error if role is not admin', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(userOne);
      const pagination = { customerName: orderOne.customerName, page: 1, size: 2 };

      await request(app)
        .get('/api/orders')
        .query({ pagination })
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 unauthorized error if role is not admin', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(userOne);
      await request(app)
        .get(`/api/orders/${orderOne.id}`)
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 unauthorized error if role is not admin', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(userOne);
      await request(app)
        .put(`/api/orders/${orderOne.id}`)
        .send(newOrder)
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 unauthorized error if role is not admin', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(userOne);
      await request(app)
        .delete(`/api/orders/${orderOne.id}`)
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 unauthorized error if not access token ', async () => {
      await request(app).post('/api/orders').send(newOrder).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 unauthorized error if not access token', async () => {
      const pagination = { customerName: orderOne.customerName, page: 1, size: 2 };
      await request(app).get('/api/orders').query({ pagination }).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 unauthorized error if not access token', async () => {
      await request(app).get(`/api/orders/${orderOne.id}`).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 unauthorized error if not access token', async () => {
      await request(app).put(`/api/orders/${orderOne.id}`).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 unauthorized error if not access token', async () => {
      await request(app).delete(`/api/orders/${orderOne.id}`).expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe('POST /api/orders/', () => {
    beforeEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
      await prisma.order.deleteMany();
      await insertUsers([userOne, admin]);
      await insertOrders([orderOne]);
    }, 10000);

    afterEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
      await prisma.order.deleteMany();
    }, 10000);

    test('should return 201 if successfully created Order', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(admin);

      const res = await request(app)
        .post('/api/orders')
        .send(newOrder)
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.CREATED);

      const orderData = res.body.data;

      expect(orderData).toEqual({
        id: expect.anything(),
        date: expect.anything(),
        totalPrice: expect.anything(),
        customerName: newOrder.customerName,
        customerEmail: newOrder.customerEmail,
        userId: newOrder.userId,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });

      const dbOrder = await prisma.order.findUnique({
        where: { id: orderData.id },
      });

      expect(dbOrder).toBeDefined();
      expect(dbOrder).toMatchObject({
        id: expect.anything(),
        date: expect.anything(),
        customerName: newOrder.customerName,
        customerEmail: newOrder.customerEmail,
        userId: newOrder.userId,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });
    });

    test('should return 400 Bad Request if not data input', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(admin);

      await request(app)
        .post('/api/orders')
        .send()
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /api/orders/', () => {
    beforeEach(async () => {
    await prisma.user.deleteMany();
    await prisma.token.deleteMany();
    await prisma.order.deleteMany();
    await insertUsers([userOne, admin]);
    await insertOrders([orderOne]);
  }, 10000);

  afterEach(async () => {
    await prisma.user.deleteMany();
    await prisma.token.deleteMany();
    await prisma.order.deleteMany();
  }, 10000);

    test('should return 200 OK if Get Orders Data is successfully', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(admin);
      const pagination = { customerName: orderOne.customerName, page: 1, size: 2 }

      const res = await request(app)
        .get('/api/orders')
        .query({ pagination })
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.OK);

      const orderData = res.body.data[0];
      const orderCurrentPage = res.body.currentPage;
      const orderTotalData = res.body.totalData;
      const orderTotalPage = res.body.totalPage;

      expect(orderData).toEqual({
        id: expect.anything(),
        date: expect.anything(),
        totalPrice: expect.anything(),
        customerName: orderOne.customerName,
        customerEmail: orderOne.customerEmail,
        userId: orderOne.userId,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });

      expect(orderCurrentPage).toEqual(expect.any(Number));
      expect(orderTotalData).toEqual(expect.any(Number));
      expect(orderTotalPage).toEqual(expect.any(Number));

      const dbOrder = await prisma.order.findUnique({
        where: {id: orderData.id}
      });

      expect(dbOrder).toBeDefined()
      expect(dbOrder).toMatchObject({
        id: expect.anything(),
        date: expect.anything(),
        totalPrice: expect.anything(),
        customerName: orderOne.customerName,
        customerEmail: orderOne.customerEmail,
        userId: orderOne.userId,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });
    });

    test('shoul return 400 Bad Request if query pagination is null', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(admin);
      await request(app)
        .get('/api/orders')
        .query({ customerName: null, page: null, size: null })
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 Bad Request if page is grather than total page or size is greater than total data', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(admin);
      await request(app)
        .get('/api/orders')
        .query({ customerName: orderOne.customerName, page: 1, size: 100 })
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /api/orders/:orderId', () => {
    beforeEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
      await prisma.order.deleteMany();
      await insertUsers([userOne, admin]);
      await insertOrders([orderOne]);
    }, 10000);
  
    afterEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
      await prisma.order.deleteMany();
    }, 10000);

    test('should return 200 OK if Get Order By Id is successfully', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(admin);

      const res = await request(app)
      .get(`/api/orders/${orderOne.id}`)
      .set('Authorization', `Bearer ${validAccessToken.access.token}`)
      .expect(httpStatus.OK)

      const orderData = res.body.data;

      expect(orderData).toEqual({
        id: expect.anything(),
        date: expect.anything(),
        totalPrice: expect.anything(),
        customerName: orderOne.customerName,
        customerEmail: orderOne.customerEmail,
        userId: orderOne.userId,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });
    });

    test('should return 404 if Get Order By Id is Not Found', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(admin);

      await request(app)
        .get(`/api/orders/${orderTwo.id}`)
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('PUT /api/orders/:orderId', () => {
    beforeEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
      await prisma.order.deleteMany();
      await insertUsers([userOne, admin]);
      await insertOrders([orderOne]);
    }, 10000);
  
    afterEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
      await prisma.order.deleteMany();
    }, 10000);

    test('should return 200 OK if Update Data Order is succesfully', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(admin);

      const res = await request(app)
      .put(`/api/orders/${orderOne.id}`)
      .send(newOrder)
      .set('Authorization', `Bearer ${validAccessToken.access.token}`)
      .expect(httpStatus.OK)

      const orderData = res.body.data;

      expect(orderData).toEqual({
        id: expect.anything(),
        date: expect.anything(),
        totalPrice: expect.anything(),
        customerName: newOrder.customerName,
        customerEmail: newOrder.customerEmail,
        userId: newOrder.userId,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });

      const dbOrder = await prisma.order.findUnique({
        where: {id: orderData.id}
      });

      expect(dbOrder).toBeDefined()
      expect(dbOrder).toMatchObject({
        id: expect.anything(),
        date: expect.anything(),
        totalPrice: expect.anything(),
        customerName: newOrder.customerName,
        customerEmail: newOrder.customerEmail,
        userId: newOrder.userId,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });
    });

    test('should return 404 if Update Order By Id is Not Found', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(admin);
      await request(app)
        .put(`/api/orders/${orderTwo.id}`)
        .send(newOrder)
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 401 Bad Request if Update not data input', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(admin);
      await request(app)
        .put(`/api/orders/${orderOne.id}`)
        .send()
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('DELETE /api/orders/:orderId', () => {
    beforeEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
      await prisma.order.deleteMany();
      await insertUsers([userOne, admin]);
      await insertOrders([orderOne]);
    }, 10000);
  
    afterEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
      await prisma.order.deleteMany();
    }, 10000);

    test('should return 200 OK if Delete Order By Id is successfully', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(admin);

      const res = await request(app)
      .delete(`/api/orders/${orderOne.id}`)
      .set('Authorization', `Bearer ${validAccessToken.access.token}`)
      .expect(httpStatus.OK)

      const orderData = res.body.data;

      expect(orderData).toEqual({
        id: expect.anything(),
        date: expect.anything(),
        totalPrice: expect.anything(),
        customerName: orderOne.customerName,
        customerEmail: orderOne.customerEmail,
        userId: orderOne.userId,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      })

      const dbOrder = await prisma.order.findUnique({
        where: {id: orderData.id}
      });

      expect(dbOrder).toBeNull()
    });

    test('should return 404 if Delete Order By Id is Not Found', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(admin);
      await request(app)
        .delete(`/api/orders/${orderTwo.id}`)
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('GET /api/orders/:orderId/order-items', () => {
    beforeEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
      await prisma.order.deleteMany();
      await insertUsers([userOne, admin]);
      await insertOrders([orderOne]);
    }, 10000);
  
    afterEach(async () => {
      await prisma.user.deleteMany();
      await prisma.token.deleteMany();
      await prisma.order.deleteMany();
    }, 10000);

    test('should return 200 OK if Get Order-items By Order Id is successfully', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(admin);

      const res = await request(app)
      .get(`/api/orders/${orderOne.id}/order-items`)
      .set('Authorization', `Bearer ${validAccessToken.access.token}`)
      .expect(httpStatus.OK)

      const userData = res.body.data;

      expect(userData).toEqual([{
        id: expect.anything(),
        date: expect.anything(),
        totalPrice: expect.anything(),
        customerName: orderOne.customerName,
        customerEmail: orderOne.customerEmail,
        userId: orderOne.userId,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
        orderItems: expect.anything(),
      }]);
    });

    test('should return 404 if Id Order is Not Found', async () => {
      const validAccessToken = await tokenService.generateAuthTokens(admin);
      await request(app)
        .get(`/api/orders/${orderTwo.id}/order-items`)
        .set('Authorization', `Bearer ${validAccessToken.access.token}`)
        .expect(httpStatus.NOT_FOUND);
    });
  })
});
