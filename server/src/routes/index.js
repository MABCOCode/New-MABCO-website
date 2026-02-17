const express = require('express');

const healthRoutes = require('./health.routes');
const productRoutes = require('./products.routes');
const categoryRoutes = require('./categories.routes');
const brandRoutes = require('./brands.routes');
const offerRoutes = require('./offers.routes');
const showroomRoutes = require('./showrooms.routes');
const orderRoutes = require('./orders.routes');
const adminRoutes = require('./admin.routes');
const { requireAdminKey } = require('../middleware/adminAuth');

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/brands', brandRoutes);
router.use('/offers', offerRoutes);
router.use('/showrooms', showroomRoutes);
router.use('/orders', orderRoutes);
router.use('/admin', requireAdminKey, adminRoutes);

module.exports = router;
