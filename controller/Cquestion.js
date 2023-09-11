const { Question } = require("../models");

// 질문 목록 가져오기
exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.findAll();
    res.render("index", { type: "", data: questions });
  } catch (err) {
    console.log(err);
    res.send("Internet Server Error!!!");
  }
};

// 질문 생성 GET
exports.getCreateQuestion = async (req, res) => {
  try {
    res.render("questionCreateTest", { data: { type: "자유" } }); // 임시
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

    res.render("question", { result: updatedQuestion });
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
