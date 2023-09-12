//=== 마이 페이지 ===
// 1. 좋아요 / 작성한 게시글 / 답변 / 댓글
// 2. 회원정보 GET
// 3. 수정 버튼 -> 회원정보 PATCH, DELETE

//////////////////////////////////////////////
const { User, Question, Answer, Comment, Board } = require('../models');

exports.getProfile = async (req, res) => {
  try {
    const uId = req.params;

    // 프로필 조회
    const profile = await User.findOne({ where: uId });

    // 1. 좋아요 / 작성한 게시글 / 답변 / 댓글
    //-- 좋아요 클릭 게시글 가져오기
    // isLike

    //-- 작성한 게시글 가져오기
    const posts = await Question.findAll({ where: uId });

    //-- 작성한 답변 가져오기
    const answers = await Answer.findAll({ where: uId });

    //-- 작성한 댓글 가져오기
    const comments = await Comment.findAll({ where: uId });

    res.render('profileTest', {
      userData: profile,
      postData: posts,
      answerData: answers,
      commentData: comments,
    });
  } catch (err) {
    console.log(err);
    res.send('Internet Server Error!!!');
  }
};

// 3. 수정 버튼 -> 회원정보 PATCH, DELETE
// 1) 프로필 수정 GET
exports.getEditProfile = async (req, res) => {
  try {
    const uId = req.params;

    const profile = await User.findOne({ where: uId });

    res.render('profileEditTest', { userData: profile });
  } catch (err) {
    console.log(err);
    res.send('Internet Server Error!!!');
  }
};

// 2) 프로필 수정 PATCH
exports.patchProfile = async (req, res) => {
  try {
    const { uId } = req.params;
    const { uName, email, pw } = req.body;

    const updatedProfile = await User.update(
      { uName, email, pw },
      {
        where: { uId },
      }
    );

    const posts = await Question.findAll({ where: { uId } });
    const answers = await Answer.findAll({ where: { uId } });
    const comments = await Comment.findAll({ where: { uId } });

    console.log('>>>>>>>', updatedProfile);

    res.render('profileTest', {
      userData: updatedProfile,
      postData: posts,
      answerData: answers,
      commentData: comments,
    });
  } catch (err) {
    console.log(err);
    res.send('Internet Server Error!!!');
  }
};

// 3) 유저 삭제 (회원탈퇴)
exports.deleteProfile = async (req, res) => {
  try {
    const { uId } = req.params;

    const isDeleted = await User.destroy({
      where: { uId },
    });

    console.log('isDeleted >>>', isDeleted); // 성공 시 1, 실패 시 0

    if (isDeleted) {
      return res.send({ result: true });
    } else {
      return res.send({ result: false });
    }
  } catch (err) {
    console.log(err);
    res.send('Internet Server Error!!!');
  }
};
