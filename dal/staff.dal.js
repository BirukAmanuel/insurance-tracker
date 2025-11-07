const { getConnection } = require("../config/db");
const oracledb = require("oracledb");

const getAllStaffInsurance = async () => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT 
         ID,
         FULL_NAME,
         EMAIL,
         LOAN_AMOUNT,
         LOAN_TYPE,
         SUM_INSURED,
         PREMIUM_AMOUNT,
         TO_CHAR(INSURED_ON, 'YYYY-MM-DD HH24:MI:SS') AS INSURED_ON,
         TO_CHAR(EXPIRED_ON, 'YYYY-MM-DD HH24:MI:SS') AS EXPIRED_ON,
         POLICY_TYPE,
         COMPANY,
         CO_BENEFICIARY,
         REMARK,
         USER_ID,
         STATUS,
         AUTHORIZER_ID,
         TO_CHAR(CREATED_AT, 'YYYY-MM-DD HH24:MI:SS') AS CREATED_AT,
         TO_CHAR(UPDATED_AT, 'YYYY-MM-DD HH24:MI:SS') AS UPDATED_AT
       FROM STAFFINSURANCE`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    console.log('getAllStaffInsurance: Rows:', result.rows);
    return result.rows;
  } catch (error) {
    console.error('getAllStaffInsurance: Error:', error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.release();
      } catch (error) {
        console.error('getAllStaffInsurance: Error releasing connection:', error);
      }
    }
  }
};

const getStaffInsuranceById = async (id) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT 
         ID,
         FULL_NAME,
         EMAIL,
         LOAN_AMOUNT,
         LOAN_TYPE,
         SUM_INSURED,
         PREMIUM_AMOUNT,
         TO_CHAR(INSURED_ON, 'YYYY-MM-DD HH24:MI:SS') AS INSURED_ON,
         TO_CHAR(EXPIRED_ON, 'YYYY-MM-DD HH24:MI:SS') AS EXPIRED_ON,
         POLICY_TYPE,
         COMPANY,
         CO_BENEFICIARY,
         REMARK,
         USER_ID,
         STATUS,
         AUTHORIZER_ID,
         TO_CHAR(CREATED_AT, 'YYYY-MM-DD HH24:MI:SS') AS CREATED_AT,
         TO_CHAR(UPDATED_AT, 'YYYY-MM-DD HH24:MI:SS') AS UPDATED_AT
       FROM STAFFINSURANCE 
       WHERE ID = :id`,
      [id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    console.log('getStaffInsuranceById: Row:', result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error('getStaffInsuranceById: Error:', error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.release();
      } catch (error) {
        console.error('getStaffInsuranceById: Error releasing connection:', error);
      }
    }
  }
};

const createStaffInsurance = async (data, userId) => {
  // Modified to accept userId as a separate parameter from auth context
  let connection;
  try {
    connection = await getConnection();
    const query = `
      INSERT INTO STAFFINSURANCE (
        FULL_NAME, EMAIL, LOAN_AMOUNT, LOAN_TYPE, SUM_INSURED, PREMIUM_AMOUNT,
        INSURED_ON, EXPIRED_ON, POLICY_TYPE, COMPANY, CO_BENEFICIARY,
        REMARK, USER_ID, STATUS, AUTHORIZER_ID
      ) VALUES (
        :FULL_NAME, :EMAIL, :LOAN_AMOUNT, :LOAN_TYPE, :SUM_INSURED, :PREMIUM_AMOUNT,
        TO_DATE(:INSURED_ON, 'YYYY-MM-DD HH24:MI:SS'),
        TO_DATE(:EXPIRED_ON, 'YYYY-MM-DD HH24:MI:SS'),
        :POLICY_TYPE, :COMPANY, :CO_BENEFICIARY,
        :REMARK, :USER_ID, :STATUS, :AUTHORIZER_ID
      )
    `;

    // Helper function to format date to YYYY-MM-DD HH24:MI:SS
    const formatDate = (date) => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const seconds = String(d.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const bindData = {
      FULL_NAME: data.FULL_NAME,
      EMAIL: data.EMAIL,
      LOAN_AMOUNT: data.LOAN_AMOUNT,
      LOAN_TYPE: data.LOAN_TYPE,
      SUM_INSURED: data.SUM_INSURED,
      PREMIUM_AMOUNT: data.PREMIUM_AMOUNT,
      INSURED_ON: formatDate(data.INSURED_ON),
      EXPIRED_ON: formatDate(data.EXPIRED_ON),
      POLICY_TYPE: data.POLICY_TYPE,
      COMPANY: data.COMPANY,
      CO_BENEFICIARY: data.CO_BENEFICIARY,
      REMARK: data.REMARK,
      USER_ID: userId, // Use authenticated userId
      STATUS: data.STATUS || 'PENDING', // Default to PENDING
      AUTHORIZER_ID: data.AUTHORIZER_ID
    };

    await connection.execute(query, bindData);
    await connection.commit();
    console.log(`Created STAFFINSURANCE record with USER_ID: ${userId}`);
  } catch (error) {
    console.error("createStaffInsurance: Error:", error);
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error("createStaffInsurance: Error rolling back:", rollbackError);
      }
    }
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.release();
      } catch (error) {
        console.error("createStaffInsurance: Error releasing connection:", error);
      }
    }
  }
};

