const express = require('express');
const Group = require('../models/group');
const router = express.Router();

// 그룹 목록 조회
router.get('/', async (req, res) => {
  try {
    const groups = await Group.find();
    res.status(200).send(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

module.exports = router;
