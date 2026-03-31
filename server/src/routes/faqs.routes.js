const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { getDb } = require('../config/db');

const router = express.Router();

const normalizeKey = (value) => String(value || '').trim().toLowerCase();

const scoreFaq = (faq, catCode, brand) => {
  const faqCat = normalizeKey(faq?.cat_code || faq?.category_code || faq?.catCode || '');
  const faqBrand = normalizeKey(faq?.brand || faq?.brand_code || faq?.brandCode || '');
  const catMatch = catCode && faqCat && faqCat === catCode;
  const brandMatch = brand && faqBrand && faqBrand === brand;
  const isGeneral =
    (!faqCat || faqCat === 'all') &&
    (!faqBrand || faqBrand === 'all');

  if (catMatch && brandMatch) return 3;
  if (catMatch && !faqBrand) return 2;
  if (!faqCat && brandMatch) return 1;
  if (isGeneral) return 0;
  return -1;
};

router.get('/', asyncHandler(async (req, res) => {
  const db = getDb();
  const catCode = normalizeKey(req.query.cat_code || req.query.category || '');
  const brand = normalizeKey(req.query.brand || req.query.brand_code || '');

  const candidates = await db
    .collection('faqs')
    .find({
      $or: [
        { cat_code: { $exists: false } },
        { brand: { $exists: false } },
        { cat_code: { $in: [catCode, 'all', '', null] } },
        { brand: { $in: [brand, 'all', '', null] } },
      ],
    })
    .toArray();

  const scored = candidates
    .map((faq) => ({
      faq,
      score: scoreFaq(faq, catCode, brand),
    }))
    .filter((entry) => entry.score >= 0)
    .sort((a, b) => b.score - a.score);

  const best = scored.find(
    (entry) => Array.isArray(entry.faq?.questions) && entry.faq.questions.length > 0,
  );

  res.json({
    success: true,
    data: best ? best.faq : { questions: [] },
  });
}));

module.exports = router;
