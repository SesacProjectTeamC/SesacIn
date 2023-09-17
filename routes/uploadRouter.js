const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = require('../multerConfig'); // Multer 설정 가져오기
const Cupload = require('../controller/Cupload'); // 업로드 컨트롤러 가져오기
const { needToLogin } = require('../util/middleware');

// 이미지 업로드 처리 라우터
// /upload/image/user
router.post('/image/user', needToLogin, upload.single('file'), Cupload.uploadImageFile);

// 에러 처리 미들웨어 (Multer에서 발생한 오류 처리)
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).send({ error: '파일 크기가 너무 큽니다. (최대 5MB)' });
    } else {
      res.status(400).send({ error: '파일 업로드에 실패했습니다.' });
    }
  } else if (err) {
    res.status(400).send({ error: err.message });
  } else {
    next(err);
  }
});

module.exports = router;
