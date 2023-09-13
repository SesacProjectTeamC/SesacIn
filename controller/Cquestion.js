const { Question, Answer, Comment, uLike } = require('../models');
const viewCount = 0;
const moment = require('moment');

// 메인페이지,질문 목록 가져오기
exports.getQuestions = async (req, res) => {
  // 테스트를 위해 로그인한 유저를 정해놓음
  // req.session.user = 'aassddff1';

  try {
    console.log('사용자 >>>', req.session.user);

    const { type } = req.query;

    let questions = await Question.findAll();

    const create = [];

    for (q of questions) {
      create.push(moment(q.createdAt).format('YYYY-MM-DD'));
    }
    if (type) {
      res.send({ type: 'qna', data: questions, cDate: create });
    } else {
      res.render('index', { type: 'qna', data: questions, cDate: create });
    }
  } catch (err) {
    console.log(err);
    res.send('Internet Server Error!!!');
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

    prevQuestionLikeCount = question.likeCount;

    const answers = await Answer.findAll({
      where: { qId },
    });

    prevAnswersLikeCount = [];

    for (let i = 0; i < answers.length; i++) {
      prevAnswersLikeCount.push(answers[i].likeCount);
    }

    const comments = await Comment.findAll({
      where: { qId },
    });

    // viewCount += 1;

    res.render('question', {
      data: question,
      answerData: answers,
      commentData: comments,
      prevQuestionLikeCount,
      prevAnswersLikeCount,
      // viewCount,
    });
  } catch (err) {
    console.log(err);
    res.send('Internet Server Error!!!');
  }
};

// 질문 생성 GET
exports.getCreateQuestion = async (req, res) => {
  try {
    res.render('post', { data: { type: 'qna' } }); // 임시
  } catch (err) {
    console.error(err);
    res.send('Internal Server Error');
  }
};

// 질문 생성 POST
exports.postQuestion = async (req, res) => {
  // test login
  req.session.user = 1;

  if (!req.session.user) {
    res.redirect('/');
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
    console.log('추가>>>', { result: newQuestion });
    res.send({ result: newQuestion });
  } catch (err) {
    console.error(err);
    res.send('Internal Server Error');
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

    res.render('questionEditTest', { data: question });
  } catch (err) {
    console.error(err);
    res.send('Internal Server Error');
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

    res.render('question', {
      data: updatedQuestion,
      answerData: answers,
      commentData: comments,
    });
  } catch (err) {
    console.log(err);
    res.send('Internet Server Error!!!');
  }
};

// 질문 삭제하기
exports.deleteQuestion = async (req, res) => {
  try {
    const { qId } = req.params;

    const isDeleted = await Question.destroy({
      where: { qId },
    });

    console.log('isDeleted >>>', isDeleted); // 성공 시 1, 실패 시 0

    if (isDeleted) {
      return res.send({ result: true });
    } else {
      return res.send({ result: false });
    }
  } catch (err) {
    console.log(err);
    res.send('Internet Server Error!!!');
  }
};

//-- 좋아요 누르기
exports.likeQuestion = async (req, res) => {
  try {
    const { qId } = req.params;

    const uLikeFind = await uLike.findOne({ where: { qId } });

    const getQuestion = await Question.findOne({
      where: { qId },
    });

    // 1) uLike findOne -> qId 없으면,
    if (!uLikeFind) {
      //-- 좋아요 -> uLike 해당 qId 생성됨.
      // (1) 좋아요 히스토리 생성
      const createLike = await uLike.create({
        // uId
        uId: 1, // 임의 유저 1
        qId,
      });
      // (2) 질문 likeCount 업데이트
      const updatedLike = await Question.update(
        { likeCount: getQuestion.likeCount + 1 },
        { where: { qId } }
      );
      const answers = await Answer.findOne({ where: { qId } });
      const comments = await Comment.findOne({ where: { qId } });
      return res.render('question', {
        data: updatedLike,
        answerData: answers,
        commentData: comments,
      });
    } else if (uLikeFind) {
      // 2) uLike findOne -> qId 있으면,
      // (1) 좋아요 -> uLike 해당 qId 삭제함
      const deleteLike = await uLike.destroy({
        where: { qId },
      });

      // (2) 질문 likeCount 업데이트
      const updatedLike = await Question.update(
        { likeCount: getQuestion.likeCount - 1 },
        { where: { qId } }
      );

      const answers = await Answer.findOne({ where: { qId } });
      const comments = await Comment.findOne({ where: { qId } });

      res.render('question', {
        data: updatedLike,
        answerData: answers,
        commentData: comments,
      });
    }
  } catch (err) {
    console.log(err);
    res.send('Internet Server Error!!!');
  }
};
