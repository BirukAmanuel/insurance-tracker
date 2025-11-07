const cron = require('node-cron');
const nodemailer = require('nodemailer');
const moment = require('moment');
const { getConnection } = require('../config/db');
const oracledb = require('oracledb');
const fs = require('fs').promises;

// Store sent notifications to prevent duplicates
const sentNotifications = new Set();

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address from .env
    pass: process.env.EMAIL_PASS  // Your 16-character App Password from .env
  }
});


// Fetch projects nearing expiration
async function fetchProjectsNearingExpiration() {
  let connection;
  try {
    connection = await getConnection();
    const today = moment().startOf('day');
    const sixMonthsFromNow = moment(today).add(6, 'months').startOf('day');
    const threeMonthsFromNow = moment(today).add(3, 'months').startOf('day');
    const oneMonthFromNow = moment(today).add(1, 'month').startOf('day');

    console.log('Today:', today.format('YYYY-MM-DD'));
    console.log('Checking PROJECTINSURANCE EXPIRED_ON around:', {
      sixMonths: sixMonthsFromNow.format('YYYY-MM-DD'),
      threeMonths: threeMonthsFromNow.format('YYYY-MM-DD'),
      oneMonth: oneMonthFromNow.format('YYYY-MM-DD')
    });

    const query = `
      SELECT 
        ID, 
        BORROWER_NAME, 
        EXPIRED_ON, 
        USER_ID
      FROM PROJECTINSURANCE
      WHERE TRUNC(EXPIRED_ON) BETWEEN TO_DATE(:sixMonths, 'YYYY-MM-DD') - 1 AND TO_DATE(:sixMonths, 'YYYY-MM-DD') + 1
         OR TRUNC(EXPIRED_ON) BETWEEN TO_DATE(:threeMonths, 'YYYY-MM-DD') - 1 AND TO_DATE(:threeMonths, 'YYYY-MM-DD') + 1
         OR TRUNC(EXPIRED_ON) BETWEEN TO_DATE(:oneMonth, 'YYYY-MM-DD') - 1 AND TO_DATE(:oneMonth, 'YYYY-MM-DD') + 1
    `;

    const binds = {
      sixMonths: sixMonthsFromNow.format('YYYY-MM-DD'),
      threeMonths: threeMonthsFromNow.format('YYYY-MM-DD'),
      oneMonth: oneMonthFromNow.format('YYYY-MM-DD')
    };

    const result = await connection.execute(query, binds, { outFormat: oracledb.OUT_FORMAT_OBJECT });
    console.log('Matched PROJECTINSURANCE records:', result.rows);
    return result.rows;
  } catch (err) {
    console.error('Error fetching PROJECTINSURANCE:', err);
    return [];
  } finally {
    if (connection) {
      try {
        await connection.release();
      } catch (err) {
        console.error('Error releasing connection:', err);
      }
    }
  }
}

// Fetch assets nearing expiration
// Added to query ASSETINSURANCE for 6, 3, or 1-month expiration reminders
async function fetchAssetsNearingExpiration() {
  let connection;
  try {
    connection = await getConnection();
    const today = moment().startOf('day');
    const sixMonthsFromNow = moment(today).add(6, 'months').startOf('day');
    const threeMonthsFromNow = moment(today).add(3, 'months').startOf('day');
    const oneMonthFromNow = moment(today).add(1, 'month').startOf('day');

    console.log('Checking ASSETINSURANCE EXPIRED_ON around:', {
      sixMonths: sixMonthsFromNow.format('YYYY-MM-DD'),
      threeMonths: threeMonthsFromNow.format('YYYY-MM-DD'),
      oneMonth: oneMonthFromNow.format('YYYY-MM-DD')
    });

    const query = `
      SELECT 
        ID, 
        ASSET_TYPE, 
        EXPIRED_ON, 
        USER_ID
      FROM ASSETINSURANCE
      WHERE TRUNC(EXPIRED_ON) BETWEEN TO_DATE(:sixMonths, 'YYYY-MM-DD') - 1 AND TO_DATE(:sixMonths, 'YYYY-MM-DD') + 1
         OR TRUNC(EXPIRED_ON) BETWEEN TO_DATE(:threeMonths, 'YYYY-MM-DD') - 1 AND TO_DATE(:threeMonths, 'YYYY-MM-DD') + 1
         OR TRUNC(EXPIRED_ON) BETWEEN TO_DATE(:oneMonth, 'YYYY-MM-DD') - 1 AND TO_DATE(:oneMonth, 'YYYY-MM-DD') + 1
    `;

    const binds = {
      sixMonths: sixMonthsFromNow.format('YYYY-MM-DD'),
      threeMonths: threeMonthsFromNow.format('YYYY-MM-DD'),
      oneMonth: oneMonthFromNow.format('YYYY-MM-DD')
    };

    const result = await connection.execute(query, binds, { outFormat: oracledb.OUT_FORMAT_OBJECT });
    console.log('Matched ASSETINSURANCE records:', result.rows);
    return result.rows;
  } catch (err) {
    console.error('Error fetching ASSETINSURANCE:', err);
    return [];
  } finally {
    if (connection) {
      try {
        await connection.release();
      } catch (err) {
        console.error('Error releasing connection:', err);
      }
    }
  }
}

