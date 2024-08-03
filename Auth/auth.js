const jwt = require('jsonwebtoken');
const secretKey = 'gelos_access_key_check'; //please replace if you need a stronger key

function generateToken(employee) {
  if (!employee || !employee.Username || !employee.Role) {
    console.error('Invalid employee object for token generation:', employee);
    return null;
  }

  const payload = {
    username: employee.Username,
    role: employee.Role
  };

  console.log("Generating token for payload:", payload);
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
}
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, secretKey);
    console.log("Decoded token:", decoded);
    return decoded;
  } catch (error) {
    console.error("Token Verification Error:", error.message);
    return null;
  }
}

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.warn("No auth token provided");
      return res.status(401).json({ message: 'Authentication token required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (!decoded || !allowedRoles.includes(decoded.role)) {
      console.warn(`Access denied for role: ${decoded?.role}`);
      return res.status(403).json({ message: 'Access denied' });
    }

    req.user = decoded;
    console.log(`Access granted to user: ${decoded.username}`);
    next();
  };
}

module.exports = { generateToken, verifyToken, authorizeRoles };
