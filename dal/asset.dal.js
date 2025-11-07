const { getConnection } = require("../config/db");
const oracledb = require("oracledb");

const getAllAssetInsurance = async () => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT 
         ID, 
         ASSET_TYPE, 
         ESTIMATED_VALUE, 
         SUM_INSURED, 
         NET_PREMIUM, 
         TO_CHAR(INSURED_ON, 'YYYY-MM-DD HH24:MI:SS') AS INSURED_ON, 
         TO_CHAR(EXPIRED_ON, 'YYYY-MM-DD HH24:MI:SS') AS EXPIRED_ON, 
         POLICY_TYPE, 
         COMPANY, 
         CO_BENEFICIARY, 
         PLATE_NO, 
         VEHICLE_MODEL, 
         CHASSIS_NO, 
         ENGINE_NUMBER, 
         YEAR_OF_MAKE, 
         ENGINE_CAPACITY, 
         PREVIOUS_INSURED_VALUE, 
         PREMIUM_AMOUNT, 
         INSURANCE_STATUS, 
         REMARK, 
         STAFF_ID, 
         USER_ID, 
         STATUS,
         TO_CHAR(CREATED_AT, 'YYYY-MM-DD HH24:MI:SS') AS CREATED_AT,
         TO_CHAR(UPDATED_AT, 'YYYY-MM-DD HH24:MI:SS') AS UPDATED_AT
       FROM ASSETINSURANCE`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    console.log('getAllAssetInsurance: Rows:', result.rows);
    return result.rows;
  } catch (error) {
    console.error('getAllAssetInsurance: Error:', error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.release();
      } catch (error) {
        console.error('getAllAssetInsurance: Error releasing connection:', error);
      }
    }
  }
};

const getAssetInsuranceById = async (id) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT 
         ID, 
         ASSET_TYPE, 
         ESTIMATED_VALUE, 
         SUM_INSURED, 
         NET_PREMIUM, 
         TO_CHAR(INSURED_ON, 'YYYY-MM-DD HH24:MI:SS') AS INSURED_ON, 
         TO_CHAR(EXPIRED_ON, 'YYYY-MM-DD HH24:MI:SS') AS EXPIRED_ON, 
         POLICY_TYPE, 
         COMPANY, 
         CO_BENEFICIARY, 
         PLATE_NO, 
         VEHICLE_MODEL, 
         CHASSIS_NO, 
         ENGINE_NUMBER, 
         YEAR_OF_MAKE, 
         ENGINE_CAPACITY, 
         PREVIOUS_INSURED_VALUE, 
         PREMIUM_AMOUNT, 
         INSURANCE_STATUS, 
         REMARK, 
         STAFF_ID, 
         USER_ID, 
         STATUS,
         TO_CHAR(CREATED_AT, 'YYYY-MM-DD HH24:MI:SS') AS CREATED_AT,
         TO_CHAR(UPDATED_AT, 'YYYY-MM-DD HH24:MI:SS') AS UPDATED_AT
       FROM ASSETINSURANCE 
       WHERE ID = :id`,
      [id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    console.log('getAssetInsuranceById: Row:', result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error('getAssetInsuranceById: Error:', error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.release();
      } catch (error) {
        console.error('getAssetInsuranceById: Error releasing connection:', error);
      }
    }
  }
};

const createAssetInsurance = async (data, userId) => {
  // Modified to accept userId as a separate parameter from auth context
  let connection;
  try {
    connection = await getConnection();
    const query = `
      INSERT INTO ASSETINSURANCE (
        ASSET_TYPE, ESTIMATED_VALUE, SUM_INSURED, NET_PREMIUM,
        INSURED_ON, EXPIRED_ON, POLICY_TYPE, COMPANY, CO_BENEFICIARY,
        PLATE_NO, VEHICLE_MODEL, CHASSIS_NO, ENGINE_NUMBER, YEAR_OF_MAKE,
        ENGINE_CAPACITY, PREVIOUS_INSURED_VALUE, PREMIUM_AMOUNT, INSURANCE_STATUS,
        REMARK, STAFF_ID, USER_ID, STATUS
      ) VALUES (
        :ASSET_TYPE, :ESTIMATED_VALUE, :SUM_INSURED, :NET_PREMIUM,
        TO_DATE(:INSURED_ON, 'YYYY-MM-DD HH24:MI:SS'),
        TO_DATE(:EXPIRED_ON, 'YYYY-MM-DD HH24:MI:SS'),
        :POLICY_TYPE, :COMPANY, :CO_BENEFICIARY,
        :PLATE_NO, :VEHICLE_MODEL, :CHASSIS_NO, :ENGINE_NUMBER, :YEAR_OF_MAKE,
        :ENGINE_CAPACITY, :PREVIOUS_INSURED_VALUE, :PREMIUM_AMOUNT, :INSURANCE_STATUS,
        :REMARK, :STAFF_ID, :USER_ID, :STATUS
      )
    `;
    const formatDate = (date) => {
      const d = new Date(date);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
    };
    const bindData = {
      ASSET_TYPE: data.ASSET_TYPE,
      ESTIMATED_VALUE: data.ESTIMATED_VALUE,
      SUM_INSURED: data.SUM_INSURED,
      NET_PREMIUM: data.NET_PREMIUM,
      INSURED_ON: formatDate(data.INSURED_ON),
      EXPIRED_ON: formatDate(data.EXPIRED_ON),
      POLICY_TYPE: data.POLICY_TYPE,
      COMPANY: data.COMPANY,
      CO_BENEFICIARY: data.CO_BENEFICIARY,
      PLATE_NO: data.PLATE_NO,
      VEHICLE_MODEL: data.VEHICLE_MODEL,
      CHASSIS_NO: data.CHASSIS_NO,
      ENGINE_NUMBER: data.ENGINE_NUMBER,
      YEAR_OF_MAKE: data.YEAR_OF_MAKE,
      ENGINE_CAPACITY: data.ENGINE_CAPACITY,
      PREVIOUS_INSURED_VALUE: data.PREVIOUS_INSURED_VALUE,
      PREMIUM_AMOUNT: data.PREMIUM_AMOUNT,
      INSURANCE_STATUS: data.INSURANCE_STATUS,
      REMARK: data.REMARK,
      STAFF_ID: data.STAFF_ID,
      USER_ID: userId, // Use authenticated userId
      STATUS: data.STATUS || 'PENDING' // Default to PENDING
    };
    await connection.execute(query, bindData);
    await connection.commit();
    console.log(`Created ASSETINSURANCE record with USER_ID: ${userId}`);
  } catch (error) {
    console.error('createAssetInsurance: Error:', error);
    if (connection) await connection.rollback();
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.release();
      } catch (error) {
        console.error('createAssetInsurance: Error releasing connection:', error);
      }
    }
  }
};

