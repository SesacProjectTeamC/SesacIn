const { Question, Answer } = require("../models");

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
    const { title, content, uId } = req.body;
    const newAnswer = await Answer.create({
      title,
      content,
      uId,
    });

    // 특정 질문 가져오기
    const { qId } = req.params;
    const question = await Question.findOne({
      where: { qId },
    });

    if (newAnswer) {
      return res.send({ result: true, data: question, answerData: newAnswer });
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
      });
    } else {
      return res.send({ result: false });
    }
  } catch (err) {
    console.log(err);
    res.send("Internet Server Error!!!");
  }
};
