const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');

const authMiddleware = (req, res, next) => {
  if (req.session.admin) {
    next();
  } else {
    res.redirect('/');
  }
};

router.get('/', authController.loginView);
router.post('/login', authController.login);

router.get('/dashboard', authMiddleware, adminController.dashboard);
router.post('/buy', authMiddleware, adminController.buy);
router.get('/purchases', authMiddleware, adminController.purchases);
router.post('/cancel/:id', authMiddleware, adminController.cancel);
router.get('/logout', authController.logout);

module.exports = router;
