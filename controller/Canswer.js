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
    // test login
    req.session.user = 1;

    if (!req.session.user) {
      res.redirect('/');
    }
    let loginUser = req.session.user;

    const { qId } = req.params;

    const { title, content, uId } = req.body;

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
        commentData: null,
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

    res.render('answerEditTest', { data: qId, answerData: answer });
  } catch (err) {
    console.error(err);
    res.send('Internal Server Error');
  }
};

//=== 답변 수정 PATCH ===
exports.patchAnswer = async (req, res) => {
  try {
    const { qId, aId } = req.params;

    const { title, content } = req.body;
    const updatedAnswer = await Answer.update(
      { title, content },
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
    const { qId, aId } = req.params;

    const isDeleted = await Answer.destroy({
      where: { aId },
    });

    const question = await Question.findOne({ where: { qId } });
    const answers = await Answer.findAll();

    if (isDeleted) {
      return res.send({
        result: true,
        data: question,
        answerData: answers,
        commentData: null,
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
  try {
    const { qId, aId } = req.params;

    const uLikeFind = await uLike.findOne({
      where: {
        aId,
        // uId
        uId: 1, // 임의 유저 1
      },
    });

    const resultLike = !!uLikeFind;

    console.log('답변 좋아요!!!!!!', resultLike);

    const getAnswer = await Answer.findOne({
      where: {
        aId,
      },
    });

    // 1) uLike findOne -> 없으면,
    if (!uLikeFind) {
      // (1) 좋아요 히스토리 생성
      const createLike = await uLike.create({
        //! uId
        uId: 1, // 임의 유저 1
        aId,
      });

      // (2) 답변 likeCount 업데이트 +1
      const updatedLike = await Answer.update(
        { likeCount: getAnswer.likeCount + 1 },
        { where: { aId } }
      );

      res.send({
        answerData: updatedLike,
        aResult: resultLike,
      });
    } else if (uLikeFind) {
      // 2) uLike findOne -> 있으면,
      // (1) 좋아요 -> uLike 해당 aId 삭제함
      await uLike.destroy({
        where: {
          aId,
          // uId
          uId: 1, // 임의 유저 1
        },
      });

      // (2) 답변 likeCount 업데이트 -1
      const updatedLike = await Answer.update(
        { likeCount: getAnswer.likeCount - 1 },
        { where: { aId } }
      );

      res.send({
        answerData: updatedLike,
        aResult: resultLike,
      });
    }
  } catch (err) {
    console.log(err);
    res.send('Internet Server Error!!!');
  }
};
