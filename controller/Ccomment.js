const { Comment } = require("../models");
const moment = require("moment");

//=== 댓글 등록 GET ===
exports.getCreateComment = async (req, res) => {
  try {
    const { qId, aId } = req.params;

    res.render("commentCreateTest", { data: qId, answerData: aId });
  } catch (err) {
    console.error(err);
    res.send("Internal Server Error");
  }
};

//=== 댓글 등록 POST ===
exports.postComment = async (req, res) => {
  try {
    let loginUser = req.session.user;

    const { qId, aId } = req.params;

    const { content } = req.body;
    const newComment = await Comment.create({
      content,
      uId: loginUser,
      qId,
      aId,
    });

    const commentCreateAt = moment(newComment.createdAt).format(
      "YYYY-MM-DD HH:mm",
    );

    res.status(200).send({
      result: true,
      commentData: newComment,
      commentCreateAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      result: false,
      msg: "Internal Server Error",
    });
  }
};

//=== 댓글 수정 GET ===
exports.getEditComment = async (req, res) => {
  try {
    const { qId, aId, cId } = req.params;

    const answer = await Comment.findOne({
      where: { aId },
    });

    const comment = await Comment.findOne({
      where: { cId },
    });

    res.render("commentEditTest", {
      data: qId,
      answerData: answer,
      commentData: comment,
    });
  } catch (err) {
    console.error(err);
    res.send("Internal Server Error");
  }
};

//=== 댓글 수정 PATCH ===
exports.patchComment = async (req, res) => {
  try {
    const { cId } = req.params;

    const { content } = req.body;
    const updatedCommentResult = await Comment.update(
      { content },
      {
        where: { cId },
      },
    );

    const updatedComment = await Comment.findByPk(cId);

    if (!content) {
      res
        .status(501)
        .send({ result: false, msg: "댓글에 내용을 입력해 주세요" });
      return;
    }

    // 업데이트 처리 확인 (변경값이 없어도 처리는 된다.)
    if (!updatedCommentResult[0]) {
      res
        .status(502)
        .send({ result: false, msg: "DB 업데이트 서버 에러 발생" });
      return;
    }

    const commentCreateAt = moment(updatedComment.createdAt).format(
      "YYYY-MM-DD HH:mm",
    );

    // 정상 처리
    res.status(200).send({
      result: true,
      commentData: updatedComment,
      commentCreateAt,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internet Server Error!!!");
  }
};

//=== 댓글 삭제하기 ===
exports.deleteComment = async (req, res) => {
  try {
    const { cId } = req.params;

    const isDeleted = await Comment.destroy({
      where: { cId },
    });

    const comments = await Comment.findAll();

    if (isDeleted) {
      return res.send({
        result: true,
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
