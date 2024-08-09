const express = require('express');
const { MailerSend, EmailParams, Sender, Recipient } = require('mailersend');
const router = express.Router();

const mailersend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY,
});

// 이메일 발송 엔드포인트
router.post('/send-email', async (req, res) => {
  console.log(process.env.MAILERSEND_API_KEY);

  const { from, to, subject, text, html } = req.body; // 요청 바디에서 데이터 가져오기

  console.log(from, to, subject, text, html);

  const sentFrom = new Sender(from);

  const recipients = [
	  new Recipient(to)
  ];

  // 필수 필드 검증
  if (!from || !to || !subject || !text) {
    return res.status(400).json({ message: '필수 필드가 누락되었습니다: from, to, subject, text' });
  }

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setSubject(subject)
    .setText(text)
    .setHtml(html);
  
  try {
    const response = await mailersend.email.send(emailParams);
    res.status(200).json({ message: '이메일 전송 성공', response });
  } catch (error) {
    console.error('이메일 전송 오류:', error.response?.data || error.message);
    res.status(500).json({ message: '이메일 전송 실패', error: error.response?.data || error.message });
  }
});

module.exports = router; 
