const { Question, Answer, Comment } = require("../models");

// 질문 목록 가져오기
exports.getQuestions = async (req, res) => {
  try {
    const { type } = req.query;
    if (type) {
      const questions = await Question.findAll();
      res.send({ type: "qna", data: questions });
    } else {
      const questions = await Question.findAll();
      res.render("index", { type: "qna", data: questions });
    }
  } catch (err) {
    console.log(err);
    res.send("Internet Server Error!!!");
  }
};

//-- QnA 특정 질문 상세 페이지 GET
// 특정 질문과 그 질문에 대한 답변 전체 리스트 가져오기 (Cquestion)
// 특정 답변에 대한 전체 댓글 리스트 가져오기 (Ccomment)
exports.getQuestion = async (req, res) => {
  try {
    const { qId } = req.params;

    const question = await Question.findOne({
      where: { qId },
    });

    const answers = await Answer.findAll({
      where: { qId },
    });

    const comments = await Comment.findAll({
      where: { qId },
    });

    res.render("question", {
      data: question,
      answerData: answers,
      commentData: comments,
    });
  } catch (err) {
    console.log(err);
    res.send("Internet Server Error!!!");
  }
};

// 질문 생성 GET
exports.getCreateQuestion = async (req, res) => {
  try {
    res.render("post", { data: { type: "qna" } }); // 임시
  } catch (err) {
    console.error(err);
    res.send("Internal Server Error");
  }
};

// 질문 생성 POST
exports.postQuestion = async (req, res) => {
  // test login
  req.session.user = 1;

  if (!req.session.user) {
    res.redirect("/");
  }
  let loginUser = req.session.user;

  try {
    const { title, content, qType } = req.body;
    const newQuestion = await Question.create({
      title,
      content,
      viewCount: 0,
      likeCount: 0,
      qType,
      uId: loginUser,
    });
    console.log("추가>>>", { result: newQuestion });
    res.send({ result: newQuestion });
  } catch (err) {
    console.error(err);
    res.send("Internal Server Error");
  }
};

// 질문 수정 GET
exports.getEditQuestion = async (req, res) => {
  try {
    const { qId } = req.params;

    // 특정 질문만 가져오기
    const question = await Question.findOne({
      where: { qId },
    });

    res.render("questionEditTest", { data: question });
  } catch (err) {
    console.error(err);
    res.send("Internal Server Error");
  }
};

// 질문 수정 PATCH
exports.patchQuestion = async (req, res) => {
  try {
    const { qId } = req.params;
    const { title, content } = req.body;

    const updatedQuestion = await Question.update(
      { title, content },
      {
        where: { qId },
      }
    );

    const answers = await Answer.findOne({ where: { qId } });
    const comments = await Comment.findOne({ where: { qId } });

    res.render("question", {
      data: updatedQuestion,
      answerData: answers,
      commentData: comments,
    });
  } catch (err) {
    console.log(err);
    res.send("Internet Server Error!!!");
  }
};

// 질문 삭제하기
exports.deleteQuestion = async (req, res) => {
  try {
    const { qId } = req.params;

    const isDeleted = await Question.destroy({
      where: { qId },
    });

    console.log("isDeleted >>>", isDeleted); // 성공 시 1, 실패 시 0

    if (isDeleted) {
      return res.send({ result: true });
    } else {
      return res.send({ result: false });
    }
  } catch (err) {
    console.log(err);
    res.send("Internet Server Error!!!");
  }
};
