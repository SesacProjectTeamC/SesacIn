const express = require('express');
const router = express.Router();
const upload = require('../multerConfig'); // Multer 설정 가져오기
const Cupload = require('../controller/Cupload'); // 업로드 컨트롤러 가져오기
const { needToLogin } = require('../util/middleware');

// 이미지 업로드 처리 라우터
// /upload/image/user
router.post('/image/user', needToLogin, upload.single('file'), Cupload.uploadImageFile);

module.exports = router;
