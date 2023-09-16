const upload = require('../multerConfig'); // Multer 설정 가져오기

// 이미지 업로드 컨트롤러 함수
// /upload/image/user
exports.uploadImageFile = (req, res) => {
  try {
    // Null 검사
    if (!req.file) {
      return res.status(400).send({
        success: false,
        msg: 'Null / 업로드한 파일이 없습니다.',
      });
    }

    // 파일 업로드 성공
    res.status(200).send({
      success: true,
      msg: '파일이 성공적으로 업로드되었습니다.',
    });
  } catch (error) {
    console.error('파일 업로드 중 오류 발생:', error);
    res.status(500).send({
      success: false,
      msg: '파일 업로드 중에 오류가 발생했습니다.',
    });
  }
};
