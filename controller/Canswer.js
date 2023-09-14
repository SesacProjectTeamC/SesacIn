const { Question, Answer, uLike } = require("../models");
// 답변 목록 가져오기
exports.getAnswers = async (req, res) => {
  try {
    const answers = await Answer.findAll();
    res.render("question", { answerData: answers });
  } catch (err) {
    console.log(err);
    res.send("Internet Server Error!!!");
  }
};

// 답변 등록 GET
exports.getCreateAnswer = async (req, res) => {
  try {
    const { qId } = req.params;

    res.render("answerCreateTest", { data: qId });
  } catch (err) {
    console.error(err);
    res.send("Internal Server Error");
  }
};

// 답변 등록 POST
exports.postAnswer = async (req, res) => {
  try {
    // test login
    req.session.user = 1;

    if (!req.session.user) {
      res.redirect("/");
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

    // 특정 질문 가져오기
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
    res.send("Internal Server Error");
  }
};

// 답변 수정 GET
exports.getEditAnswer = async (req, res) => {
  try {
    const { qId, aId } = req.params;

    const answer = await Answer.findOne({
      where: { aId },
    });

    res.render("answerEditTest", { data: qId, answerData: answer });
  } catch (err) {
    console.error(err);
    res.send("Internal Server Error");
  }
};

exports.patchAnswer = async (req, res) => {
  try {
    const { qId, aId } = req.params;

    const question = await Question.findOne({ where: { qId } });

    const { title, content } = req.body;
    const updatedAnswer = await Answer.update(
      { title, content },
      {
        where: { aId },
      },
    );

    if (updatedAnswer) {
      return res.render("question", {
        result: true,
        data: question,
        answerData: updatedAnswer,
        commentData: null,
      });
    } else {
      return res.render("question", { result: false });
    }
  } catch (err) {
    console.log(err);
    res.send("Internet Server Error!!!");
  }
};

// 답변 삭제하기
exports.deleteAnswer = async (req, res) => {
  try {
    const { qId, aId } = req.params;

    const isDeleted = await Answer.destroy({
      where: { aId },
    });

    const question = await Question.findOne({ where: { qId } });
    const answers = await Answer.findAll();

    console.log("isDeleted >>>", isDeleted); // 성공 시 1, 실패 시 0

    if (isDeleted) {
      return res.render("question", {
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
    res.send("Internet Server Error!!!");
  }
};

// 답변 좋아요
//!! 답변 좋아요 기능 수정
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

    const getAnswer = await Answer.findOne({
      where: {
        aId,
      },
    });

    // console.log(getAnswer);
    // const aId = getAnswer.aId;

    // 1) uLike findOne -> 없으면,
    if (!uLikeFind) {
      // (1) 좋아요 히스토리 생성
      const createLike = await uLike.create({
        //! uId
        uId: 1, // 임의 유저 1
        aId,
      });

      // (2) 답변 likeCount 업데이트
      const updatedLike = await Answer.update(
        { likeCount: getAnswer.likeCount + 1 },
        { where: { aId } },
      );

      const question = await Question.findOne({ where: { qId } });

      const comments = await Comment.findOne({ where: { qId } });

      res.render("question", {
        data: question,
        answerData: updatedLike,
        commentData: comments,
      });
    } else if (uLikeFind) {
      // 2) uLike findOne -> 있으면,
      // (1) 좋아요 -> uLike 해당 aId 삭제함
      const deleteLike = await uLike.destroy({
        where: {
          aId,
          // uId
          uId: 1, // 임의 유저 1
        },
      });

      console.log("xxxxxxxx", deleteLike);

      // (2) 답변 likeCount 업데이트
      const updatedLike = await Answer.update(
        { likeCount: getAnswer.likeCount - 1 },
        { where: { aId } },
      );

      const question = await Question.findOne({ where: { qId } });
      const comments = await Comment.findAll({ where: { qId } });

      res.render("question", {
        data: question,
        answerData: updatedLike,
        commentData: comments,
      });
    }
  } catch (err) {
    console.log(err);
    res.send("Internet Server Error!!!");
  }
};
