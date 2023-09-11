const { Question, Answer, Comment } = require('../models');

//=== 1. QnA의 Comment - comment ===
// 1) 생성
// 2) 수정
// 3) 삭제

//-- QnA 답변에 대한 댓글 목록 GET
// 특정 질문과 그 질문에 대한 답변 전체 리스트 가져오기 (Cquestion)
// 특정 답변에 대한 전체 댓글 리스트 가져오기 (Ccomment)
exports.getAnswerComments = async (req, res) => {
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

    res.render('question', {
      data: question,
      answerData: answers,
      commentData: comments,
    });
  } catch (err) {
    console.log(err);
    res.send('Internet Server Error!!!');
  }
};

//-- 댓글 목록 가져오기
// exports.getComments = async (req, res) => {
//   try {
//     const comments = await Comment.findAll();
//     res.render('question', { commentData: comments });
//   } catch (err) {
//     console.log(err);
//     res.send('Internet Server Error!!!');
//   }
// };

// 댓글 등록 GET
exports.getCreateComment = async (req, res) => {
  try {
    const { qId, aId } = req.params;

    res.render('commentCreateTest', { data: qId, answerData: aId });
  } catch (err) {
    console.error(err);
    res.send('Internal Server Error');
  }
};

// 댓글 등록 POST
exports.postComment = async (req, res) => {
  try {
    // test login
    req.session.user = 1;

    if (!req.session.user) {
      res.redirect('/');
    }
    let loginUser = req.session.user;

    const { qId, aId } = req.params;
    const question = await Question.findOne({
      where: { qId },
    });

    const answers = await Question.findAll({
      where: { qId },
    });

    const { content, uId } = req.body;
    const newComment = await Comment.create({
      content,
      uId: loginUser,
      qId: qId,
      aId: aId,
    });

    if (newComment) {
      return res.send({
        result: true,
        data: question,
        answerData: answers,
        commentData: newComment,
      });
    } else {
      return res.send({ result: false });
    }
  } catch (err) {
    console.error(err);
    res.send('Internal Server Error');
  }
};

// 댓글 수정 GET
exports.getEditComment = async (req, res) => {
  try {
    const { qId, aId, cId } = req.params;

    const comment = await Comment.findOne({
      where: { cId },
    });

    res.render('commentEditTest', { data: qId, commentData: comment });
  } catch (err) {
    console.error(err);
    res.send('Internal Server Error');
  }
};

exports.patchComment = async (req, res) => {
  try {
    const { qId, aId, cId } = req.params;

    const question = await Question.findOne({ where: { qId } });
    const answers = await Answer.findAll({});

    const { content } = req.body;
    const updatedComment = await Comment.update(
      { content },
      {
        where: { cId },
      }
    );

    if (updatedComment) {
      return res.render('question', {
        result: true,
        data: question,
        answerData: answers,
        commentData: updatedComment,
      });
    } else {
      return res.render('question', { result: false });
    }
  } catch (err) {
    console.log(err);
    res.send('Internet Server Error!!!');
  }
};

// 댓글 삭제하기
exports.deleteComment = async (req, res) => {
  try {
    const { qId, aId, cId } = req.params;

    const isDeleted = await Comment.destroy({
      where: { cId },
    });

    const question = await Question.findOne({ where: { qId } });
    const answers = await Answer.findAll();
    const comments = await Comment.findAll();

    console.log('isDeleted >>>', isDeleted); // 성공 시 1, 실패 시 0

    if (isDeleted) {
      return res.render('question', {
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
    res.send('Internet Server Error!!!');
  }
};

//=== 2. board - comment ===
