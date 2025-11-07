const { getConnection } = require("../config/db");
const oracledb = require("oracledb");

const getAllProjectInsurance = async (workUnit) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT 
         ID, 
         BORROWER_NAME, 
         LOAN_APPROVED, 
         COLLATERAL_TYPE, 
         COLLATERAL_VALUE, 
         SUM_INSURED, 
         INSURANCE_PREMIUM, 
         TO_CHAR(INSURED_ON, 'YYYY-MM-DD HH24:MI:SS') AS INSURED_ON, 
         TO_CHAR(EXPIRED_ON, 'YYYY-MM-DD HH24:MI:SS') AS EXPIRED_ON, 
         POLICY_TYPES, 
         COMPANY, 
         CO_BENEFICIARY, 
         PLATE_NO, 
         REMARK, 
         ASSET_ID, 
         USER_ID, 
         STATUS,
         WORK_UNIT,
         TO_CHAR(CREATED_AT, 'YYYY-MM-DD HH24:MI:SS') AS CREATED_AT,
         TO_CHAR(UPDATED_AT, 'YYYY-MM-DD HH24:MI:SS') AS UPDATED_AT 
       FROM PROJECTINSURANCE
       WHERE WORK_UNIT = :workUnit`,
      [workUnit],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    console.log('getAllProjectInsurance: Rows:', result.rows);
    return result.rows;
  } catch (error) {
    console.error('getAllProjectInsurance: Error:', error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.release();
      } catch (error) {
        console.error('getAllProjectInsurance: Error releasing connection:', error);
      }
    }
  }
};

const getProjectInsuranceById = async (id, workUnit) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT 
         ID, 
         BORROWER_NAME, 
         LOAN_APPROVED, 
         COLLATERAL_TYPE, 
         COLLATERAL_VALUE, 
         SUM_INSURED, 
         INSURANCE_PREMIUM, 
         TO_CHAR(INSURED_ON, 'YYYY-MM-DD HH24:MI:SS') AS INSURED_ON, 
         TO_CHAR(EXPIRED_ON, 'YYYY-MM-DD HH24:MI:SS') AS EXPIRED_ON, 
         POLICY_TYPES, 
         COMPANY, 
         CO_BENEFICIARY, 
         PLATE_NO, 
         REMARK, 
         ASSET_ID, 
         USER_ID, 
         STATUS,
         WORK_UNIT,
         TO_CHAR(CREATED_AT, 'YYYY-MM-DD HH24:MI:SS') AS CREATED_AT,
         TO_CHAR(UPDATED_AT, 'YYYY-MM-DD HH24:MI:SS') AS UPDATED_AT 
       FROM PROJECTINSURANCE 
       WHERE ID = :id AND WORK_UNIT = :workUnit`,
      [id, workUnit],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    return result.rows[0];
  } catch (error) {
    console.error('getProjectInsuranceById: Error:', error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.release();
      } catch (error) {
        console.error('getProjectInsuranceById: Error releasing connection:', error);
      }
    }
  }
};

