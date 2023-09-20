const { Question, Answer, Comment } = require('../models');
const moment = require('moment');

//=== 댓글 등록 GET ===
exports.getCreateComment = async (req, res) => {
  try {
    const { qId, aId } = req.params;

    res.render('commentCreateTest', { data: qId, answerData: aId });
  } catch (err) {
    console.error(err);
    res.send('Internal Server Error');
  }
};

//=== 댓글 등록 POST ===
// question/:qId/:aId/comment/create
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

    // 날짜 데이터 포맷 변경
    const commentCreateAt = moment(newComment.createdAt).format('YYYY-MM-DD HH:mm');

    res.status(200).send({
      result: true,
      commentData: newComment,
      commentCreateAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      result: false,
      msg: 'Internal Server Error',
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

    res.render('commentEditTest', {
      data: qId,
      answerData: answer,
      commentData: comment,
    });
  } catch (err) {
    console.error(err);
    res.send('Internal Server Error');
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
      }
    );

    const updatedComment = await Comment.findByPk(cId);

    if (updatedCommentResult[0]) {
      res.status(501).send({ result: false, msg: 'DB에 댓글 업데이트 되지 않음' });
      return;
    } else {
      // 날짜데이터 포맷 수정
      const commentCreateAt = moment(updatedComment.createdAt).format('YYYY-MM-DD HH:mm');

      res.send({
        result: true,
        commentData: updatedComment,
        commentCreateAt,
      });
      return;
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Internet Server Error!!!');
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
    res.send('Internet Server Error!!!');
  }
};
