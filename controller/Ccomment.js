const { Question, Answer, Comment } = require('../models');

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
    // console.log('받은값', req.body);

    let loginUser = req.session.user;

    const { qId, aId } = req.params;

    const { content } = req.body;
    const newComment = await Comment.create({
      content,
      uId: loginUser,
      qId,
      aId,
    });

    // console.log('보내는값:', newComment);

    res.status(200).send({
      result: true,
      commentData: newComment,
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
    const updatedComment = await Comment.update(
      { content },
      {
        where: { cId },
      }
    );

    if (updatedComment) {
      return res.send({
        result: true,
        commentData: updatedComment,
      });
    } else {
      return res.send({ result: false });
    }
  } catch (err) {
    console.log(err);
    res.send('Internet Server Error!!!');
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
