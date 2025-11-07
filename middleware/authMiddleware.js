const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET || "aL9zQpW2xRvYt7uI0oMnB8jKf1gSeCdH";

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "No token provided" });

  jwt.verify(token.split(" ")[1], secret, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });

    if (!decoded.workUnit) {
      return res.status(403).json({ message: "Work unit missing in token" });
    }

    req.user = {
      id: decoded.id,
      roles: decoded.roles,
      workUnit: decoded.workUnit
    };
    next();
  });
};

const permitRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRoles = req.user.roles.split(",");
    const hasRole = allowedRoles.some((role) => userRoles.includes(role));
    if (!hasRole) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

module.exports = { verifyToken, permitRoles };