const updateStaffInsurance = async (id, data) => {
  let connection;
  try {
    connection = await getConnection();

    // Validate input data
    const validateStaffInsuranceData = (data) => {
      const requiredFields = [
        "FULL_NAME",
        "EMAIL",
        "LOAN_AMOUNT",
        "LOAN_TYPE",
        "INSURED_ON",
        "EXPIRED_ON",
        "POLICY_TYPE",
        "COMPANY",
        "STATUS"
      ];
      for (const field of requiredFields) {
        if (data[field] === undefined || data[field] === null) {
          throw new Error(`Missing required field: ${field}`);
        }
      }
      if (isNaN(Date.parse(data.INSURED_ON)) || isNaN(Date.parse(data.EXPIRED_ON))) {
        throw new Error("Invalid date format for INSURED_ON or EXPIRED_ON");
      }
      if (data.CO_BENEFICIARY && data.CO_BENEFICIARY.length > 3) {
        throw new Error("CO_BENEFICIARY must be 3 characters or less");
      }
    };

    validateStaffInsuranceData(data);

    const query = `
      UPDATE STAFFINSURANCE SET
        FULL_NAME = :FULL_NAME,
        EMAIL = :EMAIL,
        LOAN_AMOUNT = :LOAN_AMOUNT,
        LOAN_TYPE = :LOAN_TYPE,
        SUM_INSURED = :SUM_INSURED,
        PREMIUM_AMOUNT = :PREMIUM_AMOUNT,
        INSURED_ON = TO_DATE(:INSURED_ON, 'YYYY-MM-DD HH24:MI:SS'),
        EXPIRED_ON = TO_DATE(:EXPIRED_ON, 'YYYY-MM-DD HH24:MI:SS'),
        POLICY_TYPE = :POLICY_TYPE,
        COMPANY = :COMPANY,
        CO_BENEFICIARY = :CO_BENEFICIARY,
        REMARK = :REMARK,
        USER_ID = :USER_ID,
        STATUS = :STATUS,
        AUTHORIZER_ID = :AUTHORIZER_ID
      WHERE ID = :ID
    `;

    // Helper function to format date to YYYY-MM-DD HH24:MI:SS
    const formatDate = (date) => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const seconds = String(d.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const bindData = {
      FULL_NAME: data.FULL_NAME,
      EMAIL: data.EMAIL,
      LOAN_AMOUNT: data.LOAN_AMOUNT,
      LOAN_TYPE: data.LOAN_TYPE,
      SUM_INSURED: data.SUM_INSURED || null,
      PREMIUM_AMOUNT: data.PREMIUM_AMOUNT || null,
      INSURED_ON: formatDate(data.INSURED_ON),
      EXPIRED_ON: formatDate(data.EXPIRED_ON),
      POLICY_TYPE: data.POLICY_TYPE,
      COMPANY: data.COMPANY,
      CO_BENEFICIARY: data.CO_BENEFICIARY || null,
      REMARK: data.REMARK || null,
      USER_ID: data.USER_ID || null,
      STATUS: data.STATUS,
      AUTHORIZER_ID: data.AUTHORIZER_ID || null,
      ID: id
    };

    console.log("updateStaffInsurance: bindData:", bindData);

    await connection.execute(query, bindData);
    await connection.commit();
  } catch (error) {
    console.error("updateStaffInsurance: Error:", error);
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error("updateStaffInsurance: Error rolling back:", rollbackError);
      }
    }
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.release();
      } catch (error) {
        console.error("updateStaffInsurance: Error releasing connection:", error);
      }
    }
  }
};

const updateStaffStatus = async (id, status) => {

let connection;

  try {

    connection = await getConnection();

    const query = `UPDATE STAFFINSURANCE SET STATUS = :status WHERE ID = :id`;

    await connection.execute(query, { id, status });

    await connection.commit();

  } catch (error) {

    console.error("Error in updateStaffStatus:", error);

    throw error;

  } finally {

    if (connection) await connection.release();

  }

};




const deleteStaffInsurance = async (id) => {
  let connection;
  try {
    connection = await getConnection();
    await connection.execute(`DELETE FROM STAFFINSURANCE WHERE ID = :id`, [id]);
    await connection.commit();
  } catch (error) {
    console.error("deleteStaffInsurance: Error:", error);
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error("deleteStaffInsurance: Error rolling back:", rollbackError);
      }
    }
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.release();
      } catch (error) {
        console.error("deleteStaffInsurance: Error releasing connection:", error);
      }
    }
  }
};

module.exports = {
  getAllStaffInsurance,
  getStaffInsuranceById,
  createStaffInsurance,
  updateStaffInsurance,
  deleteStaffInsurance,
  updateStaffStatus,
};