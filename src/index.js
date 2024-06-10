/* eslint-disable prettier/prettier */
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const prisma = require('../prisma/index');

let server;

// Attempt to connect to the database and start the server
async function startServer() {
  try {
    await prisma.$connect();
    logger.info('Connected to Database');

    server = app.listen(config.port, () => {
      logger.info(`Listening to port ${config.port}`);
    });
  } catch (error) {
    logger.error('Failed to connect to the database:', error);
    process.exit(1); // Exit with an error code
  }
}

startServer();

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(0); // Exit normally
    });
  } else {
    process.exit(0); // Exit normally
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
