const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'bss.master2024@gmail.com',
    pass: 'cxzmhugxnwkrjzgi', // 앱 비밀번호 사용
  },
});

// 이메일 발송 엔드포인트
router.post('/send-email', async (req, res) => {
  console.log(process.env.MAILERSEND_API_KEY);

  const { to, subject, text, html } = req.body; // 요청 바디에서 데이터 가져오기

  console.log(to, subject, text, html);

  // 필수 필드 검증
  if (!to || !subject || !text) {
    return res.status(400).json({ message: '필수 필드가 누락되었습니다: from, to, subject, text' });
  }

  const mailOptions = {
    from: 'bss.master2024@gmail.com',
    to: to,
    subject: subject,
    text: text,
    html: html, // HTML 본문을 지원합니다
  };
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).send('Error sending email');
    }
    console.log('Email sent: ' + info.response);
    res.status(200).send('Email sent successfully');
  });
});

module.exports = router; 
