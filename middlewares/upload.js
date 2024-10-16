const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dynamicDir;

    // 라우트 정보에 따라 동적 경로 설정
    if (req.originalUrl.includes("/management"))
      dynamicDir = path.join("D:/uploads/bookCover");

    if (!fs.existsSync(dynamicDir))
      fs.mkdirSync(dynamicDir, { recursive: true });

    cb(null, dynamicDir);
  },
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

module.exports = upload;
