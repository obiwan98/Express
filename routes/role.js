const express = require('express');
const Role = require('../models/role');
const router = express.Router();

// 역할 목록 조회
router.get('/', async (req, res) => {
  try {
    const roles = await Role.find();
    res.status(200).send(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

module.exports = router;
