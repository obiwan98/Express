const express = require("express");
const { Approval, Book, Payment, Confirm } = require("../models/approval");
const User = require("../models/user");
const Group = require("../models/group");
const auth = require("../middlewares/auth");
const axios = require("axios");
const router = express.Router();

router.post("/test", async (req, res) => {
  // const { email, name, password, role, group } = req.body;
  const user = User.findOne({ email: "yeol2011@cj.net" });
  const group = user.populate("group");

  try {
    const approval = new Approval({
      user: user,
      group: group,
      book: new Book({
        name: "리액트마스터1",
        price: 15000,
      }),
      comment: "도서요청해요1",
      regdate: Date.now(),
      state: "0",
      confirm: new Confirm({
        user: user,
        group: group,
        date: Date.now(),
        comment: "승인합니다.",
      }),
      payment: new Payment({
        user: user,
        group: group,
        receiptInfo: "영수증정보입니다.",
        receiptImgUrl: "aa",
        price: 15000,
        date: Date.now(),
      }),
    });

    // 사용자 저장
    await approval.save();
    res.status(201).send({ message: "데이터가 입력되었습니다." });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(400).send({ errorCode: error.code, error: error.errmsg });
  }
});

module.exports = router;
