// ============================================================
// server/routes/garage.js
// الجراج والمتجر: عرض السيارات، الشراء، الترقية، واختيار السيارة
// النشطة. كل التحقق من الأسعار والمنطق يتم هنا في السيرفر فقط -
// التطبيق لا يستطيع خداع اللعبة بإرسال سعر مزوّر.
// ============================================================
const express = require("express");
const {
  findUserById,
  saveUser,
  publicUser,
} = require("../lib/db");
const { requireAuth } = require("../middleware/auth");
const {
  CARS,
  UPGRADE_LEVELS,
  UPGRADE_STEP,
  upgradeCost,
  getCarById,
} = require("../data/carsCatalog");

const router = express.Router();

// ---------------- كتالوج السيارات (عام، لا يحتاج تسجيل دخول) ----------------
router.get("/cars", (req, res) => {
  res.json({ cars: CARS, upgradeLevels: UPGRADE_LEVELS, upgradeStep: UPGRADE_STEP });
});

// ---------------- شراء سيارة ----------------
router.post("/buy", requireAuth, (req, res) => {
  const { carId } = req.body;
  const user = findUserById(req.userId);
  const car = getCarById(carId);

  if (!user || !car) {
    return res.status(404).json({ error: "بيانات غير صحيحة" });
  }
  if (user.ownedCars.includes(carId)) {
    return res.status(400).json({ error: "أنت تمتلك هذه السيارة بالفعل" });
  }
  if (user.coins < car.price) {
    return res.status(400).json({ error: "عملاتك غير كافية لشراء هذه السيارة" });
  }

  user.coins -= car.price;
  user.ownedCars.push(carId);
  user.upgrades[carId] = { speed: 0, accel: 0, handling: 0, nitro: 0 };
  saveUser(user);

  res.json({ user: publicUser(user) });
});

// ---------------- ترقية خاصية في سيارة تملكها ----------------
// stat: "speed" | "accel" | "handling" | "nitro"
router.post("/upgrade", requireAuth, (req, res) => {
  const { carId, stat } = req.body;
  const user = findUserById(req.userId);
  const car = getCarById(carId);
  const validStats = ["speed", "accel", "handling", "nitro"];

  if (!user || !car || !validStats.includes(stat)) {
    return res.status(400).json({ error: "بيانات غير صحيحة" });
  }
  if (!user.ownedCars.includes(carId)) {
    return res.status(400).json({ error: "أنت لا تملك هذه السيارة" });
  }

  const current = user.upgrades[carId] || { speed: 0, accel: 0, handling: 0, nitro: 0 };
  const level = current[stat] || 0;

  if (level >= UPGRADE_LEVELS) {
    return res.status(400).json({ error: "هذه الخاصية وصلت لأقصى مستوى" });
  }

  const cost = upgradeCost(level);
  if (user.coins < cost) {
    return res.status(400).json({ error: "عملاتك غير كافية لهذه الترقية" });
  }

  user.coins -= cost;
  current[stat] = level + 1;
  user.upgrades[carId] = current;
  saveUser(user);

  res.json({ user: publicUser(user), newLevel: current[stat], cost });
});

// ---------------- اختيار السيارة النشطة للسباق ----------------
router.post("/select", requireAuth, (req, res) => {
  const { carId } = req.body;
  const user = findUserById(req.userId);

  if (!user || !user.ownedCars.includes(carId)) {
    return res.status(400).json({ error: "لا يمكن اختيار سيارة لا تملكها" });
  }

  user.selectedCarId = carId;
  saveUser(user);
  res.json({ user: publicUser(user) });
});

module.exports = router;
