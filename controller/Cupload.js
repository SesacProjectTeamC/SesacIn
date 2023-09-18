const upload = require('../multerConfig'); // Multer 설정 가져오기
const { User, Question, Board } = require('../models');
const { Op } = require('sequelize');

// 이미지 업로드 컨트롤러 함수
// /upload/image/user
exports.uploadImageFile = async (req, res) => {
  // 세션 확인
  let isLogin = req.session.user ? true : false;

  try {
    // path == 이미지를 받을 수 있는 URL
    // originalname == 유저가 업로드한 원본 파일 이름(확장자 포함)
    const { originalname, path } = req.file;

    // user 테이블에 데이터 저장
    await User.update(
      {
        userImg: originalname,
        userImgPath: path,
      },
      {
        where: {
          uId: req.session.user,
        },
      }
    );

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

// QnA, 자유게시글 생성/수정시 이미지 업로드 처리
// /upload/editor/file
exports.uploadEditImageFile = async (req, res) => {
  // 세션 확인
  let isLogin = req.session.user ? true : false;

  try {
    // path == 이미지를 받을 수 있는 URL
    // originalname == 유저가 업로드한 원본 파일 이름(확장자 포함)
    const { originalname, path } = req.file;

    // 파일 업로드 성공
    const { URL } = process.env;
    res.status(200).send({
      success: true,
      msg: '파일이 성공적으로 업로드되었습니다.',
      url: `http://${URL}/${path}`,
    });
  } catch (error) {
    console.error('파일 업로드 중 오류 발생:', error);
    res.status(500).send({
      success: false,
      msg: '파일 업로드 중에 오류가 발생했습니다.',
    });
  }
};