// Fetch staff nearing expiration
// Added to query STAFFINSURANCE for 6, 3, or 1-month expiration reminders
async function fetchStaffNearingExpiration() {
  let connection;
  try {
    connection = await getConnection();
    const today = moment().startOf('day');
    const sixMonthsFromNow = moment(today).add(6, 'months').startOf('day');
    const threeMonthsFromNow = moment(today).add(3, 'months').startOf('day');
    const oneMonthFromNow = moment(today).add(1, 'month').startOf('day');

    console.log('Checking STAFFINSURANCE EXPIRED_ON around:', {
      sixMonths: sixMonthsFromNow.format('YYYY-MM-DD'),
      threeMonths: threeMonthsFromNow.format('YYYY-MM-DD'),
      oneMonth: oneMonthFromNow.format('YYYY-MM-DD')
    });

    const query = `
      SELECT 
        ID, 
        FULL_NAME, 
        EMAIL, 
        EXPIRED_ON, 
        USER_ID, 
        AUTHORIZER_ID
      FROM STAFFINSURANCE
      WHERE TRUNC(EXPIRED_ON) BETWEEN TO_DATE(:sixMonths, 'YYYY-MM-DD') - 1 AND TO_DATE(:sixMonths, 'YYYY-MM-DD') + 1
         OR TRUNC(EXPIRED_ON) BETWEEN TO_DATE(:threeMonths, 'YYYY-MM-DD') - 1 AND TO_DATE(:threeMonths, 'YYYY-MM-DD') + 1
         OR TRUNC(EXPIRED_ON) BETWEEN TO_DATE(:oneMonth, 'YYYY-MM-DD') - 1 AND TO_DATE(:oneMonth, 'YYYY-MM-DD') + 1
    `;

    const binds = {
      sixMonths: sixMonthsFromNow.format('YYYY-MM-DD'),
      threeMonths: threeMonthsFromNow.format('YYYY-MM-DD'),
      oneMonth: oneMonthFromNow.format('YYYY-MM-DD')
    };

    const result = await connection.execute(query, binds, { outFormat: oracledb.OUT_FORMAT_OBJECT });
    console.log('Matched STAFFINSURANCE records:', result.rows);
    return result.rows;
  } catch (err) {
    console.error('Error fetching STAFFINSURANCE:', err);
    return [];
  } finally {
    if (connection) {
      try {
        await connection.release();
      } catch (err) {
        console.error('Error releasing connection:', err);
      }
    }
  }
}

