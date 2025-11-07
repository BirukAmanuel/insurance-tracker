require('dotenv').config()
const oracledb = require('oracledb');

const dbConfig = {
  // Use environment variables here
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectionString: process.env.DB_CONNECTION_STRING,
};



async function getConnection() {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    return connection;
  } catch (error) {
    console.error("❌ Error connecting to Oracle DB:", error);
    throw error;
  }
}

module.exports = { getConnection };
