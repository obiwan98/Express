const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// Nodemailer Transporter 설정
const transporter = nodemailer.createTransport({
  host: 'smtp.mailersend.net',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'apikey', // MailerSend SMTP 사용자 이름으로 'apikey' 입력
    pass: process.env.MAILERSEND_API_KEY, // 환경 변수에서 MailerSend API 키 로드
  },
});

// 이메일 발송 엔드포인트
router.post('/send-email', async (req, res) => {
  const { from, to, subject, text, html } = req.body; // 요청 바디에서 데이터 가져오기

  if (!from || !to || !subject || !text) {
    return res.status(400).json({ message: 'Missing required fields: from, to, subject, text' });
  }

  const mailOptions = {
    from, // 발신자 이메일
    to,   // 수신자 이메일
    subject, // 이메일 제목
    text,    // 이메일 본문 (텍스트)
    html,    // 이메일 본문 (HTML)
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully', info });
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
});

module.exports = router; 
