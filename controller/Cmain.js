const { Question, Answer, Comment, uLike } = require('../models');
const moment = require('moment');

//=== 메인페이지,질문 목록 가져오기 ===
// URL : localhost:8000/
exports.getMainPage = async (req, res) => {
  // 세션 확인
  let isLogin = req.session.user ? true : false;

  try {
    // 한페이지 만큼 데이터 조회
    let page = parseInt(req.params.page) || 1;
    let pageSize = parseInt(req.params.pageSize) || 20;

    // 전체 Question목록 개수 계산
    const totalPage = await Question.count();

    // 페이지 수 (올림처리)
    const pageCount = parseInt(Math.ceil(totalPage / pageSize));

    // 페이지별 Question호출
    const paginatedQuestions = await Question.findAll({
      order: [['createdAt', 'DESC']], // 정렬 기준
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });

    // 날짜 데이터 포맷 변경
    const create = [];

    for (q of paginatedQuestions) {
      create.push(moment(q.createdAt).format('YYYY-MM-DD'));
    }

    if (isLogin) {
      console.log('로그인O 사용자 >>>', req.session.user);

      res.status(200).render('main', {
        // boardData: // Board 데이터(20개씩)
        // boardDataCreateAt: , // Board 데이터에서 CreateAt의 포맷팅을 변경한 데이터
        // boardDatauName: // Board 데이터에서 uname을 가져와서
        // boardDataCommentCount: // Board 데이터에서 CommentCount을 가져와서

        // questionData: , // question 데이터(20개씩)
        // questionDataCreateAt: , // question 데이터에서 CreateAt의 포맷팅을 변경한 데이터
        // questionDatauName: // question 데이터에서 uname을 가져와서
        // questionDataCommentCount: // question 데이터에서 CommentCount을 가져와서

        isLogin,
      });
    } else {
      console.log('로그인X');

      res.render('main', {
        type: 'qna',
        data: paginatedQuestions,
        pageCount: pageCount,
        cDate: create,
        isLogin,
      });
    }
  } catch (err) {
    console.log(err);
    res.send('Internet Server Error!!!');
  }
};
