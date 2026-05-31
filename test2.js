const { PrismaClient } = require('@prisma/client');
try {
  new PrismaClient({});
} catch(e) {
  console.log("Error empty:", e.message);
}
try {
  new PrismaClient({ adapter: null });
} catch(e) {
  console.log("Error adapter:", e.message);
}