const createProjectInsurance = async (data, userId, workUnit) => {
  let connection;
  try {
    connection = await getConnection();
    const query = `
      INSERT INTO PROJECTINSURANCE (
        BORROWER_NAME, LOAN_APPROVED, COLLATERAL_TYPE, COLLATERAL_VALUE,
        SUM_INSURED, INSURANCE_PREMIUM,
        INSURED_ON, EXPIRED_ON, POLICY_TYPES, COMPANY, CO_BENEFICIARY,
        PLATE_NO, REMARK, ASSET_ID, USER_ID, STATUS, WORK_UNIT
      ) VALUES (
        :BORROWER_NAME, :LOAN_APPROVED, :COLLATERAL_TYPE, :COLLATERAL_VALUE,
        :SUM_INSURED, :INSURANCE_PREMIUM,
        TO_DATE(:INSURED_ON, 'YYYY-MM-DD HH24:MI:SS'),
        TO_DATE(:EXPIRED_ON, 'YYYY-MM-DD HH24:MI:SS'),
        :POLICY_TYPES, :COMPANY, :CO_BENEFICIARY,
        :PLATE_NO, :REMARK, :ASSET_ID, :USER_ID, :STATUS, :WORK_UNIT
      )
    `;

    const formatDate = (date) => {
      const d = new Date(date);
      return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`;
    };

    const bindData = {
      BORROWER_NAME: data.BORROWER_NAME,
      LOAN_APPROVED: data.LOAN_APPROVED,
      COLLATERAL_TYPE: data.COLLATERAL_TYPE,
      COLLATERAL_VALUE: data.COLLATERAL_VALUE,
      SUM_INSURED: data.SUM_INSURED,
      INSURANCE_PREMIUM: data.INSURANCE_PREMIUM,
      INSURED_ON: formatDate(data.INSURED_ON),
      EXPIRED_ON: formatDate(data.EXPIRED_ON),
      POLICY_TYPES: data.POLICY_TYPES,
      COMPANY: data.COMPANY,
      CO_BENEFICIARY: data.CO_BENEFICIARY,
      PLATE_NO: data.PLATE_NO,
      REMARK: data.REMARK,
      ASSET_ID: data.ASSET_ID,
      USER_ID: userId,
      STATUS: data.STATUS || 'PENDING',
      WORK_UNIT: workUnit
    };

    const result = await connection.execute(query, bindData, { autoCommit: true });
    console.log(`Created PROJECTINSURANCE record with USER_ID: ${userId}, WORK_UNIT: ${workUnit}`);
    return result;
  } catch (error) {
    console.error('createProjectInsurance: Error:', error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.release();
      } catch (error) {
        console.error('createProjectInsurance: Error releasing connection:', error);
      }
    }
  }
};

const updateProjectInsurance = async (id, data, workUnit) => {
  let connection;
  try {
    connection = await getConnection();
    const query = `
      UPDATE PROJECTINSURANCE SET
        BORROWER_NAME = :BORROWER_NAME,
        LOAN_APPROVED = :LOAN_APPROVED,
        COLLATERAL_TYPE = :COLLATERAL_TYPE,
        COLLATERAL_VALUE = :COLLATERAL_VALUE,
        SUM_INSURED = :SUM_INSURED,
        INSURANCE_PREMIUM = :INSURANCE_PREMIUM,
        INSURED_ON = TO_DATE(:INSURED_ON, 'YYYY-MM-DD HH24:MI:SS'),
        EXPIRED_ON = TO_DATE(:EXPIRED_ON, 'YYYY-MM-DD HH24:MI:SS'),
        POLICY_TYPES = :POLICY_TYPES,
        COMPANY = :COMPANY,
        CO_BENEFICIARY = :CO_BENEFICIARY,
        PLATE_NO = :PLATE_NO,
        REMARK = :REMARK,
        ASSET_ID = :ASSET_ID,
        USER_ID = :USER_ID,
        STATUS = :STATUS,
        WORK_UNIT = :WORK_UNIT,
        UPDATED_AT = SYSDATE
      WHERE ID = :ID AND WORK_UNIT = :WORK_UNIT_CHECK
    `;

    const formatDate = (date) => {
      const d = new Date(date);
      return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`;
    };

    const bindData = {
      BORROWER_NAME: data.BORROWER_NAME,
      LOAN_APPROVED: data.LOAN_APPROVED,
      COLLATERAL_TYPE: data.COLLATERAL_TYPE,
      COLLATERAL_VALUE: data.COLLATERAL_VALUE,
      SUM_INSURED: data.SUM_INSURED,
      INSURANCE_PREMIUM: data.INSURANCE_PREMIUM,
      INSURED_ON: formatDate(data.INSURED_ON),
      EXPIRED_ON: formatDate(data.EXPIRED_ON),
      POLICY_TYPES: data.POLICY_TYPES,
      COMPANY: data.COMPANY,
      CO_BENEFICIARY: data.CO_BENEFICIARY,
      PLATE_NO: data.PLATE_NO,
      REMARK: data.REMARK,
      ASSET_ID: data.ASSET_ID,
      USER_ID: data.USER_ID,
      STATUS: data.STATUS,
      WORK_UNIT: workUnit,
      ID: id,
      WORK_UNIT_CHECK: workUnit
    };

    const result = await connection.execute(query, bindData, { autoCommit: true });
    if (result.rowsAffected === 0) {
      throw new Error('Project not found or unauthorized work unit');
    }
  } catch (error) {
    console.error('updateProjectInsurance: Error:', error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.release();
      } catch (error) {
        console.error('updateProjectInsurance: Error releasing connection:', error);
      }
    }
  }
};

const updateProjectInsuranceStatus = async (id, status, workUnit) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `UPDATE PROJECTINSURANCE SET STATUS = :status, UPDATED_AT = SYSDATE WHERE ID = :id AND WORK_UNIT = :workUnit`,
      { status, id, workUnit },
      { autoCommit: true }
    );
    if (result.rowsAffected === 0) {
      throw new Error('Project not found or unauthorized work unit');
    }
  } catch (error) {
    console.error('updateProjectInsuranceStatus: Error:', error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.release();
      } catch (error) {
        console.error('updateProjectInsuranceStatus: Error releasing connection:', error);
      }
    }
  }
};

const deleteProjectInsurance = async (id, workUnit) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `DELETE FROM PROJECTINSURANCE WHERE ID = :id AND WORK_UNIT = :workUnit`,
      [id, workUnit],
      { autoCommit: true }
    );
    if (result.rowsAffected === 0) {
      throw new Error('Project not found or unauthorized work unit');
    }
  } catch (error) {
    console.error('deleteProjectInsurance: Error:', error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.release();
      } catch (error) {
        console.error('deleteProjectInsurance: Error releasing connection:', error);
      }
    }
  }
};

module.exports = {
  getAllProjectInsurance,
  getProjectInsuranceById,
  createProjectInsurance,
  updateProjectInsurance,
  deleteProjectInsurance,
  updateProjectInsuranceStatus,
};