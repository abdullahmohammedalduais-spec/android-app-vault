// ============================================================
// server/index.js
// سيرفر Node.js / Express الرئيسي للعبة السباق.
// يشغّل: تسجيل الدخول/الحساب، الجراج والمتجر، وإرسال النتائج
// ولوحة المتصدرين. قاعدة البيانات: lowdb (ملف db.json محلي) -
// تعمل فورًا بدون أي تثبيت إضافي، ويمكن استبدالها بـ MongoDB
// لاحقًا بتعديل server/lib/db.js فقط.
// ============================================================
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const garageRoutes = require("./routes/garage");
const scoreRoutes = require("./routes/score");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true, name: "CarRaceApp Server", time: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/garage", garageRoutes);
app.use("/api/score", scoreRoutes);

// معالج أخطاء عام
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "خطأ غير متوقع في السيرفر" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🏁 CarRaceApp server running on http://localhost:${PORT}`);
});
