const multer = require('multer');
const path = require('path');
const sanitizeFilename = require('sanitize-filename');

// 업로드된 파일을 저장할 디렉터리 및 파일명 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'static/profileImg'); // 파일을 저장할 디렉터리
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const sanitizedFilename = sanitizeFilename(path.basename(file.originalname, ext));
    cb(null, sanitizedFilename + '__' + Date.now() + ext); // 파일명 설정 (유니크한 이름)
  },
  // limits: 파일 제한 정보
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// 파일 업로드를 처리할 Multer 인스턴스 생성
const upload = multer({ storage: storage });

module.exports = upload;
