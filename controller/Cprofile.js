//=== 마이 페이지 ===
// 1. 좋아요 / 작성한 게시글 / 답변 / 댓글
// 2. 회원정보 GET
// 3. 수정 버튼 -> 회원정보 PATCH, DELETE

//////////////////////////////////////////////
const { User, Question, Answer, Comment, Board } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');

exports.getUser = async (req, res) => {
  try {
    // const { uId } = req.params;

    // 테스트를 위해 로그인한 유저를 정해놓음
    // req.session.user = 'aassddff1';

    // 세션에서 로그인 된 사용자 id 가져오기
    const uId = req.session.user;

    // 현재 로그인 된 사용자의 ID와 요청된 사용자 ID가 일치하는지 확인
    if (req.session.user) {
      // 데이터베이스에서 해당 사용자 정보를 조회합니다.
      const user = await User.findOne({
        where: { uId: uId },
      });
      // 1. 좋아요 / 작성한 게시글 / 답변 / 댓글
      //-- 좋아요 클릭 게시글 가져오기
      // isLike

      //-- 작성한 게시글 가져오기
      const posts = await Question.findAll({ where: { uId: uId } });

      //-- 작성한 답변 가져오기
      const answers = await Answer.findAll({ where: { uId: uId } });

      //-- 작성한 댓글 가져오기
      const comments = await Comment.findAll({ where: { uId: uId } });
      // 사용자 정보를 마이페이지 템플릿에 전달하여 렌더링합니다.
      res.render('profile', {
        userData: user,
        postData: posts,
        answerData: answers,
        commentData: comments,
      });
    } else {
      // 현재 로그인한 사용자와 요청된 사용자가 다를 경우 권한 없음을 응답
      res.status(401).send('로그인 정보 다름. 권한 없음.');
    }
  } catch (err) {
    // 기타 데이터베이스 오류
    console.log(err);
    res.status(500).send({
      OK: false,
      msg: '데이터베이스 오류 발생',
    });
    return;
  }
};

/////////////////////////////////////////////////// 사용자 정보 수정 페이지
// 정보 수정 창 렌더링
exports.getUserInfo = (req, res) => {
  const userData = {
    uId: req.session.user, // 세션에서 사용자 ID 가져오기
  };
  // ********** 추후에 어떤 화면으로 이동할 지 이름 수정 필요할수도 있음
  res.render('editprofile', { userData });
};

// 회원 정보 수정 - 비밀번호, 이름 (이미지는 후순위)
exports.patchUser = async (req, res) => {
  try {
    const uId = req.session.user;
    console.log(uId);

    const userData = { uId: uId };
    let { email, pw, uName } = req.body;
    console.log(req.body);

    pw = hashPassword(pw);

    const updatedUser = await User.update(
      { email: email, pw: pw, uName: uName },
      {
        where: { uId: uId },
      }
    );

    const posts = await Question.findAll({ where: { uId: uId } });
    const answers = await Answer.findAll({ where: { uId: uId } });
    const comments = await Comment.findAll({ where: { uId: uId } });

    console.log('>>>>>>>', updatedUser);
    req.session.destroy((err) => {
      if (err) {
        console.log('세션 삭제 에러 >>> ', err);
      } else {
        console.log('세션 삭제 완료');
      }
    });

    res.render('profile', {
      userData: updatedUser,
      postData: posts,
      answerData: answers,
      commentData: comments,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      OK: false,
      msg: '데이터베이스 오류 발생',
    });
  }
};

// 회원 삭제 - 회원 탈퇴할 경우
exports.deleteUser = async (req, res) => {
  try {
    const uId = req.session.user;
    const isDeleted = await User.destroy({
      where: { uId: uId },
    });
    // console.log(isDeleted); // 성공시 1, 실패시 0
    if (isDeleted) {
      // 성공적으로 삭제된 경우
      req.session.destroy((err) => {
        if (err) {
          console.log(err);
          res.status(500).send({
            OK: false,
            msg: '데이터베이스 오류 발생',
          });
          return;
        }
        res.send(true);
      });
    } else {
      // 삭제 실패
      res.send(false);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      OK: false,
      msg: '데이터베이스 오류 발생',
    });
  }
};

// password 해싱 함수. hash된 패스워드를 리턴함
const hashPassword = (password) => {
  let saltRounds = 10;
  return bcrypt.hashSync(password, saltRounds);
};
