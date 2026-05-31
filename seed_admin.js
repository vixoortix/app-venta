const { createClient } = require('@libsql/client');
const bcrypt = require('bcryptjs');

async function main() {
  const client = createClient({ url: 'file:./dev.db' });
  
  // Check if admin already exists
  const existing = await client.execute("SELECT * FROM User WHERE role = 'ADMIN'");
  if (existing.rows.length > 0) {
    console.log("Admin ya existe.");
    return;
  }
  
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const now = new Date().toISOString();
  
  await client.execute({
    sql: "INSERT INTO User (name, email, password, role, createdAt) VALUES (?, ?, ?, ?, ?)",
    args: ["Administrador", "admin@admin.com", hashedPassword, "ADMIN", now]
  });
  
  console.log("Admin creado con éxito.");
}
main().catch(console.error);
