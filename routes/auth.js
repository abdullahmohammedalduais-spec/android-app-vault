// ============================================================
// server/routes/auth.js
// تسجيل حساب جديد / تسجيل الدخول / جلب بيانات الحساب الحالي
// ============================================================
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { findUserByEmail, createUser, findUserById, publicUser } = require("../lib/db");
const { requireAuth, JWT_SECRET } = require("../middleware/auth");
const { CARS } = require("../data/carsCatalog");

const router = express.Router();

function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "30d",
  });
}

// ---------------- تسجيل حساب جديد ----------------
router.post("/register", (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || password.length < 4) {
    return res
      .status(400)
      .json({ error: "البريد وكلمة مرور لا تقل عن 4 أحرف مطلوبة" });
  }

  if (findUserByEmail(email)) {
    return res.status(400).json({ error: "هذا البريد مسجل مسبقًا" });
  }

  const freeCar = CARS.find((c) => c.price === 0);

  const user = {
    id: Date.now().toString(),
    email,
    username: username || email.split("@")[0],
    password: bcrypt.hashSync(password, 10),
    coins: 500, // هدية بداية
    bestScore: 0,
    ownedCars: [freeCar.id],
    selectedCarId: freeCar.id,
    upgrades: {
      [freeCar.id]: { speed: 0, accel: 0, handling: 0, nitro: 0 },
    },
    createdAt: new Date().toISOString(),
  };

  createUser(user);

  const token = signToken(user);
  res.json({ token, user: publicUser(user) });
});

// ---------------- تسجيل الدخول ----------------
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = findUserByEmail(email);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: "بيانات الدخول غير صحيحة" });
  }

  const token = signToken(user);
  res.json({ token, user: publicUser(user) });
});

// ---------------- بيانات الحساب الحالي ----------------
router.get("/me", requireAuth, (req, res) => {
  const user = findUserById(req.userId);
  if (!user) return res.status(404).json({ error: "الحساب غير موجود" });
  res.json({ user: publicUser(user) });
});

module.exports = router;