// Fetch user email by ID (for INPUTTER or AUTHORIZER)
async function fetchUserEmailById(userId) {
  let connection;
  try {
    connection = await getConnection();
    const query = `
      SELECT EMAIL
      FROM USERS
      WHERE ID = :userId
    `;
    const result = await connection.execute(query, { userId }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
    console.log(`Fetched email for USER_ID ${userId}:`, result.rows[0]?.EMAIL);
    return result.rows[0]?.EMAIL || null;
  } catch (err) {
    console.error('Error fetching user email:', err);
    return null;
  } finally {
    if (connection) {
      try {
        await connection.release();
      } catch (err) {
        console.error('Error releasing connection:', err);
      }
    }
  }
}

// Fetch users by role (for AUTHORIZER)
async function fetchUsersByRole(role) {
  let connection;
  try {
    connection = await getConnection();
    const query = `
      SELECT EMAIL
      FROM USERS
      WHERE ROLES LIKE '%' || :role || '%'
    `;
    const result = await connection.execute(query, { role }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
    console.log(`Fetched emails for role ${role}:`, result.rows.map(row => row.EMAIL));
    return result.rows.map(row => row.EMAIL);
  } catch (err) {
    console.error(`Error fetching ${role} users:`, err);
    return [];
  } finally {
    if (connection) {
      try {
        await connection.release();
      } catch (err) {
        console.error('Error releasing connection:', err);
      }
    }
  }
}

// Log notification to file
async function logNotification(module, recordId, email, monthsLeft, status) {
  const logEntry = `${new Date().toISOString()} | Module: ${module} | RecordID: ${recordId} | Email: ${email} | MonthsLeft: ${monthsLeft} | Status: ${status}\n`;
  try {
    await fs.appendFile('notification.log', logEntry);
    console.log('Logged notification:', logEntry.trim());
  } catch (err) {
    console.error('Error logging notification to file:', err);
  }
}

// Log notification to database
// Added to store logs in NOTIFICATION_LOG table
async function logNotificationToDB(module, recordId, email, monthsLeft, status) {
  let connection;
  try {
    connection = await getConnection();
    const query = `
      INSERT INTO NOTIFICATION_LOG (MODULE, RECORD_ID, EMAIL, MONTHS_LEFT, STATUS)
      VALUES (:module, :recordId, :email, :monthsLeft, :status)
    `;
    await connection.execute(query, { module, recordId, email, monthsLeft, status });
    await connection.commit();
    console.log(`Logged to NOTIFICATION_LOG: ${module}, RecordID: ${recordId}, Email: ${email}`);
  } catch (err) {
    console.error('Error logging notification to database:', err);
  } finally {
    if (connection) {
      try {
        await connection.release();
      } catch (err) {
        console.error('Error releasing connection:', err);
      }
    }
  }
}

// Send email notification
// Modified to include HTML email and handle different modules
async function sendNotification(module, record, email, monthsLeft) {
  const identifier = module === 'PROJECT' ? record.BORROWER_NAME :
                    module === 'ASSET' ? record.ASSET_TYPE :
                    record.FULL_NAME;
  const notificationKey = `${module}-${record.ID}-${email}-${monthsLeft}-${moment().format('YYYY-MM-DD')}`;
  if (sentNotifications.has(notificationKey)) {
    console.log(`Skipping duplicate notification for ${email}, ${module} ${record.ID}`);
    await logNotification(module, record.ID, email, monthsLeft, 'Skipped (Duplicate)');
    await logNotificationToDB(module, record.ID, email, monthsLeft, 'Skipped (Duplicate)');
    return;
  }

  const mailOptions = {
    from: '"Insurance System" <backa7892@gmail.com>', // Added friendly name to reduce spam flagging
    to: email,
    subject: `Insurance Expiration Reminder for ${module} ${identifier}`,
    text: `
      Dear User,
      
      The insurance policy for ${module.toLowerCase()} "${identifier}" (ID: ${record.ID}) is set to expire on ${moment(record.EXPIRED_ON).format('YYYY-MM-DD')}.
      This is a reminder that the policy will expire in ${monthsLeft} month(s).
      
      Please take appropriate action.
      
      Regards,
      Insurance System
    `,
    html: `
      <h2>Insurance Expiration Reminder</h2>
      <p><strong>${module}:</strong> ${identifier} (ID: ${record.ID})</p>
      <p><strong>Expires:</strong> ${moment(record.EXPIRED_ON).format('YYYY-MM-DD')}</p>
      <p><strong>Months Left:</strong> ${monthsLeft}</p>
      <p>Please take appropriate action.</p>
      <p>Regards,<br>Insurance System</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    sentNotifications.add(notificationKey);
    await logNotification(module, record.ID, email, monthsLeft, 'Sent');
    await logNotificationToDB(module, record.ID, email, monthsLeft, 'Sent');
    console.log(`Notification sent to ${email} for ${module} ${record.ID}`);
  } catch (err) {
    console.error(`Error sending email to ${email}:`, err);
    await logNotification(module, record.ID, email, monthsLeft, `Failed: ${err.message}`);
    await logNotificationToDB(module, record.ID, email, monthsLeft, `Failed: ${err.message}`);
  }
}

// Main notification logic
// Modified to handle PROJECT, ASSET, and STAFF modules
async function sendNotifications() {
  console.log('Checking for records nearing expiration...');

  // Process PROJECTINSURANCE
  const projects = await fetchProjectsNearingExpiration();
  for (const project of projects) {
    const expiredOn = moment(project.EXPIRED_ON);
    const monthsLeft = Math.round(expiredOn.diff(moment(), 'months', true));
    console.log(`Processing PROJECT ${project.ID}: ${monthsLeft} months left`);

    let recipients = [];
    const inputterEmail = await fetchUserEmailById(project.USER_ID);
    
    if (monthsLeft === 6) {
      if (inputterEmail) recipients = [inputterEmail];
    } else if (monthsLeft === 3 || monthsLeft === 1) {
      const authorizerEmails = await fetchUsersByRole('PROJECT-AUTHORIZER');
      recipients = inputterEmail ? [inputterEmail, ...authorizerEmails] : authorizerEmails;
    }

    console.log(`Recipients for PROJECT ${project.ID}:`, recipients);
    for (const email of recipients) {
      await sendNotification('PROJECT', project, email, monthsLeft);
    }
  }

  // Process ASSETINSURANCE
  const assets = await fetchAssetsNearingExpiration();
  for (const asset of assets) {
    const expiredOn = moment(asset.EXPIRED_ON);
    const monthsLeft = Math.round(expiredOn.diff(moment(), 'months', true));
    console.log(`Processing ASSET ${asset.ID}: ${monthsLeft} months left`);

    let recipients = [];
    const inputterEmail = await fetchUserEmailById(asset.USER_ID);
    
    if (monthsLeft === 6) {
      if (inputterEmail) recipients = [inputterEmail];
    } else if (monthsLeft === 3 || monthsLeft === 1) {
      const authorizerEmails = await fetchUsersByRole('ASSET-AUTHORIZER');
      recipients = inputterEmail ? [inputterEmail, ...authorizerEmails] : authorizerEmails;
    }

    console.log(`Recipients for ASSET ${asset.ID}:`, recipients);
    for (const email of recipients) {
      await sendNotification('ASSET', asset, email, monthsLeft);
    }
  }

  // Process STAFFINSURANCE
  const staffRecords = await fetchStaffNearingExpiration();
  for (const staff of staffRecords) {
    const expiredOn = moment(staff.EXPIRED_ON);
    const monthsLeft = Math.round(expiredOn.diff(moment(), 'months', true));
    console.log(`Processing STAFF ${staff.ID}: ${monthsLeft} months left`);

    let recipients = [];
    const inputterEmail = staff.EMAIL; // Use STAFFINSURANCE.EMAIL for STAFF-INPUTTER
    const authorizerEmail = await fetchUserEmailById(staff.AUTHORIZER_ID);
    
    if (monthsLeft === 6) {
      if (inputterEmail) recipients = [inputterEmail];
    } else if (monthsLeft === 3 || monthsLeft === 1) {
      const authorizerEmails = await fetchUsersByRole('STAFF-AUTHORIZER');
      recipients = inputterEmail ? [inputterEmail] : [];
      if (authorizerEmail) recipients.push(authorizerEmail);
      recipients.push(...authorizerEmails);
    }

    console.log(`Recipients for STAFF ${staff.ID}:`, recipients);
    for (const email of recipients) {
      await sendNotification('STAFF', staff, email, monthsLeft);
    }
  }

  // Clear sentNotifications daily
  if (moment().hour() === 23) {
    sentNotifications.clear();
    console.log('Cleared sentNotifications');
  }
}

// Schedule daily notifications at 8 AM
cron.schedule('0 8 * * *', sendNotifications);

module.exports = { sendNotifications };