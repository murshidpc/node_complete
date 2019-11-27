const express = require('express');
const path = require('path');

const router = express.Router();
const dir = require('../util/path');

router.get('/', (req, res, next) => {
  res.sendFile(path.join(dir, 'views', 'shop.html'));
});

module.exports = router;