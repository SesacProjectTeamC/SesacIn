const express = require('express');
const router = express.Router();
const multer = require('multer');
const { upload, editorUploader } = require('../multerConfig'); // Multer 설정 가져오기
const Cupload = require('../controller/Cupload'); // 업로드 컨트롤러 가져오기
const { needToLogin } = require('../util/middleware');

// 사용자 프로필 이미지 업로드 처리 라우터
// /upload/image/user
router.post('/image/user', needToLogin, upload.single('userImgFile'), Cupload.uploadImageFile);

// 에디터에서의 파일 업로드 처리 라우터
// /upload/editor/file
router.post('/editor/file', needToLogin, editorUploader.single('file'), Cupload.uploadEditImageFile);

// 에러 처리 미들웨어 (Multer에서 발생한 오류 처리)
router.use((err, req, res, next) => {
  console.log(err.code);
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
