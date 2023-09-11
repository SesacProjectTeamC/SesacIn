const { Question, Answer, Comment } = require("../models");

//=== 1. QnA의 Comment - comment ===
// 1) 생성
// 2) 수정
// 3) 삭제

// 댓글 목록 가져오기
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.findAll();
    res.render("question", { commentData: comments });
  } catch (err) {
    console.log(err);
    res.send("Internet Server Error!!!");
  }
};

// 댓글 등록 GET
exports.getCreateComment = async (req, res) => {
  try {
    const { qId } = req.params;

    res.render("commentCreateTest", { data: qId });
  } catch (err) {
    console.error(err);
    res.send("Internal Server Error");
  }
};

// 댓글 등록 POST
exports.postComment = async (req, res) => {
  try {
    // test login
    req.session.user = 1;

    if (!req.session.user) {
      res.redirect("/");
    }
    let loginUser = req.session.user;

    const { content, uId } = req.body;
    const newComment = await Comment.create({
      content,
      uId: loginUser,
    });

    // 특정 질문 가져오기
    const { qId } = req.params;
    const question = await Question.findOne({
      where: { qId },
    });

    if (newComment) {
      return res.send({
        result: true,
        data: question,
        commentData: newComment,
      });
    } else {
      return res.send({ result: false });
    }
  } catch (err) {
    console.error(err);
    res.send("Internal Server Error");
  }
};

// 댓글 수정 GET
exports.getEditComment = async (req, res) => {
  try {
    const { qId, cId } = req.params;

    const comment = await Comment.findOne({
      where: { cId },
    });

    res.render("commentEditTest", { data: qId, commentData: comment });
  } catch (err) {
    console.error(err);
    res.send("Internal Server Error");
  }
};

exports.patchComment = async (req, res) => {
  try {
    const { qId, cId } = req.params;

    const question = await Question.findOne({ where: { qId } });
    const answers = await Answer.findAll({});

    console.log("cId>>>>>>>>>>", cId);
    const { content } = req.body;
    const updatedComment = await Comment.update(
      { content },
      {
        where: { cId },
      },
    );

    if (updatedComment) {
      return res.render("question", {
        result: true,
        data: question,
        answerData: answers,
        commentData: updatedComment,
      });
    } else {
      return res.render("question", { result: false });
    }
  } catch (err) {
    console.log(err);
    res.send("Internet Server Error!!!");
  }
};

// 댓글 삭제하기
exports.deleteComment = async (req, res) => {
  try {
    const { qId, cId } = req.params;

    const isDeleted = await Comment.destroy({
      where: { cId },
    });

    const question = await Question.findOne({ where: { qId } });
    const answers = await Answer.findAll();
    const comments = await Comment.findAll();

    console.log("isDeleted >>>", isDeleted); // 성공 시 1, 실패 시 0

    if (isDeleted) {
      return res.render("question", {
        result: true,
        data: question,
        answerData: answers,
        commentData: comments,
      });
    } else {
      return res.send({ result: false });
    }
  } catch (err) {
    console.log(err);
    res.send("Internet Server Error!!!");
  }
};

//=== 2. board - comment ===
