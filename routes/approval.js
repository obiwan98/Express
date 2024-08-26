const express = require('express');
const Approval = require('../models/approval');
const User = require('../models/user');
const Group = require('../models/group');
const auth = require('../middlewares/auth');
const axios = require('axios');
const router = express.Router();

router.get('api/approvals/list/:state', auth, async (req, res) => {
  try {
    const approvals = await Approval.find({
      state: req.params.state,
      group: req.group._id,
    })
      .populate('user', 'email name password signupDate')
      .populate('group')
      .populate('confirm.user', 'email name password signupDate')
      .populate('confirm.group')
      .populate('payment.user', 'email name password signupDate')
      .populate('payment.group');

    res.status(200).send(approvals);
  } catch (error) {
    console.error('Error fetching approval list:', error);
    res.status(400).send({ errorCode: error.code, error: error.errmsg });
  }
});

router.post('api/approvals/test', async (req, res) => {
  try {
    const user = await User.findOne({ email: 'yeol2011@cj.net' }).populate(
      'group'
    );

    const approval = new Approval({
      user: user._id,
      group: user.group._id,
      book: {
        name: '리액트마스터1',
        price: 15000,
      },
      comment: '도서요청해요1',
      regdate: Date.now(),
      state: '2',
      confirm: {
        user: user._id,
        group: user.group._id,
        date: Date.now(),
        comment: '승인합니다.',
      },
      payment: {
        user: user._id,
        group: user.group._id,
        receiptInfo: '영수증정보입니다.',
        receiptImgUrl: 'aa',
        price: 15000,
        date: Date.now(),
      },
    });

    // 사용자 저장
    await approval.save();
    res.status(201).send({ message: '데이터가 입력되었습니다.' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(400).send({ errorCode: error.code, error: error.errmsg });
  }
});

module.exports = router;
