const { Question, Board, User, sequelize } = require("../models");
const moment = require("moment");

//=== 메인페이지,질문 목록 가져오기 ===
// 메인페이지 렌더링
exports.getMainPage = async (req, res) => {
  // 세션 확인
  let isLogin = req.session.user ? true : false;
  let currentUserId = req.session.user || null;

  try {
    // 페이지 설정
    let page = parseInt(req.params.page) || 1;
    let pageSize = parseInt(req.params.pageSize) || 20;
    let offset = (page - 1) * pageSize;
    let sortField = req.params.sortField || "createdAt";
    let sortOrder = req.params.sortOrder || "desc";

    // 페이지 수 (올림처리)
    const questionTotalCount = await Question.count();
    const questionPageCount = parseInt(
      Math.ceil(questionTotalCount / pageSize),
    );
    const boardTotalCount = await Board.count();
    const boardPageCount = parseInt(Math.ceil(boardTotalCount / pageSize)); // 페이지 수 (올림처리)

    // 데이터 조회
    // 1. 질문
    const questionSql = `
    SELECT q.qId, u.uName, u.uId, u.userImgPath, q.title, q.content, q.viewCount, q.qType, q.likeCount, q.createdAt, q.updatedAt, COALESCE(count(a.aId), 0) as answerCount
      FROM question q
      LEFT JOIN answer a ON q.qId = a.qId
      LEFT JOIN user u ON q.uId = u.uId
      GROUP BY q.qId
      ORDER BY ${sortField} ${sortOrder} 
      LIMIT ${offset}, ${pageSize};`;
    const [paginatedQuestion] = await sequelize.query(questionSql);
    // 2. 자유
    const boardSql = `
    SELECT b.bId, u.uName, u.uId, u.userImgPath, b.title, b.content, b.viewCount, b.likeCount, b.createdAt, b.updatedAt, COALESCE(count(c.cId), 0) as commentCount 
      FROM board b 
      LEFT JOIN comment c ON b.bId = c.bId 
      LEFT JOIN user u ON b.uId = u.uId 
      GROUP BY b.bId 
      ORDER BY ${sortField} ${sortOrder} 
      LIMIT ${offset}, ${pageSize};`;
    const [paginatedBoard] = await sequelize.query(boardSql);

    // 날짜데이터 포맷 변경
    // 1. 질문
    const questionCreateAt = [];
    for (q of paginatedQuestion) {
      questionCreateAt.push(moment(q.createdAt).format("YYYY-MM-DD"));
    }
    // 2. 답변
    // 날짜 데이터 포맷 변경
    const boardCreateAt = [];
    for (b of paginatedBoard) {
      boardCreateAt.push(moment(b.createdAt).format("YYYY-MM-DD"));
    }

    if (isLogin) {
      const uId = req.session.user;

      const user = await User.findOne({
        where: { uId },
      });

      res.status(200).render("main", {
        questionData: paginatedQuestion,
        questionCreateAt,
        questionPageCount,
        boardData: paginatedBoard,
        boardCreateAt,
        boardPageCount,
        isLogin,
        currentUserId,
        success: true,
        userData: user,
      });
    } else {
      res.status(200).render("main", {
        questionData: paginatedQuestion,
        questionCreateAt,
        questionPageCount,
        boardData: paginatedBoard,
        boardCreateAt,
        boardPageCount,
        isLogin,
        currentUserId,
        success: true,
      });
    }
  } catch (err) {
    console.log(err);
    res.send("Internet Server Error!!!");
  }
};
