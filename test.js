const { PrismaClient } = require('@prisma/client');
try {
  console.log(Object.keys(require('@prisma/client')));
  const client = new PrismaClient({ url: "file:./dev.db" });
  console.log("url worked");
} catch(e) {
  console.log("Error:", e.message);
}
