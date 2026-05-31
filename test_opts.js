const fs = require('fs');
const content = fs.readFileSync('node_modules/@prisma/client/default.d.ts', 'utf8');
const lines = content.split('\n');
let print = false;
let printed = 0;
for (const line of lines) {
  if (line.includes('PrismaClientOptions')) print = true;
  if (print && printed < 50) {
    console.log(line);
    printed++;
  }
}
