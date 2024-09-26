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

const emailTemplate = (data) => {
  return `
  <html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title></title>
    <style type="text/css">
        p { 
            margin-top: 0px;
            margin-bottom: 0px;
        }
        .bodyMargin {
            margin: 5px;
            padding-bottom: 10px;
        }
        /* 220915 okok0415 */
        .schedule_link {
            display: inline-block;
            padding: 3px 6px 3px 24px;
            font-weight: bold;
            background: url(/Mail/images/ICON/icon_schedule_link.png) 6px center no-repeat;
            background-color: #ffefc9;
            border: 1px solid #efdaa6;
            text-decoration: none;
            cursor: pointer;
            border-radius: 3px;
            margin-right: 2px;
            transition: 0.2s;
            box-sizing: border-box;
            margin-bottom: 4px;
        }
        .schedule_link:hover {
            background-color: #ffe6a9;
            border-color: #e6c571;
        }
        .schedule_link.type2 {
            background-image: url(../images/ICON/icon_schedule_link2.png);
            background-color: #e5f4ff;
            border: 1px solid #cae2f6;
            color: #00316b;
        }
        .schedule_link.type2:hover {
            background-color: #d1ebff;
            border-color: #9fcbf0;
        }
        .header {
            height: 65px;
            padding-left: 40px;
            background-color: #2d598b;
            vertical-align: middle;
        }
        .content {
            padding: 50px 40px 55px;
            border-width: 0 10px 10px;
            border-style: solid;
            border-color: #f4f6f6;
        }
        .title {
            padding-top: 8px;
            font-family: 'Malgun Gothic', '맑은 고딕', Dotum, 돋움;
            font-size: 28px;
            letter-spacing: -0.2px;
            color: #000;
            font-weight: bold;
        }
        .section-title {
            font-family: 'Malgun Gothic', '맑은 고딕', Dotum, 돋움;
            font-size: 16px;
            letter-spacing: -0.2px;
            font-weight: bold;
            color: #000;
        }
        .table th, .table td {
            padding: 8px 12px;
            font-family: 'Malgun Gothic', '맑은 고딕', Dotum, 돋움;
            font-size: 13px;
            line-height: 18px;
            letter-spacing: -0.5px;
            color: #656565;
            border: 1px solid #e6e8e8;
        }
        .table th {
            background-color: #f7f7f7;
            font-weight: bold;
            border-top: solid 1px #000;
        }
        .table td {
            color: #000;
            text-align: center;
        }
        .break-word {
            word-wrap: break-word;
            white-space: normal;
        }
        .wrap-text {
            white-space: normal;
            word-break: break-all; 
        }
    </style>
</head>
<body class="bodyMargin">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<table width="740" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td class="header"></td>
</tr>
<tr>
<td class="content">
    <table cellspacing="0" cellpadding="0" width="100%">
        <tbody>
            <tr>
                <td class="title">결재 반려되었습니다.</td>
            </tr>
            <tr>
                <td height="42"></td>
            </tr>
            <tr>
                <td>
                    <table cellspacing="0" cellpadding="0" width="100%">
                        <tbody>
                            <tr>
                                <td class="section-title">신청자 정보</td>
                            </tr>
                            <tr>
                                <td height="6"></td>
                            </tr>
                            <tr>
                                <td>
                                    <table class="table" cellspacing="0" cellpadding="0" width="100%">
                                        <tbody>
                                            <tr>
                                                <th style="width: 10%;">이름</th>
                                                <td style="width: 15%;border-top: solid 1px #000;">박광연님</td>
                                                <th style="width: 10%;">부서명</th>
                                                <td style="width: 15%;border-top: solid 1px #000;">CGV팀</td>
                                                <th style="width: 10%;">이메일</th>
                                                <td style="border-top: solid 1px #000;">kwangyoun.park@cj.net</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
            <tr>
                <td height="30"></td>
            </tr>
            <tr>
                <td>
                    <table cellspacing="0" cellpadding="0" width="100%">
                        <tbody>
                            <tr>
                                <td class="section-title">도서 정보</td>
                            </tr>
                            <tr>
                                <td height="6"></td>
                            </tr>
                            <tr>
                                <td>
                                    <table class="table" cellspacing="0" cellpadding="0" width="100%">
                                        <tbody>
                                            <tr>
                                                <th style="width: 12%;">도서명</th>
                                                <td style="border-top: solid 1px #000;text-align:left;" class="wrap-text">스프링으로 하는 마이크로서비스 구축 2/e - 스프링 부트와 스프링 클라우드, 이스티오를 이용한 확장 가능한 마이크로서비스 구축</td>
                                            </tr>
                                            <tr>
                                                <th style="width: 12%;border-top: solid 1px #e6e8e8;">가격</th>
                                                <td style="text-align:left;">20.000원</td>
                                            </tr>
                                            <tr>
                                                <th style="width: 12%;border-top: solid 1px #e6e8e8;">요청사항</th>
                                                <td style="text-align:left;" class="wrap-text">
                                                    kwangyoun.park@cj.netkwangyoun.park@cj.netkwangyoun.park@cj.net
                                                    kwangyoun.park@cj.netkwangyoun.park@cj.netkwangyoun.park@cj.net
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
            <tr>
                <td height="30"></td>
            </tr>
            <tr>
                <td>
                    <table cellspacing="0" cellpadding="0" width="100%">
                        <tbody>
                            <tr>
                                <td class="section-title">결재 정보</td>
                            </tr>
                            <tr>
                                <td height="6"></td>
                            </tr>
                            <tr>
                                <td>
                                    <table class="table" cellspacing="0" cellpadding="0" width="100%">
                                        <tbody>
                                            <tr>
                                                <th style="width: 15%;">담당자</th>
                                                <th>의견</th>
                                                <th style="width: 15%;">결재여부</th>
                                                <th style="width: 15%;">결재일</th>
                                            </tr>
                                            <tr>
                                                <td>박광연님</td>
                                                <td style="text-align:left;" class="wrap-text"></td>
                                                <td>승인</td>
                                                <td>2024.05.09</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
</td>
</tr>
</tbody>
</table>
</body>
</html>
  `;
};

// 이메일 발송 엔드포인트
router.post('/api/send-email', async (req, res) => {
  // #swagger.tags = ['Mail']
  // #swagger.summary = '이메일 보내기'
  console.log(process.env.MAILERSEND_API_KEY);

  const { type, from, to } = req.body; // 요청 바디에서 데이터 가져오기

  
  // 필수 필드 검증
  if (!to || !subject || !text) {
    return res.status(400).json({ message: '필수 필드가 누락되었습니다: from, to, subject, text' });
  }

  const mailOptions = {
    from: 'bss.master2024@gmail.com',
    to: to,
    subject: subject,
    text: '',
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
