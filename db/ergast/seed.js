const { Pool } = require("pg");
const fs = require('fs');

const tables = fs.readFileSync('db/ergast/tables.sql', 'utf8');
let data = fs.readFileSync('db/ergast/f1db.sql', 'utf8');

data = data.replace(/&amp;/g, '')
            .replace(/\b([a-zA-Z]+)\\'([a-zA-Z]+)\b/g, "$1$2")
            .replace(/`/g, '')
            .replace(/'([^']|'')*'/g, (match) => match.replace(/'/g, "''").replace(/^'|'$/g, ''));

// Function to convert camelCase to snake_case
const camelToSnake = (str) => str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

(async () => {
  const client = await pool.connect();

  try {
    await client.query(tables);

    const queries = data.split(';');

    for (let query of queries) {
      query = query.trim();
      if (query.startsWith('INSERT INTO')) {
        const tableNameMatch = query.match(/INSERT INTO (\w+)/);
        if (tableNameMatch) {
          const tableName = tableNameMatch[1];
          const snakeTableName = camelToSnake(tableName);
          query = query.replace(tableName, snakeTableName);
          console.log('Executing for table', snakeTableName);
          await client.query(query);
        }
      }
    }
  } finally {
    client.release();
    pool.end();
  }
})();
