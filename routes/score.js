// ============================================================
// server/routes/score.js
// إرسال نتيجة سباق (نقاط + عملات جُمعت) وتحديث رصيد اللاعب،
// وجلب لوحة المتصدرين العالمية.
// ============================================================
const express = require("express");
const { findUserById, saveUser, addScore, topScores, publicUser } = require("../lib/db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// ---------------- إرسال نتيجة سباق ----------------
router.post("/submit", requireAuth, (req, res) => {
  const { score, coinsCollected, distanceM } = req.body;
  const user = findUserById(req.userId);
  if (!user) return res.status(404).json({ error: "الحساب غير موجود" });

  const safeScore = Math.max(0, Math.floor(Number(score) || 0));
  const safeCoins = Math.max(0, Math.floor(Number(coinsCollected) || 0));

  user.coins += safeCoins;
  if (safeScore > user.bestScore) user.bestScore = safeScore;
  saveUser(user);

  addScore({
    userId: user.id,
    username: user.username,
    score: safeScore,
    coins: safeCoins,
    distanceM: Math.floor(Number(distanceM) || 0),
    createdAt: new Date().toISOString(),
  });

  res.json({ user: publicUser(user) });
});

// ---------------- لوحة المتصدرين العالمية ----------------
router.get("/leaderboard", (req, res) => {
  res.json({ leaderboard: topScores(20) });
});

module.exports = router;
