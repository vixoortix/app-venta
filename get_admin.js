const { createClient } = require('@libsql/client');

async function main() {
  const client = createClient({ url: 'file:./dev.db' });
  const result = await client.execute("SELECT id, name, email, role FROM User");
  console.log(result.rows);
}
main().catch(console.error);
