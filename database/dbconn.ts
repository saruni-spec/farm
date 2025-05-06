// Create a connection to the database
import { Client } from "pg";
//
// use for local database
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});
client.connect();

// use for neon database
const neonClient = new Client({
  connectionString: process.env.NEON_URL,
});
neonClient.connect();

export default client;
export { neonClient };
