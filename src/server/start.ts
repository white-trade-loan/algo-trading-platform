import { startServer } from './main.js';

startServer().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});
