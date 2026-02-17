const app = require('./app');
const { port } = require('./config/env');
const { connectMongo, closeMongo } = require('./config/db');

async function start() {
  await connectMongo();

  const server = app.listen(port, () => {
    console.log(`MABCO server listening on http://localhost:${port}`);
  });

  const shutdown = async () => {
    console.log('Shutting down server...');
    server.close(async () => {
      await closeMongo();
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
