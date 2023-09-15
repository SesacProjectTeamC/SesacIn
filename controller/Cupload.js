const upload = require('../multerConfig'); // Multer 설정 가져오기

// 이미지 업로드 컨트롤러 함수
// /upload/image/user
exports.uploadImageFile = (req, res) => {
  if (!req.file) {
    return res.status(400).send('파일을 업로드하세요.');
  }

  res.send('파일이 성공적으로 업로드되었습니다.'); // 업로드 성공 시 메시지 전송
};