const updateAssetInsurance = async (id, data) => {
  let connection;
  try {
    connection = await getConnection();
    const query = `
      UPDATE ASSETINSURANCE SET
        ASSET_TYPE = :ASSET_TYPE,
        ESTIMATED_VALUE = :ESTIMATED_VALUE,
        SUM_INSURED = :SUM_INSURED,
        NET_PREMIUM = :NET_PREMIUM,
        INSURED_ON = TO_DATE(:INSURED_ON, 'YYYY-MM-DD HH24:MI:SS'),
        EXPIRED_ON = TO_DATE(:EXPIRED_ON, 'YYYY-MM-DD HH24:MI:SS'),
        POLICY_TYPE = :POLICY_TYPE,
        COMPANY = :COMPANY,
        CO_BENEFICIARY = :CO_BENEFICIARY,
        PLATE_NO = :PLATE_NO,
        VEHICLE_MODEL = :VEHICLE_MODEL,
        CHASSIS_NO = :CHASSIS_NO,
        ENGINE_NUMBER = :ENGINE_NUMBER,
        YEAR_OF_MAKE = :YEAR_OF_MAKE,
        ENGINE_CAPACITY = :ENGINE_CAPACITY,
        PREVIOUS_INSURED_VALUE = :PREVIOUS_INSURED_VALUE,
        PREMIUM_AMOUNT = :PREMIUM_AMOUNT,
        INSURANCE_STATUS = :INSURANCE_STATUS,
        REMARK = :REMARK,
        STAFF_ID = :STAFF_ID,
        USER_ID = :USER_ID,
        STATUS = :STATUS
      WHERE ID = :ID
    `;
    const formatDate = (date) => {
      const d = new Date(date);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
    };
    const bindData = { ...data, ID: id };
    bindData.INSURED_ON = formatDate(data.INSURED_ON);
    bindData.EXPIRED_ON = formatDate(data.EXPIRED_ON);
    await connection.execute(query, bindData);
    await connection.commit();
  } catch (error) {
    console.error('updateAssetInsurance: Error:', error);
    if (connection) await connection.rollback();
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.release();
      } catch (error) {
        console.error('updateAssetInsurance: Error releasing connection:', error);
      }
    }
  }
};

const updateAssetStatus = async (id, status) => {
  let connection;
  try {
    connection = await getConnection();
    const query = `UPDATE ASSETINSURANCE SET STATUS = :status WHERE ID = :id`;
    await connection.execute(query, { id, status });
    await connection.commit();
  } catch (error) {
    console.error('updateAssetStatus: Error:', error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.release();
      } catch (error) {
        console.error('updateAssetStatus: Error releasing connection:', error);
      }
    }
  }
};

const deleteAssetInsurance = async (id) => {
  let connection;
  try {
    connection = await getConnection();
    await connection.execute(`DELETE FROM ASSETINSURANCE WHERE ID = :id`, [id]);
    await connection.commit();
  } catch (error) {
    console.error('deleteAssetInsurance: Error:', error);
    if (connection) await connection.rollback();
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.release();
      } catch (error) {
        console.error('deleteAssetInsurance: Error releasing connection:', error);
      }
    }
  }
};

module.exports = {
  getAllAssetInsurance,
  getAssetInsuranceById,
  createAssetInsurance,
  updateAssetInsurance,
  deleteAssetInsurance,
  updateAssetStatus,
};