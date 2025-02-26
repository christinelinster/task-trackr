import env from "./env.js"
import pkg from "pg";

const {Pool} = pkg;


const pool = new Pool({
    connectionString: env.databaseUrl,
    ssl: {
      rejectUnauthorized: false,
    },
  });

export default pool; 