// ============================================================
// server/data/carsCatalog.js
// كتالوج السيارات الرسمي (مصدر الحقيقة الوحيد للأسعار والإحصائيات).
// أي عملية شراء أو ترقية تمر عبر هذا الملف في السيرفر - وليس عبر
// أي رقم يرسله التطبيق - حتى لا يستطيع أحد "غش" اللعبة بتعديل الطلب.
// ============================================================

const CARS = [
  {
    id: "car_street",
    name: "Street Racer",
    nameAr: "ستريت ريسر",
    color: "#e11d48",
    price: 0, // سيارة مجانية تبدأ بها كل الحسابات
    baseSpeed: 60, // km/h المعروضة كأساس بصري في اللعبة
    baseAccel: 1.0,
    baseHandling: 1.0,
    baseNitro: 1.0,
  },
  {
    id: "car_viper",
    name: "Viper GT",
    nameAr: "فايبر جي تي",
    color: "#f59e0b",
    price: 1500,
    baseSpeed: 68,
    baseAccel: 1.15,
    baseHandling: 1.05,
    baseNitro: 1.1,
  },
  {
    id: "car_shadow",
    name: "Shadow X",
    nameAr: "شادو إكس",
    color: "#7c3aed",
    price: 3500,
    baseSpeed: 75,
    baseAccel: 1.3,
    baseHandling: 1.15,
    baseNitro: 1.25,
  },
  {
    id: "car_apex",
    name: "Apex Hyper",
    nameAr: "أبيكس هايبر",
    color: "#06b6d4",
    price: 7000,
    baseSpeed: 84,
    baseAccel: 1.45,
    baseHandling: 1.25,
    baseNitro: 1.4,
  },
  {
    id: "car_phantom",
    name: "Phantom One",
    nameAr: "فانتوم ون",
    color: "#f8fafc",
    price: 15000,
    baseSpeed: 95,
    baseAccel: 1.65,
    baseHandling: 1.4,
    baseNitro: 1.6,
  },
];

// كل مستوى ترقية يضيف نسبة تحسين. 5 مستويات لكل خاصية (سرعة، تسارع، تحكم، نيترو)
const UPGRADE_LEVELS = 5;
const UPGRADE_STEP = 0.06; // كل مستوى يزيد الأداء 6%
const upgradeCost = (level) => 250 * (level + 1) * (level + 1); // تكلفة تصاعدية

function getCarById(id) {
  return CARS.find((c) => c.id === id) || null;
}

module.exports = {
  CARS,
  UPGRADE_LEVELS,
  UPGRADE_STEP,
  upgradeCost,
  getCarById,
};
