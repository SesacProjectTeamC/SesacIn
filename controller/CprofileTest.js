const { User, Question, Answer, Comment, Board, uLike } = require('../models');

exports.getHistory = async (req, res) => {
  // 세션 검사
  let isLogin = req.session.user ? true : false;

  try {
    // 임의 유저 1
    const uId = 1;

    // 유저 정보
    const user = await User.findOne({
      where: {
        uId,
      },
    });

    //-- 좋아요 클릭 게시글 가져오기
    const likes = await uLike.findAll({ where: { uId } });

    // 좋아요 누른 질문
    const likeQuestion = await Question.findAll({
      where: { qId: likes.map((like) => like.qId) },
    });

    // 좋아요 누른 답변
    const likeAnswer = await Answer.findAll({
      where: { aId: likes.map((like) => like.aId) },
    });

    //-- 작성한 질문 가져오기
    const posts = await Question.findAll({ where: { uId } });

    //-- 작성한 답변 가져오기
    const answers = await Answer.findAll({ where: { uId } });

    //-- 작성한 댓글 가져오기
    const comments = await Comment.findAll({ where: { uId } });

    // 사용자 정보를 마이페이지 템플릿에 전달하여 렌더링합니다.
    res.render('myPage', {
      userData: user,
      likeQuestionData: likeQuestion,
      likeAnswerData: likeAnswer,
      postData: posts,
      answerData: answers,
      commentData: comments,
      isLogin,
      currentUser: req.session.user,
      success: true,
    });
  } catch (err) {
    // 기타 데이터베이스 오류
    console.log(err);
    res.status(500).send({
      isLogin,
      currentUser: req.session.user,
      success: false,
      msg: '서버 에러',
    });
  }
};
