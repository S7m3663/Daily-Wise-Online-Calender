const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Yetki gerekli" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "GIZLIANAHTAR"); // .env kullanıyorsan process.env.JWT_SECRET
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token geçersiz" });
  }
};

module.exports = authenticate;
