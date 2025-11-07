const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getConnection } = require('../../config/db');

const SECRET = 'supersecret'; // use process.env.SECRET in production

exports.register = async (req, res) => {
  const { username, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const connection = await getConnection();
    await connection.execute(
      `INSERT INTO USERS (USERNAME, PASSWORD_HASH, ROLE) VALUES (:username, :password, :role)`,
      [username, hashedPassword, role],
      { autoCommit: true }
    );
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const connection = await getConnection();
    const result = await connection.execute(
      `SELECT * FROM USERS WHERE USERNAME = :username`,
      [username]
    );

    const user = result.rows[0];
    if (!user) return res.status(400).json({ error: "User not found" });

    const [id, dbUsername, dbPasswordHash, role] = user;

    const isMatch = await bcrypt.compare(password, dbPasswordHash);
    if (!isMatch) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign({ id, username: dbUsername, role }, SECRET, { expiresIn: '1d' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
