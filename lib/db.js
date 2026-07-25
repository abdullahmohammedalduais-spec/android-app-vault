// ============================================================
// server/lib/db.js
// نقطة وصول واحدة لقاعدة البيانات (lowdb - ملف db.json محلي).
// كافية لتشغيل اللعبة فورًا بدون تثبيت خادم قواعد بيانات منفصل.
// لو أردت لاحقًا الانتقال إلى MongoDB الحقيقي، هذا هو الملف الوحيد
// الذي تحتاج تعديله - كل الراوتات تستدعي الدوال من هنا فقط.
// ============================================================
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const path = require("path");

const adapter = new FileSync(path.join(__dirname, "..", "db.json"));
const db = low(adapter);

db.defaults({
  users: [],
  scores: [], // لوحة المتصدرين: {userId, username, score, coins, createdAt}
}).write();

function findUserById(id) {
  return db.get("users").find({ id }).value();
}

function findUserByEmail(email) {
  return db.get("users").find({ email }).value();
}

function saveUser(user) {
  db.get("users").find({ id: user.id }).assign(user).write();
  return user;
}

function createUser(user) {
  db.get("users").push(user).write();
  return user;
}

function addScore(entry) {
  db.get("scores").push(entry).write();
}

function topScores(limit = 20) {
  return db
    .get("scores")
    .orderBy(["score"], ["desc"])
    .take(limit)
    .value();
}

function publicUser(user) {
  if (!user) return null;
  const { password, ...safe } = user;
  return safe;
}

module.exports = {
  db,
  findUserById,
  findUserByEmail,
  saveUser,
  createUser,
  addScore,
  topScores,
  publicUser,
};
