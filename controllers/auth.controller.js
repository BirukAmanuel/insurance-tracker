const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getUserByEmail, createUser } = require("../dal/user.dal");

const secret = process.env.JWT_SECRET ;

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await getUserByEmail(email);
    console.log("User in login:", user); // Debug
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.PASSWORD) {
      console.error("Password field missing in user:", user);
      return res.status(500).json({ message: "User data incomplete: Missing PASSWORD" });
    }

    const validPassword = await bcrypt.compare(password, user.PASSWORD);
    if (!validPassword) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      {
        id: user.ID,
        email: user.EMAIL,
        roles: user.ROLES,
        workUnit: user.WORK_UNIT
      },
      secret,
      { expiresIn: "8h" }
    );

    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal error", error: err.message });
  }
};

const register = async (req, res) => {
  const { email, password, roles, work_unit } = req.body;

  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    if (!work_unit || typeof work_unit !== 'string' || work_unit.trim().length === 0) {
      return res.status(400).json({ message: "Work unit is required and must be a non-empty string" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await createUser({ email, password: hashedPassword, roles, work_unit: work_unit.trim() });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

module.exports = { login, register };