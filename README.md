# Backend-Server-API: Inventory System

### A backend API server app for managing products, categories, orders, roles, tokens, and user authentication

## Table of Contents

- [Technologies](#technologies)
- [General Info](#general-info)
- [API Endpoints](#api-endpoints)
- [Request API](#request-api)
- [Response API](#response-api)

## Technologies

### This project was created with several Node.js libraries:

**1. Backend**

- [Node.js](https://nodejs.org/en): JavaScript runtime for server-side programming.
- [Express.js](https://expressjs.com/): Web framework for building APIs.
- [Prisma](https://www.prisma.io/): ORM for database management.
- [PM2](https://pm2.keymetrics.io/): Process manager for Node.js applications.
- [Jest](https://jestjs.io/docs/getting-started): Testing framework for JavaScript.
- [Supertest](https://www.npmjs.com/package/supertest): Library for testing HTTP applications.
- [Passport](https://www.passportjs.org/packages/passport-jwt/): Middleware for authentication.
- [JWT](https://jwt.io/): JSON Web Tokens for authentication.
- [Bcryptjs](https://www.npmjs.com/package/bcrypt): Library for password hashing.

**2. Middleware and Security**

- [Helmet](https://helmetjs.github.io/): Adds security headers to Express app.
- [CORS](https://www.npmjs.com/package/cors): Middleware to enable CORS.
- [Compression](https://www.npmjs.com/package/compression): Middleware for HTTP response compression.
- [Express-rate-limit](https://www.npmjs.com/package/express-rate-limit): Middleware for rate limiting requests.
- [XSS-Clean](https://www.npmjs.com/package/xss-clean): Middleware to sanitize input from XSS attacks.

**3. Logging**

- [Winston](https://www.npmjs.com/package/winston): Logging library.

**4. Utilities**

- [Dotenv](https://www.npmjs.com/package/dotenv): Manages environment variables.
- [Moment](https://momentjs.com/): Library for date and time manipulation.
- [UUID](https://www.uuidgenerator.net/version4): UUID generator.
- [Validator](https://www.npmjs.com/package/validator): Library for string validation.

**5. Database**

- [PostgreSQL](https://neon.tech/): SQL database.

**6. Others**

- [ESLint](https://eslint.org/): Static code analysis tool.
- [Prettier](https://prettier.io/): Code formatter.
- [Husky](https://typicode.github.io/husky/): Tool for Git hooks.
- [Nodemon](https://nodemon.io/): Tool for auto-restarting Node.js application during development.

**7. DevDependencies**

- [@faker-js/faker](https://www.npmjs.com/package/@faker-js/faker): Tool for generating fake data.
- [Coveralls](https://www.npmjs.com/package/coveralls): Code coverage reporting tool.
- [Eslint-config-airbnb-base](https://www.npmjs.com/package/eslint-config-airbnb-base): Airbnb's ESLint configuration.
- [Eslint-config-prettier](https://www.npmjs.com/package/eslint-config-prettier): Disables ESLint rules that conflict with Prettier.
- [Eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import): ESLint plugin for import rules.
- [Eslint-plugin-jest](https://www.npmjs.com/package/eslint-plugin-jest): ESLint plugin for Jest.
- [Eslint-plugin-prettier](https://www.npmjs.com/package/eslint-plugin-prettier/v/4.0.0): Runs Prettier as an ESLint rule.
- [Eslint-plugin-security](https://www.npmjs.com/package/eslint-plugin-security): ESLint plugin for security issues.
- [Node-mocks-http](https://www.npmjs.com/package/node-mocks-http): Tool to mock HTTP requests and responses.

## NPM Scripts

### Available scripts for this project:

- `start`: Runs the application with PM2.
- `dev`: Runs the application in development mode with Nodemon.
- `lint`: Runs ESLint to check code.
- `lint:fix`: Runs ESLint to fix code issues.
- `prettier`: Checks code formatting with Prettier.
- `prettier:fix`: Fixes code formatting with Prettier.
- `prepare`: Runs Husky preparation script.
- `test`: Runs tests with Jest.
- `test:watch`: Runs tests in watch mode with Jest.
- `coverage`: Runs tests and generates coverage report.
- `coverage:coveralls`: Sends coverage report to Coveralls.

## General Info

### This project has several features available:

**1. Product Management**

**- Add Product**: Users can add new products to the inventory.
**- View All Products**: Users can see a list of all products in the inventory.
**- View Products per User**: Users can see the list of products they have.
**- Product Details**: Users can see product details including description, price, and stock availability.
**- Edit Product**: Users can change existing product information.
**- Remove Product**: Users can remove products from the inventory.

**2. Category Management**

**- Add Category**: Users can create new categories to group products.
**- View All Categories**: Users can view a list of all existing categories.
**- Edit Category**: Users can change the name of the category.
**- Remove Categories**: Users can remove categories, and products associated with those categories should be managed or removed.

**3. Order Management**

**- Create an Order**: Users can place an order by selecting a product, specifying a quantity, and filling in customer information.
**- View All Orders**: Users can view a list of all orders that have been made.
**- View Orders per User**: Users can see orders they have placed.
**- Order Details**: Users can view order details including purchased products, quantities, total prices, order dates, and customer details.
**- Delete Orders**: Users can delete orders that have been completed or cancelled.

**4. User Token Management and Authentication**

**- User Registration**: Users can register and create accounts by filling in basic information.
**- Login Users**: Users can log in to their account using email and password.
**- User Authentication**: Users will be authenticated through tokens when using an API that requires authentication.
**- Token Refresh**: Users can refresh their tokens to keep their sessions active.
**- Logout User**: Users can log out from their account.

**5. Role Management**
There are several types of roles in this project:

**- User**: This role can only use the product management feature (users with this role cannot use the Order API).
**- Admin**: The Admin role can access all features.

## API Endpoints

**1. User API**

- Create User: `POST /api/users`
- Get All Users: `GET /api/users?role=?&page=?&size=?`
- Get User by Email: `GET /api/users/email/:email`
- Get User by ID: `GET /api/users/:userId`
- Update User: `PUT /api/users/:userId`
- Delete User: `DELETE /api/users/:userId`

**Auth API (For authentication purposes)**

- User Login: `POST /api/auth/login`
- User Logout: `PATCH /api/auth/logout`
- User Register: `POST /api/auth/register`
- User Refresh Token: `POST /api/auth/refresh`

**Product API**

- Create Product: `POST /api/products`
- Get All Products: `GET /api/products?priceExpensive=?&priceCheap=?&categoryName=?&page=?&size=?`
- Get Product by ID: `GET /api/products/:productId`
- Update Product: `PATCH /api/products/:productId`
- Delete Product: `DELETE /api/products/:productId`
- Get Products by User: `GET /api/users/:userId/products`

**Category API**

- Create Category: `POST /api/categories`
- Get All Categories: `GET /api/categories?category=?&page=?&size=?`
- Get Category by ID: `GET /api/categories/:categoryId`
- Update Category: `PATCH /api/categories/:categoryId`
- Delete Category: `DELETE /api/categories/:categoryId`

**Order API**

- Create Order: `POST /api/orders`
- Get All Orders: `GET /api/orders?customerName=?&page=?&size=?`
- Get Order by ID: `GET /api/orders/:orderId`
- Update Order: `PUT /api/orders/:orderId`
- Delete Order: `DELETE /api/orders/:orderId`
- Get Orders by User: `GET /api/users/:userId/orders`

**OrderItem API**

- Create OrderItem: `POST /api/order-items`
- Get All OrderItems: `GET /api/order-items?quantityLarge=?&quantitySmall=?&page=?&size=?`
- Get OrderItem by ID: `GET /api/order-items/:orderItemId`
- Update OrderItem: `PUT /api/order-items/:orderItemId`
- Delete OrderItem: `DELETE /api/order-items/:orderItem`
- Get OrderItem by Order: `GET /api/orders/:orderId/order-items`


## Request API

### User Authentication Api

**- Register**: `POST /api/auth/register`

```json
"body": {
  "email": "string (required, valid email format with .com TLD)",
  "password": "string, number (required, custom password validation)",
  "name": "string (required)",
  "role": "string (required, user, admin)"
}
```

**- Login**: `POST /api/auth/login`

```json
"body": {
  "email": "string (required, valid email format with .com TLD)",
  "password": "string, number (required)"
}
```

**- Logout**: `PATCH /api/auth/logout`

```json
"body": {
  "email": "string (required, valid email format with .com TLD)"
}
```

**- Refresh Token**: `POST /api/auth/refresh`

```json
"body": {
  "refreshToken": "string (required)"
}
```

### User Request Api

**- Create User**: `POST /api/users`

```json
"body": {
  "email": "string (required, valid email format with .com TLD)",
  "password": "string, number (required, custom password validation)",
  "name": "string (required)",
  "role": "string (required)"
}
```

**- Get All Users**: `GET /api/users?role=?&page=?&size=?`

```json
"params": {
  "role": "string (required)",
  "page": "number (reuired)",
  "size": "number (required)"
}
```

**- Get User by Email**: `GET /api/users/email/:email`

```json
"params": {
  "email": "string (required, valid email format with .com TLD)"
}
```

**- Get User by ID**: `GET /api/users/:userId`

```json
"params": {
      "userId": "string (required)"
    }
```

**- Update User**: `PUT /api/users/:userId`

```json
"params": {
      "userId": "string (required)"
    },
"body": {
      "name": "string",
      "email": "string, email",
      "password": "string, number",
      "role": "string"
   }
```

**- Delete User**: `DELETE /api/users/:userId`

```json
"params": {
      "userId": "string (required)"
    }
```

### Product Request Api

**- Create Product**: `POST /api/products`

```json
"body": {
      "name": "string (required)",
      "description": "string (required)",
      "price": "number, positive (required)",
      "quantityInStock": "number (required)",
      "categoryId": "string (required)",
      "userId": "string (required)"
    }
```

**- Get All Products**: `GET /api/products?priceExpensive=?&priceCheap=?&categoryName=?&page=?&size=?`

```json
"params": {
  "priceExpensive": "number (required)",
  "priceCheap": "number (required)",
  "categoryName": "string (required)",
  "page": "number (required)",
  "size": "number (required)"
}
```

**- Get Product by ID**: `GET /api/products/:productId`

```json
"params": {
      "productId": "string (required)"
    }
```

**- Update Product by ID**: `PATCH /api/products/:productId`

```json
"params": {
      "productId": "string (required)"
    }
"body": {
      "name": "string ",
      "description": "string ",
      "price": "number, positive ",
      "quantityInStock": "number ",
      "categoryId": "string (required)",
      "userId": "string (required)"
    }
```

**- Delete Product**: `DELETE /api/products/:productId`

```json
"params": {
      "productId": "string (required)"
    }
```

**- Get Products by User**: `GET /api/users/:userId/products`

```json
"params": {
      "userId": "string (required)"
    }
```

### Category Request Api

**- Create Category**: `POST /api/categories`

```json
 "body": {
      "name": "string (required)"
    }
```

**- Get All Categories**: `GET /api/categories?category=?&page=?&size=?`

```json
"params": {
      "category": "string (required)",
      "page": "number (required)",
      "size": "number (required)"
    }
```

**- Get Category by ID**: `GET /api/categories/:categoryId`
```json
"params": {
      "categoryId": "string (required)"
    }
```

**- Update Category**: `PATCH /api/categories/:categoryId`
```json
"params": {
      "categoryId": "string (required)"
    },
"body": {
      "name": "string"
    }
```

**- Delete Category**: `DELETE /api/categories/:categoryId`
```json
"params": {
      "categoryId": "string (required)"
    }
```

### Order Request Api

**- Create Order**: `POST /api/orders`
```json
"body": {
      "date": "date (required, ISO format: YYYY-MM-DD)",
      "customerName": "string (required)",
      "customerEmail": "string (required, email)",
      "userId": "string (required)"
    }
```

**- Get All Orders**: `GET /api/orders?customerName=?&page=?&size=?`
```json
"params": {
     "customerName": "string (required)",
     "page": "number (required)",
     "size": "number (required)"
}
```

**- Get Order by ID**: `GET /api/orders/:orderId`
```json
"params": {
      "orderId": "string (required)"
    }
```

**- Update Order**: `PUT /api/orders/:orderId`
```json
"params": {
      "orderId": "string (required)"
    },
"body": {
      "date": "date (required, ISO format: YYYY-MM-DD)",
      "totalPrice": "number (positive)",
      "customerName": "string (required)",
      "customerEmail": "string (required, email)",
      "userId": "string (required)"
    }
```

**- Delete Order**: `DELETE /api/orders/:orderId`
```json
"params": {
      "orderId": "string (required)"
    }
```

**- Get Orders by User**: `GET /api/users/:userId/orders`
```json
 "params": {
      "userId": "string (required)"
    }
```

### OrderItem Request Api

**- Create OrderItem**: `POST /api/order-items`
```json
"body": {
      "orderId": "string (required)",
      "productId": "string (required)",
      "quantity": "number (positive, required)",
      "unitPrice": "number (positive, required)"
    }
```

**- Get All OrderItems**: `GET /api/order-items?quantityLarge=?&quantitySmall=?&page=?&size=?`
```json
"params": {
  "quantityLarge": "number (required)",
  "quantitySmall": "number (requires)",
  "page": "number (required)",
  "size": "number (required)"
}
```

**- Get OrderItem by ID**: `GET /api/order-items/:orderItemId`
```json
"params": {
      "orderItemId": "string (required)"
    }
```

**- Update OrderItem**: `PUT /api/order-items/:orderItemId`
```json
 "params": {
      "orderItemId": "string (required)"
    },
"body": {
      "orderId": "string (required)",
      "productId": "string (required)",
      "quantity": "number (positive, required)",
      "unitPrice": "number (positive, required)"
    }
```

**- Delete OrderItem**: `DELETE /api/order-items/:orderItem`
```json
"params": {
      "orderItemId": "string (required)"
    }
```

**- Get OrderItem by Order**: `GET /api/orders/:orderId/order-items`
```json
 "params": {
      "orderId": "string (required)"
    }
```


## Response API

### User Authentication Response Api

**- Register**: `POST /api/auth/register`

```json
{
    "userCreated": {
        "id": "b6f8c5f3-b4f1-424c-927e-30c26fdb2583",
        "name": "josephr",
        "email": "josephr@gmail.com",
        "password": "$2a$08$R2gowsJ5yPcD.UAUrPjUnOS.xUei.RWn3Hjsj/M7MoEjJqPYC.igm",
        "role": "user",
        "createdAt": "2024-06-08T16:50:04.464Z",
        "updatedAt": "2024-06-08T16:50:04.464Z",
        "isEmailVerified": false
    },
    "tokens": {
        "access": {
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiNmY4YzVmMy1iNGYxLTQyNGMtOTI3ZS0zMGMyNmZkYjI1ODMiLCJpYXQiOjE3MTc4NjU0MDUsImV4cCI6MTcxNzg2NzIwNSwidHlwZSI6ImFjY2VzcyJ9.qFopNggPlaWztoAvOO8R_whBEizcbwXZH46GtAmA1eI",
            "expires": "2024-06-08T17:20:05.079Z"
        },
        "refresh": {
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiNmY4YzVmMy1iNGYxLTQyNGMtOTI3ZS0zMGMyNmZkYjI1ODMiLCJpYXQiOjE3MTc4NjU0MDUsImV4cCI6MTcyMDQ1NzQwNSwidHlwZSI6InJlZnJlc2gifQ.wzbsUjQLxnDJ0pFXtPRPCqPCjDq21ggkh78wXodjs08",
            "expires": "2024-07-08T16:50:05.089Z"
        }
    }
}
```

**- Login**: `POST /api/auth/login`

```json
{
    "user": {
        "id": "b6f8c5f3-b4f1-424c-927e-30c26fdb2583",
        "name": "josephr",
        "email": "josephr@gmail.com",
        "password": "$2a$08$R2gowsJ5yPcD.UAUrPjUnOS.xUei.RWn3Hjsj/M7MoEjJqPYC.igm",
        "role": "user",
        "createdAt": "2024-06-08T16:50:04.464Z",
        "updatedAt": "2024-06-08T16:50:04.464Z",
        "isEmailVerified": false
    },
    "tokens": {
        "access": {
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiNmY4YzVmMy1iNGYxLTQyNGMtOTI3ZS0zMGMyNmZkYjI1ODMiLCJpYXQiOjE3MTc4NjU0OTEsImV4cCI6MTcxNzg2NzI5MSwidHlwZSI6ImFjY2VzcyJ9.jqCozTFFe7sz6CipofOoH3t4Sc5B0fQYFUj7llRy1ok",
            "expires": "2024-06-08T17:21:31.697Z"
        },
        "refresh": {
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiNmY4YzVmMy1iNGYxLTQyNGMtOTI3ZS0zMGMyNmZkYjI1ODMiLCJpYXQiOjE3MTc4NjU0OTEsImV4cCI6MTcyMDQ1NzQ5MSwidHlwZSI6InJlZnJlc2gifQ.mT6GBJ7jOKfrofUd-CXUDDch4uV2JotD-YTnObPmMec",
            "expires": "2024-07-08T16:51:31.699Z"
        }
    }
}
```

**- Logout**: `PATCH /api/auth/logout`

```json
{
    "user": {
        "id": "b6f8c5f3-b4f1-424c-927e-30c26fdb2583",
        "name": "josephr",
        "email": "josephr@gmail.com",
        "password": "$2a$08$R2gowsJ5yPcD.UAUrPjUnOS.xUei.RWn3Hjsj/M7MoEjJqPYC.igm",
        "role": "user",
        "createdAt": "2024-06-08T16:50:04.464Z",
        "updatedAt": "2024-06-08T16:50:04.464Z",
        "isEmailVerified": false
    }
}
```

**- Refresh Token**: `POST /api/auth/refresh`

```json
{
    "refresh": {
        "access": {
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiNmY4YzVmMy1iNGYxLTQyNGMtOTI3ZS0zMGMyNmZkYjI1ODMiLCJpYXQiOjE3MTc4NjU5NTgsImV4cCI6MTcxNzg2NjAxOCwidHlwZSI6ImFjY2VzcyJ9.Ujy8GUsp3uvuD7AfNU0J0agAo272tHl80nnJMOFBA1k",
            "expires": "2024-06-08T17:00:18.075Z"
        },
        "refresh": {
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiNmY4YzVmMy1iNGYxLTQyNGMtOTI3ZS0zMGMyNmZkYjI1ODMiLCJpYXQiOjE3MTc4NjU5NTgsImV4cCI6MTcyMDQ1Nzk1OCwidHlwZSI6InJlZnJlc2gifQ.pIeJaE8S2MUdtlXsOLhGVWmeLadk5YT4oQu0vRTw-mg",
            "expires": "2024-07-08T16:59:18.080Z"
        }
    }
}
```

### User Response Api

**- Create User**: `POST /api/users`

```json
{
    "status": 201,
    "message": "Create User Success",
    "data": {
        "id": "7b4a0e56-fd07-4b14-a5fe-8d7fc814d8f7",
        "name": "jojokus",
        "email": "jojokus@gmail.com",
        "password": "$2a$08$8n0ygpwcAILiD4w4CXtz...dWU.Biq/JWMAQNAVwgtXl4nYrjYDRa",
        "role": "user",
        "createdAt": "2024-06-08T17:19:30.895Z",
        "updatedAt": "2024-06-08T17:19:30.895Z",
        "isEmailVerified": false
    }
}
```

**- Get All Users**: `GET /api/users?role=?&page=?&size=?`

```json
{
    "status": 200,
    "message": "Get All User Success",
    "currentPage": 1,
    "totalData": 3,
    "totalPage": 2,
    "data": [
        {
            "id": "0cdda584-3b2f-4c9e-a765-15f1fc8984cf",
            "name": "basukijahja",
            "email": "basuki@gmail.com",
            "password": "$2a$08$hcbGu1CmpkdGl3TV24KGiuiO7JdzBWHZY5IoKNRbGbkuuO.UnZqSy",
            "role": "user",
            "createdAt": "2024-06-09T02:05:55.583Z",
            "updatedAt": "2024-06-09T02:05:55.583Z",
            "isEmailVerified": false
        },
        {
            "id": "09681af9-c5ae-4e50-a55e-ebe088ba9591",
            "name": "budiKazhz",
            "email": "budi@gmail.com",
            "password": "$2a$08$nwPphXVfYc5K8CAgPEuuWeavPRxG11Qcg0uMMbk08yf3QS0pJAx5.",
            "role": "user",
            "createdAt": "2024-06-09T02:06:41.416Z",
            "updatedAt": "2024-06-09T02:06:41.416Z",
            "isEmailVerified": false
        }
    ]
}
```

**- Get User by Email**: `GET /api/users/email/:email`

```json
{
    "status": 200,
    "message": "Get User By Email Success",
    "data": {
        "id": "0cdda584-3b2f-4c9e-a765-15f1fc8984cf",
        "name": "basukijahja",
        "email": "basuki@gmail.com",
        "password": "$2a$08$hcbGu1CmpkdGl3TV24KGiuiO7JdzBWHZY5IoKNRbGbkuuO.UnZqSy",
        "role": "user",
        "createdAt": "2024-06-09T02:05:55.583Z",
        "updatedAt": "2024-06-09T02:05:55.583Z",
        "isEmailVerified": false
    }
}
```

**- Get User by ID**: `GET /api/users/:userId`

```json
{
    "status": 200,
    "message": "Get User By id Success",
    "data": {
        "id": "09681af9-c5ae-4e50-a55e-ebe088ba9591",
        "name": "budiKazhz",
        "email": "budi@gmail.com",
        "password": "$2a$08$nwPphXVfYc5K8CAgPEuuWeavPRxG11Qcg0uMMbk08yf3QS0pJAx5.",
        "role": "user",
        "createdAt": "2024-06-09T02:06:41.416Z",
        "updatedAt": "2024-06-09T02:06:41.416Z",
        "isEmailVerified": false
    }
}
```

**- Update User**: `PUT /api/users/:userId`

```json
{
    "status": 200,
    "message": "Update User By id Success",
    "data": {
        "id": "09681af9-c5ae-4e50-a55e-ebe088ba9591",
        "name": "budiono",
        "email": "budiono@gmail.com",
        "password": "budiono377",
        "role": "user",
        "createdAt": "2024-06-09T02:06:41.416Z",
        "updatedAt": "2024-06-09T02:11:11.583Z",
        "isEmailVerified": false
    }
}
```

**- Delete User**: `DELETE /api/users/:userId`

```json
{
    "status": 200,
    "message": "Delete User By id Success",
    "data": {
        "id": "09681af9-c5ae-4e50-a55e-ebe088ba9591",
        "name": "budiono",
        "email": "budiono@gmail.com",
        "password": "budiono377",
        "role": "user",
        "createdAt": "2024-06-09T02:06:41.416Z",
        "updatedAt": "2024-06-09T02:11:11.583Z",
        "isEmailVerified": false
    }
}
```

### Product Response Api

**- Create Product**: `POST /api/products`

```json
{
    "status": 201,
    "message": "Create Product Success",
    "data": {
        "id": "de94db1f-84bb-4091-a1b0-b34fe3ae5e31",
        "name": "lenovo thinkpad",
        "description": "laptop gaming is powerfull performance",
        "price": 11000000,
        "quantityInStock": 5,
        "categoryId": "65bc532a-9237-4c2c-93e2-bbf78c3f9e6a",
        "userId": "0cdda584-3b2f-4c9e-a765-15f1fc8984cf",
        "createdAt": "2024-06-09T02:16:08.011Z",
        "updatedAt": "2024-06-09T02:16:08.011Z"
    }
}
```

**- Get All Products**: `GET /api/products?priceExpensive=?&priceCheap=?&categoryName=?&page=?&size=?`

```json
{
    "status": 200,
    "message": "Get Products Success",
    "currentPage": 1,
    "totalData": 5,
    "totalPage": 3,
    "data": [
        {
            "id": "de94db1f-84bb-4091-a1b0-b34fe3ae5e31",
            "name": "lenovo thinkpad",
            "description": "laptop gaming is powerfull performance",
            "price": 11000000,
            "quantityInStock": 5,
            "categoryId": "65bc532a-9237-4c2c-93e2-bbf78c3f9e6a",
            "userId": "0cdda584-3b2f-4c9e-a765-15f1fc8984cf",
            "createdAt": "2024-06-09T02:16:08.011Z",
            "updatedAt": "2024-06-09T02:16:08.011Z",
            "category": {
                "id": "65bc532a-9237-4c2c-93e2-bbf78c3f9e6a",
                "name": "computer",
                "createdAt": "2024-06-09T02:15:35.433Z",
                "updatedAt": "2024-06-09T02:15:35.433Z"
            }
        },
        {
            "id": "e84abf41-e64c-4926-9c62-137de4d9721b",
            "name": "lenovo ideapad",
            "description": "laptop recomended for work",
            "price": 10000000,
            "quantityInStock": 5,
            "categoryId": "772e37df-ce97-4661-8b8c-a86c70d1dd26",
            "userId": "0cdda584-3b2f-4c9e-a765-15f1fc8984cf",
            "createdAt": "2024-06-09T03:09:46.844Z",
            "updatedAt": "2024-06-09T03:09:46.844Z",
            "category": {
                "id": "772e37df-ce97-4661-8b8c-a86c70d1dd26",
                "name": "bolpoint",
                "createdAt": "2024-06-09T02:21:56.208Z",
                "updatedAt": "2024-06-09T02:21:56.208Z"
            }
        }
    ]
}
```

**- Get Product by ID**: `GET /api/products/:productId`

```json
{
    "status": 200,
    "message": "Get Product By Id Success",
    "data": {
        "id": "de94db1f-84bb-4091-a1b0-b34fe3ae5e31",
        "name": "lenovo thinkpad",
        "description": "laptop gaming is powerfull performance",
        "price": 11000000,
        "quantityInStock": 5,
        "categoryId": "65bc532a-9237-4c2c-93e2-bbf78c3f9e6a",
        "userId": "0cdda584-3b2f-4c9e-a765-15f1fc8984cf",
        "createdAt": "2024-06-09T02:16:08.011Z",
        "updatedAt": "2024-06-09T02:16:08.011Z"
    }
}
```

**- Update Product by ID**: `PATCH /api/products/:productId`

```json
{
    "status": 200,
    "message": "Update Product By Id Success",
    "data": {
        "id": "de94db1f-84bb-4091-a1b0-b34fe3ae5e31",
        "name": "lenovo thinkpad",
        "description": "laptop gaming is powerfull performance",
        "price": 9000000,
        "quantityInStock": 6,
        "categoryId": "65bc532a-9237-4c2c-93e2-bbf78c3f9e6a",
        "userId": "0cdda584-3b2f-4c9e-a765-15f1fc8984cf",
        "createdAt": "2024-06-09T02:16:08.011Z",
        "updatedAt": "2024-06-09T03:13:50.473Z"
    }
}
```

**- Delete Product**: `DELETE /api/products/:productId`

```json
{
    "status": 200,
    "message": "Delete Products Success",
    "data": {
        "id": "b2316ac2-4f30-4a14-aa9b-b6f3962cc551",
        "name": "asus vivo book",
        "description": "laptop gaming is powerfull performance",
        "price": 13000000,
        "quantityInStock": 5,
        "categoryId": "65bc532a-9237-4c2c-93e2-bbf78c3f9e6a",
        "userId": "0cdda584-3b2f-4c9e-a765-15f1fc8984cf",
        "createdAt": "2024-06-09T02:17:14.510Z",
        "updatedAt": "2024-06-09T02:17:14.510Z"
    }
}
```

**- Get Products by User**: `GET /api/users/:userId/products`

```json
{
    "status": 200,
    "message": "Get Product By User Success",
    "data": [
        {
            "id": "0cdda584-3b2f-4c9e-a765-15f1fc8984cf",
            "name": "basukijahja",
            "email": "basuki@gmail.com",
            "password": "$2a$08$hcbGu1CmpkdGl3TV24KGiuiO7JdzBWHZY5IoKNRbGbkuuO.UnZqSy",
            "role": "user",
            "createdAt": "2024-06-09T02:05:55.583Z",
            "updatedAt": "2024-06-09T02:05:55.583Z",
            "isEmailVerified": false,
            "products": [
                {
                    "id": "e84abf41-e64c-4926-9c62-137de4d9721b",
                    "name": "lenovo ideapad",
                    "description": "laptop recomended for work",
                    "price": 10000000,
                    "quantityInStock": 5,
                    "categoryId": "772e37df-ce97-4661-8b8c-a86c70d1dd26",
                    "userId": "0cdda584-3b2f-4c9e-a765-15f1fc8984cf",
                    "createdAt": "2024-06-09T03:09:46.844Z",
                    "updatedAt": "2024-06-09T03:09:46.844Z"
                },
                {
                    "id": "de94db1f-84bb-4091-a1b0-b34fe3ae5e31",
                    "name": "lenovo thinkpad",
                    "description": "laptop gaming is powerfull performance",
                    "price": 9000000,
                    "quantityInStock": 6,
                    "categoryId": "65bc532a-9237-4c2c-93e2-bbf78c3f9e6a",
                    "userId": "0cdda584-3b2f-4c9e-a765-15f1fc8984cf",
                    "createdAt": "2024-06-09T02:16:08.011Z",
                    "updatedAt": "2024-06-09T03:13:50.473Z"
                }
            ]
        }
    ]
}
```

### Category Response Api

**- Create Category**: `POST /api/categories`

```json
{
    "status": 201,
    "message": "Create Category Success",
    "data": {
        "id": "c089d244-fd1b-4075-aa04-7eac3e04f67d",
        "name": "computer jelek",
        "createdAt": "2024-06-08T16:57:16.405Z",
        "updatedAt": "2024-06-08T16:57:16.405Z"
    }
}
```

**- Get All Categories**: `GET /api/categories?category=?&page=?&size=?`

```json
{
    "status": 200,
    "message": "Get Categories Success",
    "currentPage": 1,
    "totalData": 2,
    "totalPage": 1,
    "data": [
        {
            "id": "772e37df-ce97-4661-8b8c-a86c70d1dd26",
            "name": "bolpoint",
            "createdAt": "2024-06-09T02:21:56.208Z",
            "updatedAt": "2024-06-09T02:21:56.208Z"
        },
        {
            "id": "65bc532a-9237-4c2c-93e2-bbf78c3f9e6a",
            "name": "computer",
            "createdAt": "2024-06-09T02:15:35.433Z",
            "updatedAt": "2024-06-09T02:15:35.433Z"
        }
    ]
}
```

**- Get Category by ID**: `GET /api/categories/:categoryId`
```json
{
    "status": 200,
    "message": "Get Category By Id Success",
    "data": {
        "id": "65bc532a-9237-4c2c-93e2-bbf78c3f9e6a",
        "name": "computer",
        "createdAt": "2024-06-09T02:15:35.433Z",
        "updatedAt": "2024-06-09T02:15:35.433Z"
    }
}
```

**- Update Category**: `PATCH /api/categories/:categoryId`
```json
{
    "status": 200,
    "message": "Update Category Success",
    "data": {
        "id": "65bc532a-9237-4c2c-93e2-bbf78c3f9e6a",
        "name": "laptop",
        "createdAt": "2024-06-09T02:15:35.433Z",
        "updatedAt": "2024-06-09T03:27:46.981Z"
    }
}
```

**- Delete Category**: `DELETE /api/categories/:categoryId`
```json
{
    "status": 200,
    "message": "Delete Category Success",
    "data": {
        "id": "772e37df-ce97-4661-8b8c-a86c70d1dd26",
        "name": "alat tulis",
        "createdAt": "2024-06-09T02:21:56.208Z",
        "updatedAt": "2024-06-09T03:26:49.457Z"
    }
}
```

### Order Response Api

**- Create Order**: `POST /api/orders`
```json
{
    "status": 201,
    "message": "Create Order Success",
    "data": {
        "id": "d99d04f2-6806-4cc3-8334-0b0429984748",
        "date": "2024-06-08T00:00:00.000Z",
        "totalPrice": 0,
        "customerName": "basukijahja",
        "customerEmail": "basuki@gmail.com",
        "userId": "0cdda584-3b2f-4c9e-a765-15f1fc8984cf",
        "createdAt": "2024-06-09T03:44:40.237Z",
        "updatedAt": "2024-06-09T03:44:40.237Z"
    }
}
```

**- Get All Orders**: `GET /api/orders?customerName=?&page=?&size=?`
```json
{
    "status": 200,
    "message": "Get Orders Success",
    "currentPage": 1,
    "totalData": 1,
    "totalPage": 1,
    "data": [
        {
            "id": "d99d04f2-6806-4cc3-8334-0b0429984748",
            "date": "2024-06-08T00:00:00.000Z",
            "totalPrice": 18000000,
            "customerName": "basukijahja",
            "customerEmail": "basuki@gmail.com",
            "userId": "0cdda584-3b2f-4c9e-a765-15f1fc8984cf",
            "createdAt": "2024-06-09T03:44:40.237Z",
            "updatedAt": "2024-06-09T03:47:45.346Z"
        }
    ]
}
```

**- Get Order by ID**: `GET /api/orders/:orderId`
```json
{
    "status": 200,
    "message": "Get Order By Id Success",
    "data": {
        "id": "d99d04f2-6806-4cc3-8334-0b0429984748",
        "date": "2024-06-08T00:00:00.000Z",
        "totalPrice": 18000000,
        "customerName": "basukijahja",
        "customerEmail": "basuki@gmail.com",
        "userId": "0cdda584-3b2f-4c9e-a765-15f1fc8984cf",
        "createdAt": "2024-06-09T03:44:40.237Z",
        "updatedAt": "2024-06-09T03:47:45.346Z"
    }
}
```

**- Update Order**: `PUT /api/orders/:orderId`
```json
{
    "status": 200,
    "message": "Update Order By Id Success",
    "data": {
        "id": "d99d04f2-6806-4cc3-8334-0b0429984748",
        "date": "2024-05-30T00:00:00.000Z",
        "totalPrice": 18000000,
        "customerName": "basukijahja",
        "customerEmail": "basuki@gmail.com",
        "userId": "0cdda584-3b2f-4c9e-a765-15f1fc8984cf",
        "createdAt": "2024-06-09T03:44:40.237Z",
        "updatedAt": "2024-06-09T03:54:02.867Z"
    }
}
```

**- Delete Order**: `DELETE /api/orders/:orderId`
```json
{
    "status": 200,
    "message": "Delete Order By Id Success",
    "data": {
        "id": "d99d04f2-6806-4cc3-8334-0b0429984748",
        "date": "2024-05-30T00:00:00.000Z",
        "totalPrice": 18000000,
        "customerName": "basukijahja",
        "customerEmail": "basuki@gmail.com",
        "userId": "0cdda584-3b2f-4c9e-a765-15f1fc8984cf",
        "createdAt": "2024-06-09T03:44:40.237Z",
        "updatedAt": "2024-06-09T03:54:02.867Z"
    }
}
```

**- Get Orders by User**: `GET /api/users/:userId/orders`
```json
{
    "status": 200,
    "message": "Get Order By User Success",
    "data": [
        {
            "id": "0cdda584-3b2f-4c9e-a765-15f1fc8984cf",
            "name": "basukijahja",
            "email": "basuki@gmail.com",
            "password": "$2a$08$hcbGu1CmpkdGl3TV24KGiuiO7JdzBWHZY5IoKNRbGbkuuO.UnZqSy",
            "role": "user",
            "createdAt": "2024-06-09T02:05:55.583Z",
            "updatedAt": "2024-06-09T02:05:55.583Z",
            "isEmailVerified": false,
            "orders": [
                {
                    "id": "d99d04f2-6806-4cc3-8334-0b0429984748",
                    "date": "2024-05-30T00:00:00.000Z",
                    "totalPrice": 18000000,
                    "customerName": "basukijahja",
                    "customerEmail": "basuki@gmail.com",
                    "userId": "0cdda584-3b2f-4c9e-a765-15f1fc8984cf",
                    "createdAt": "2024-06-09T03:44:40.237Z",
                    "updatedAt": "2024-06-09T03:54:02.867Z"
                }
            ]
        }
    ]
}
```

### OrderItem Response Api

**- Create OrderItem**: `POST /api/order-items`
```json
{
    "status": 201,
    "message": "Create Order Item Success",
    "data": {
        "id": "114e073f-f92c-42d0-af76-cb0fc6530bbf",
        "orderId": "d99d04f2-6806-4cc3-8334-0b0429984748",
        "productId": "de94db1f-84bb-4091-a1b0-b34fe3ae5e31",
        "quantity": 2,
        "unitPrice": 9000000,
        "createdAt": "2024-06-09T03:47:45.936Z",
        "updatedAt": "2024-06-09T03:47:45.936Z"
    }
}
```

**- Get All OrderItems**: `GET /api/order-items?quantityLarge=?&quantitySmall=?&page=?&size=?`
```json
{
    "status": 200,
    "message": "Get Order Items Success",
    "currentPage": 1,
    "totalData": 1,
    "totalPage": 1,
    "data": [
        {
            "id": "61ec0f38-2e50-4fdf-a668-ad32cc215636",
            "orderId": "1f3ccded-94de-4c8c-9b8b-289e9fcde49f",
            "productId": "de94db1f-84bb-4091-a1b0-b34fe3ae5e31",
            "quantity": 2,
            "unitPrice": 9000000,
            "createdAt": "2024-06-09T03:58:06.235Z",
            "updatedAt": "2024-06-09T03:58:06.235Z"
        }
    ]
}
```

**- Get OrderItem by ID**: `GET /api/order-items/:orderItemId`
```json
{
    "status": 200,
    "message": "Get Order Item By Id Success",
    "data": {
        "id": "61ec0f38-2e50-4fdf-a668-ad32cc215636",
        "orderId": "1f3ccded-94de-4c8c-9b8b-289e9fcde49f",
        "productId": "de94db1f-84bb-4091-a1b0-b34fe3ae5e31",
        "quantity": 2,
        "unitPrice": 9000000,
        "createdAt": "2024-06-09T03:58:06.235Z",
        "updatedAt": "2024-06-09T03:58:06.235Z"
    }
}
```

**- Update OrderItem**: `PUT /api/order-items/:orderItemId`
```json
{
    "status": 200,
    "message": "Update Order Item By Id Success",
    "data": {
        "id": "61ec0f38-2e50-4fdf-a668-ad32cc215636",
        "orderId": "1f3ccded-94de-4c8c-9b8b-289e9fcde49f",
        "productId": "de94db1f-84bb-4091-a1b0-b34fe3ae5e31",
        "quantity": 1,
        "unitPrice": 9000000,
        "createdAt": "2024-06-09T03:58:06.235Z",
        "updatedAt": "2024-06-09T04:04:17.179Z"
    }
}
```

**- Delete OrderItem**: `DELETE /api/order-items/:orderItem`
```json
{
    "status": 200,
    "message": "Delete Order Item By Id Success",
    "data": {
        "id": "61ec0f38-2e50-4fdf-a668-ad32cc215636",
        "orderId": "1f3ccded-94de-4c8c-9b8b-289e9fcde49f",
        "productId": "de94db1f-84bb-4091-a1b0-b34fe3ae5e31",
        "quantity": 1,
        "unitPrice": 9000000,
        "createdAt": "2024-06-09T03:58:06.235Z",
        "updatedAt": "2024-06-09T04:04:17.179Z"
    }
}
```

**- Get OrderItem by Order**: `GET /api/orders/:orderId/order-items`
```json
{
    "status": 200,
    "message": "Get Order Item By Order Success",
    "data": [
        {
            "id": "1f3ccded-94de-4c8c-9b8b-289e9fcde49f",
            "date": "2024-06-08T00:00:00.000Z",
            "totalPrice": 18000000,
            "customerName": "basukijahja",
            "customerEmail": "basuki@gmail.com",
            "userId": "0cdda584-3b2f-4c9e-a765-15f1fc8984cf",
            "createdAt": "2024-06-09T03:57:32.008Z",
            "updatedAt": "2024-06-09T03:58:05.940Z",
            "orderItems": [
                {
                    "id": "61ec0f38-2e50-4fdf-a668-ad32cc215636",
                    "orderId": "1f3ccded-94de-4c8c-9b8b-289e9fcde49f",
                    "productId": "de94db1f-84bb-4091-a1b0-b34fe3ae5e31",
                    "quantity": 2,
                    "unitPrice": 9000000,
                    "createdAt": "2024-06-09T03:58:06.235Z",
                    "updatedAt": "2024-06-09T03:58:06.235Z"
                }
            ]
        }
    ]
}
```