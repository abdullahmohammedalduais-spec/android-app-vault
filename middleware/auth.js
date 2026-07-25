// ============================================================
// server/middleware/auth.js
// يتحقق من رمز JWT المرسل في هيدر Authorization: Bearer <token>
// ويمنع أي راوت محمي من العمل بدون تسجيل دخول صحيح.
// ============================================================
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "change-this-secret";

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "يجب تسجيل الدخول أولاً" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: "الجلسة غير صالحة أو انتهت، سجّل الدخول من جديد" });
  }
}

module.exports = { requireAuth, JWT_SECRET };
