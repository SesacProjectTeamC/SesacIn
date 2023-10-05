const { Question, Answer, uLike, Comment } = require('../models');

//=== 답변 목록 가져오기 ===
exports.getAnswers = async (req, res) => {
  try {
    const answers = await Answer.findAll();
    res.render('questionTest', { answerData: answers });
  } catch (err) {
    console.log(err);
    res.send('Internet Server Error!!!');
  }
};

//=== 답변 등록 GET ===
exports.getCreateAnswer = async (req, res) => {
  try {
    const { qId } = req.params;

    res.render('answerCreateTest', { data: qId });
  } catch (err) {
    console.error(err);
    res.send('Internal Server Error');
  }
};

//=== 답변 등록 POST ===
exports.postAnswer = async (req, res) => {
  try {
    if (!req.session.user) {
      res.redirect('/login');
      return;
    }

    let loginUser = req.session.user;

    const { qId } = req.params;

    const { title, content } = req.body;

    const newAnswer = await Answer.create({
      title,
      content,
      uId: loginUser,
      qId: qId,
    });

    const question = await Question.findOne({
      where: { qId },
    });

    if (newAnswer) {
      return res.send({
        result: true,
        data: question,
        answerData: newAnswer,
      });
    } else {
      return res.send({ result: false });
    }
  } catch (err) {
    console.error(err);
    res.send('Internal Server Error');
  }
};

//=== 답변 수정 GET ===
exports.getEditAnswer = async (req, res) => {
  try {
    const { qId, aId } = req.params;

    const answer = await Answer.findOne({
      where: { aId },
    });

    // 작성자가 아니면 404 화면으로
    if (req.session.user !== answer.uId) {
      return res.render('404');
    }

    res.render('answerEditTest', { data: qId, answerData: answer });
  } catch (err) {
    console.error(err);
    res.send('Internal Server Error');
  }
};

//=== 답변 수정 PATCH ===
exports.patchAnswer = async (req, res) => {
  try {
    const { aId } = req.params;

    const { content } = req.body;

    // 답변 내용이 비어 있는 경우
    if (!content) {
      res.status(400).send({
        success: false,
        isLogin,
        currentLoginUser: req.session.user,
        msg: '데이터에 빈값이 있습니다.',
      });
    }

    const updatedAnswer = await Answer.update(
      { content },
      {
        where: { aId },
      }
    );

    res.send({
      answerData: updatedAnswer,
    });
  } catch (err) {
    console.log(err);
    res.send('Internet Server Error!!!');
  }
};

//=== 답변 삭제하기 ===
exports.deleteAnswer = async (req, res) => {
  try {
    const { aId } = req.params;

    const isDeleted = await Answer.destroy({
      where: { aId },
    });

    const answers = await Answer.findAll();

    if (isDeleted) {
      return res.send({
        result: true,
        answerData: answers,
      });
    } else {
      return res.send({ result: false });
    }
  } catch (err) {
    console.log(err);
    res.send('Internet Server Error!!!');
  }
};

//=== 답변 좋아요 누르기 ===
exports.likeAnswer = async (req, res) => {
  // 세션 검사
  let isLogin = req.session.user || false;

  try {
    const { qId, aId } = req.params;

    const uLikeFind = await uLike.findOne({
      where: {
        aId,
        uId: isLogin,
      },
    });

    const resultLike = !!uLikeFind;

    const getAnswer = await Answer.findOne({
      where: {
        aId,
      },
    });

    // 1) uLike findOne -> 없으면,
    if (!uLikeFind) {
      // (1) 좋아요 히스토리 생성
      await uLike.create({
        uId: isLogin,
        aId,
      });

      // (2) 답변 likeCount 업데이트 +1
      await Answer.update({ likeCount: getAnswer.likeCount + 1 }, { where: { aId } });
    } else if (uLikeFind) {
      // 2) uLike findOne -> 있으면,
      // (1) 좋아요 -> uLike 해당 aId 삭제함
      await uLike.destroy({
        where: {
          aId,
          uId: isLogin,
        },
      });

      // (2) 답변 likeCount 업데이트 -1
      await Answer.update({ likeCount: getAnswer.likeCount - 1 }, { where: { aId } });
    }

    const answers = await Answer.findAll({
      where: { qId },
    });

    //-- 여러 개의 답변 좋아요
    let uLikeAnswersResult = [];
    for (let i = 0; i < answers.length; i++) {
      // (1) 좋아요 히스토리에서 해당하는 질문에 대한 답변 찾기
      const uLikeAnswersFind = await uLike.findOne({
        where: {
          aId: answers[i].aId,
          uId: isLogin,
        },
      });

      // (2) 답변의 결과 (T/F)
      const uLikeAnswerFindResult = !!uLikeAnswersFind;

      // (3) 결과 값 리스트에 담기
      uLikeAnswersResult.push(uLikeAnswerFindResult);
    }

    res.send({
      answerData: uLikeAnswersResult,
      aResult: resultLike,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send('Internet Server Error!!!');
  }
};
