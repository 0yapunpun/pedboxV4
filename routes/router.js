const express = require('express');
const router = express.Router();
const viewController = require('../controller/viewController.js');

/* View Routers */
router.get('/', viewController.index);
router.get('/helpdesk', viewController.helpdesk);
router.get('/login', viewController.login);
router.get('/logout', viewController.login);

/* POST Services */
router.post('/login', viewController.loginValidate);

module.exports = router;