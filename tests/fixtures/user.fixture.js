const bcrypt = require('bcryptjs');
const faker = require('faker');
const prisma = require('../../prisma');
const { v4 } = require('uuid');

const password = 'password1';
const salt = bcrypt.genSaltSync(8);
const hashedPassword = bcrypt.hashSync(password, salt);

const userOne = {
  id: v4(),
  name: `${faker.name.firstName()} ${faker.name.lastName()}`,
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'user',
  isEmailVerified: false,
};

const userTwo = {
  id: v4(),
  name: `${faker.name.firstName()} ${faker.name.lastName()}`,
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'user',
  isEmailVerified: false,
};

const admin = {
  id: v4(),
  name: `${faker.name.firstName()} ${faker.name.lastName()}`,
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'admin',
  isEmailVerified: false,
};

const insertUsers = async (users) => {
  users = users.map((user) => ({ ...user, password: hashedPassword }))
  await prisma.user.createMany({
    data: users,
    skipDuplicates: true
  })
};

module.exports = {
  userOne,
  userTwo,
  admin,
  insertUsers,
};