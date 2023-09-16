const { Question, Board, Answer, Comment, uLike, User } = require('../models');
const moment = require('moment');

//=== 메인페이지,질문 목록 가져오기 ===
// URL : localhost:8000/
exports.getMainPage = async (req, res) => {
  // 세션 확인
  let isLogin = req.session.user ? true : false;
  let currentUserId = req.session.user || null;
  console.log('로그인 유저 >>>', req.session.user);

  try {
    // 페이지 설정
    let page = parseInt(req.params.page) || 1;
    let pageSize = parseInt(req.params.pageSize) || 20;
    const questionTotalCount = await Question.count();
    const questionPageCount = parseInt(Math.ceil(questionTotalCount / pageSize)); // 페이지 수 (올림처리)
    const boardTotalCount = await Board.count();
    const boardPageCount = parseInt(Math.ceil(boardTotalCount / pageSize)); // 페이지 수 (올림처리)

    // 페이지별 Question 데이터 조회
    const paginatedQuestion = await Question.findAll({
      order: [['createdAt', 'DESC']], // 정렬 기준
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });

    // 페이지별 Board 호출
    const paginatedBoard = await Board.findAll({
      order: [['createdAt', 'DESC']], // 정렬 기준
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });

    // QnA & Board. createdAt 포맷 변경 후 배열에 저장
    const questionCreateAt = [];
    for (q of paginatedQuestion) {
      questionCreateAt.push(moment(q.dataValues.createdAt).format('YYYY-MM-DD'));
    }
    const boardCreateAt = [];
    for (b of paginatedBoard) {
      boardCreateAt.push(moment(b.dataValues.createdAt).format('YYYY-MM-DD'));
    }

    // QnA & Board. uNname 배열에 저장
    const questionUserName = [];
    for (q of paginatedQuestion) {
      // User 모델로 uid가지고 uName 가져오기
      const user = await User.findByPk(q.uId);
      questionUserName.push(user.uName);
    }
    const boardUserName = [];
    for (b of paginatedBoard) {
      // User 모델로 uid가지고 uName 가져오기
      const user = await User.findByPk(b.uId);
      boardUserName.push(user.uName);
    }

    // QnA & Board. Comment 배열에 저장 후 총 갯수 계산
    const questionCommentCount = [];
    for (q of paginatedQuestion) {
      // Comment 모델로 qid가지고 count 세기
      const count = await Comment.count({
        where: {
          qId: q.qId,
        },
      });
      questionCommentCount.push(count);
    }
    const boardCommentCount = [];
    for (b of paginatedBoard) {
      // Comment 모델로 bid가지고 count 세기
      const count = await Comment.count({
        where: {
          bId: b.qId,
        },
      });
      boardCommentCount.push(count);
    }

    // res.status(200).render('mainTest', {
    res.status(200).render('main', {
      questionData: paginatedQuestion, // question 데이터(20개씩)
      questionCreateAt, // question 데이터에서 CreateAt의 포맷팅을 변경한 데이터
      questionUserName, // question 데이터에서 uname을 가져와서
      questionCommentCount, // question 데이터에서 CommentCount을 가져와서
      boardData: paginatedBoard, // Board 데이터(20개씩)
      boardCreateAt, // Board 데이터에서 CreateAt의 포맷팅을 변경한 데이터
      boardUserName, // Board 데이터에서 uname을 가져와서
      boardCommentCount, // Board 데이터에서 CommentCount을 가져와서
      isLogin,
      currentUserId,
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.send('Internet Server Error!!!');
  }
};
