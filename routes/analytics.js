const { Router } = require('express');
const pasport = require('passport');
const controller = require('../controllers/analytics');
const router = Router();

router.get(
  '/overview',
  pasport.authenticate('jwt', { session: false }),
  controller.overview
);
router.get(
  '/analytics',
  pasport.authenticate('jwt', { session: false }),
  controller.analytics
);

module.exports = router;
