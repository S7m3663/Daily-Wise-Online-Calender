const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Yetki gerekli" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "GIZLIANAHTAR");
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token geçersiz" });
  }
};

module.exports = authenticate;