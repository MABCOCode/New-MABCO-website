const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'MABCO API is running',
    now: new Date().toISOString(),
  });
});

module.exports = router;
