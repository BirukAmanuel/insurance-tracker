const { getConnection } = require("../config/db");

const getUserByEmail = async (email) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT ID, EMAIL, PASSWORD, ROLES, WORK_UNIT, STATUS 
       FROM USERS 
       WHERE EMAIL = :email`,
      [email],
      { outFormat: require("oracledb").OUT_FORMAT_OBJECT }
    );
    console.log("getUserByEmail result:", result.rows[0]); // Debug
    return result.rows[0];
  } catch (err) {
    console.error("Error in getUserByEmail:", err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.release();
      } catch (err) {
        console.error("Error releasing connection:", err);
      }
    }
  }
};

const createUser = async ({ email, password, roles, work_unit }) => {
  let connection;
  try {
    connection = await getConnection();
    await connection.execute(
      `INSERT INTO USERS (EMAIL, PASSWORD, ROLES, WORK_UNIT) 
       VALUES (:email, :password, :roles, :work_unit)`,
      [email, password, roles, work_unit]
    );
    await connection.commit();
  } catch (err) {
    console.error("Error in createUser:", err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.release();
      } catch (err) {
        console.error("Error releasing connection:", err);
      }
    }
  }
};

module.exports = { getUserByEmail, createUser };