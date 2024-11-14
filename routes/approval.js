const express = require('express');
const Approval = require('../models/approval');
const User = require('../models/user');
const auth = require('../middlewares/auth');
const axios = require('axios');
const router = express.Router();
const moment = require('moment');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create Dir & Upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = process.env.IMAGE_URL;

    fs.access(uploadPath, fs.constants.F_OK, (err) => {
      if (err) {
        fs.mkdir(uploadPath, { recursive: true }, (mkdirErr) => {
          if (mkdirErr) {
            console.error('Error creating directory:', mkdirErr);
            return cb(mkdirErr);
          }
          cb(null, uploadPath);
        });
      } else {
        cb(null, uploadPath);
      }
    });
  },

  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

//승인관리 리스트
router.get('/api/approvals/list/:state', auth, async (req, res) => {
  // #swagger.tags = ['Approvals']
  // #swagger.summary = '승인관리 리스트'
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
  // #swagger.tags = ['Approvals']
  // #swagger.summary = '승인컬렉션 테스트 데이터 입력'
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
// 승인 요청(신규)
router.post('/api/approvals/save', async (req, res) => {
  // #swagger.tags = ['Approvals']
  // #swagger.summary = '승인 요청(신규)'
  try {
    const { reqItems, etc } = req.body.data;

    const getValueByKey = (items, key) => {
      const item = items.find((item) => item.key === key);
      return item ? item.value : null;
    };

    const bookInfo = JSON.parse(getValueByKey(reqItems, 'bookInfo'));
    const title = bookInfo.inputValue.title;
    const price = bookInfo.inputValue.priceSales;
    const author = bookInfo.inputValue.author;
    const ISBN = bookInfo.inputValue.isbn13;

    const itemComment = getValueByKey(reqItems, 'comment');
    const itemState = getValueByKey(reqItems, 'state');
    const userEmail = etc.email;

    // Email로 user정보 갖고오기
    const user = await User.findOne({ email: userEmail }).populate('group');

    const approval = new Approval({
      user: user._id,
      group: user.group._id,
      book: {
        name: title,
        price: price,
        author: author,
        ISBN: ISBN,
      },
      comment: itemComment,
      regdate: Date.now(),
      state: itemState,
      confirm: {
        user: null,
        group: null,
        date: null,
        comment: null,
      },
      payment: {
        user: null,
        group: null,
        receiptInfo: null,
        receiptImgUrl: null,
        price: null,
        date: null,
      },
    });

    await approval.save();
    res.status(201).send({ message: '데이터가 입력되었습니다.' });
  } catch (error) {
    console.error('Error during pending:', error);
    res.status(400).send({ errorCode: error.code, error: error.errmsg });
  }
});

// 승인 / 반려 / 구매 등록
router.put('/api/approvals/:id', async (req, res) => {
  // #swagger.tags = ['Approvals']
  // #swagger.summary = '승인 / 반려 / 구매 등록'
  try {
    const { data, etc } = req.body.data;
    console.log(data);
    const getValueByKey = (items, key) => {
      const item = items.find((item) => item.key === key);
      return item ? item.value : null;
    };

    const confirmComment = getValueByKey(data, 'confirmComment');
    const paymentPrice = getValueByKey(data, 'paymentPrice');
    const paymentReceiptInfo = getValueByKey(data, 'paymentReceiptInfo');
    const userEmail = etc.email;

    // Email로 user정보 갖고오기
    const user = await User.findOne({ email: userEmail }).populate('group');

    const approval = await Approval.findById(req.params.id);

    if (!approval) {
      return res.status(404).send({ error: 'Approval not found' });
    }

    switch (etc.param) {
      case 'approve':
        approval.state = 2;
        break;

      case 'reject':
        approval.state = 3;
        break;

      case 'payment':
        approval.state = 4;
        break;

      default:
        break;
    }

    if (etc.param == 'approve' || etc.param == 'reject') {
      approval.confirm.user = user._id;
      approval.confirm.group = user.group._id;
      approval.confirm.date = Date.now();
      approval.confirm.comment = confirmComment;
    } else if (etc.param === 'payment') {
      console.log(approval.payment);
      approval.payment.user = user._id;
      approval.payment.group = user.group._id;
      approval.payment.receiptImgUrl = paymentReceiptInfo;
      approval.payment.price = paymentPrice;
      approval.payment.date = Date.now();
    }

    await approval.save();
    res.status(201).send({ message: '결재처리 완료하였습니다.' });
  } catch (error) {
    console.error('Error updating approval:', error);
    res.status(400).send({ error: 'Failed to update approval' });
  }
});

// 승인 삭제
router.delete('/api/approvals/:id', async (req, res) => {
  // #swagger.tags = ['Approvals']
  // #swagger.summary = '승인 삭제'
  try {
    const approval = await Approval.findByIdAndDelete(req.params.id);
    if (!approval) {
      return res.status(404).send({ error: 'Approval not found' });
    }
    res.status(200).send({ message: 'Approval deleted successfully' });
  } catch (error) {
    console.error('Error deleting approval:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

// 첨부파일 업로드
router.post('/api/approvals/upload', upload.single('file'), (req, res) => {
  // #swagger.tags = ['Approvals']
  // #swagger.summary = '첨부파일 업로드'
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.send({ filePath: `D:/uploads/${req.file.filename}` });
});

//승인관리(신혜경님)

module.exports = router;
