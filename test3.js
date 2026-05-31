const { PrismaClient } = require('@prisma/client');
try {
  new PrismaClient({ log: ['query'] });
  console.log("Success with log");
} catch(e) {
  console.log("Error log:", e.message);
}
