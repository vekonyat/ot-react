const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "Autokolcsonzo",
  password: "123456",
  port: 5432,
});

const testConnection = async () => {
  try {
    await pool.connect();
    console.log("Connection successful!");

    // Lekérdezés a táblák neveiről
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `);

    if (result.rows.length > 0) {
      console.log("Tables in the database:");
      result.rows.forEach((row) => {
        console.log(row.table_name);
      });
    } else {
      console.log("No tables found in the database.");
    }
  } catch (err) {
    console.error("Connection error:", err);
  } finally {
    pool.end();
  }
};

testConnection();
