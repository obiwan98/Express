const express = require('express');
const Approval = require('../models/approval');
const User = require('../models/user');
const auth = require('../middlewares/auth');
const axios = require('axios');
const router = express.Router();

//승인관리 리스트
router.get('/api/approvals/list/:state', auth, async (req, res) => {
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
      .populate('payment.group')
      .sort({ regdate: 1 });

    res.status(200).send(approvals);
  } catch (error) {
    console.error('Error fetching approval list:', error);
    res.status(400).send({ errorCode: error.code, error: error.errmsg });
  }
});

//승인컬렉션 테스트 데이터 입력
router.post('/api/approvals/test', async (req, res) => {
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

//승인관리(최슬범님)
// 승인 전체 조회 TEST
router.get('/api/approvals', async (req, res) => {
  try {
    const approvals = await Approval.find();
    console.log(approvals);
    res.status(200).send(approvals);
  } catch (error) {
    console.error('Error fetching approvals:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

// 승인 요청(신규) TEST
router.post('/api/approvals/pending', async (req, res) => {
  try {
    const { reqItems, etc } = req.body.data;

    const getValueByKey = (items, key) => {
      const item = items.find((item) => item.key === key);
      return item ? item.value : null;
    };

    const itemComment = getValueByKey(reqItems, 'comment');
    const itemState = getValueByKey(reqItems, 'state');
    const userEmail = etc.email;

    // Email로 user정보 갖고오기
    const user = await User.findOne({ email: userEmail }).populate('group');

    const approval = new Approval({
      user: user._id,
      group: user.group._id,
      book: {
        name: null,
        price: null,
      },
      comment: itemComment,
      regdate: Date.now(),
      state: itemState,
      confirm: {
        user: user._id,
        group: user.group._id,
        date: Date.now(),
        comment: 'Approved',
      },
      payment: {
        user: user._id,
        group: user.group._id,
        receiptInfo: null,
        receiptImgUrl: null,
        price: null,
        date: Date.now(),
      },
    });

    await approval.save();
    res.status(201).send({ message: '데이터가 입력되었습니다.' });
  } catch (error) {
    console.error('Error during pending:', error);
    res.status(400).send({ errorCode: error.code, error: error.errmsg });
  }
});

//승인관리(신혜경님)

module.exports = router;
