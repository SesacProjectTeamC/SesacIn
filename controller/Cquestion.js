const { Question, Answer, Comment, uLike, User, sequelize } = require('../models');
const moment = require('moment');

//=== 메인페이지,질문 목록 가져오기 ===

exports.getQuestions = async (req, res) => {
  // 세션 검사
  let isLogin = req.session.user ? true : false;

  try {
    let page = parseInt(req.params.page) || 1;
    let pageSize = parseInt(req.params.pageSize) || 20;
    let offset = (page - 1) * pageSize;

    let sortField = req.params.sortField || 'createdAt';
    let sortOrder = req.params.sortOrder || 'desc';

    // params 검사
    if (!sortField || !['createdAt', 'likeCount', 'viewCount', 'answerCount'].includes(sortField)) {
      res.status(400).send({ error: '올바른 정렬 필드를 지정하세요.' });
      return;
    }
    if (!sortOrder || !['desc', 'asc'].includes(sortOrder)) {
      res.status(400).json({ error: '올바른 정렬 순서를 지정하세요.' });
      return;
    }

    const questionTotalCount = await Question.count();
    const questionPageCount = parseInt(Math.ceil(questionTotalCount / pageSize)); // 페이지 수 (올림처리)

    // 시퀄라이즈에 SQL 쿼리 그대로 사용
    // offset부터 ~~ offset+pageSize 만큼의 데이터만 불러온다.
    const sql = `
    SELECT q.qId, u.uName, u.uId, u.userImgPath, q.title, q.qType, q.content, q.viewCount, q.likeCount, q.createdAt, q.updatedAt, COALESCE(count(a.aId), 0) as answerCount
      FROM question q
      LEFT JOIN answer a ON q.qId = a.qId
      LEFT JOIN user u ON q.uId = u.uId
      GROUP BY q.qId
      ORDER BY ${sortField} ${sortOrder} 
      LIMIT ${offset}, ${pageSize};`;

    const [paginatedQuestion, metadata] = await sequelize.query(sql);

    // 날짜 데이터 포맷 변경
    const questionCreateAt = [];
    for (q of paginatedQuestion) {
      questionCreateAt.push(moment(q.createdAt).format('YYYY-MM-DD'));
    }

    if (isLogin) {
      const uId = req.session.user;

      const user = await User.findOne({
        where: { uId },
      });

      res.status(200).render('community/listMain', {
        type: 'qna',
        questionData: paginatedQuestion, // question 데이터(20개씩)
        questionCreateAt, // question 데이터에서 CreateAt의 포맷팅을 변경한 데이터
        pageCount: questionPageCount, // 총 몇페이지인지
        questionTotalCount, // 총 질문 개수
        success: true,
        msg: 'QnA 호출 처리 완료',
        // data: paginatedQuestions,
        // pageCount: pageCount,
        // cDate: create,
        isLogin,
        currentLoginUser: uId,
        userData: {
          userImgPath: req.session.userImgPath,
        },
      });
    } else {
      res.render('community/listMain', {
        type: 'qna',
        questionData: paginatedQuestion, // question 데이터(20개씩)
        questionCreateAt, // question 데이터에서 CreateAt의 포맷팅을 변경한 데이터
        pageCount: questionPageCount, // 총 몇페이지인지
        questionTotalCount, // 총 질문 개수
        success: true,
        msg: 'QnA 호출 처리 완료',
        isLogin,
      });
    }
  } catch (err) {
    console.log(err);
    res.send('Internet Server Error!!!');
  }
};

exports.getQuestionsMain = async (req, res) => {
  // 세션 검사
  let isLogin = req.session.user ? true : false;

  try {
    // 한페이지 만큼 데이터 조회
    let page = parseInt(req.params.page) || 1;
    let pageSize = parseInt(req.params.pageSize) || 20;

    // 전체 Question목록 개수 계산
    const questionTotalCount = await Question.count();

    // 페이지 수 (올림처리)
    const pageCount = parseInt(Math.ceil(questionTotalCount / pageSize));

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
      const uId = req.session.user;

      const user = await User.findOne({
        where: { uId },
      });

      res.status(200).render('community/listMain', {
        type: 'qna',
        data: paginatedQuestions,
        pageCount: pageCount,
        questionTotalCount,
        cDate: create,
        isLogin,
        userData: user,
      });
    } else {
      // 비로그인시 처리
      res.render('community/listMain', {
        type: 'qna',
        data: paginatedQuestions,
        pageCount: pageCount,
        questionTotalCount,
        cDate: create,
        isLogin,
      });
    }
  } catch (err) {
    console.log(err);
    res.send('Internet Server Error!!!');
  }
};

//=== 질문 목록 가져오기(페이지별) ===
// /question/list/:page&:pageSize&:sortField&:sortOrder
exports.paginateQuestion = async (req, res) => {
  // 세션 확인
  let isLogin = req.session.user ? true : false;

  try {
    let page = parseInt(req.params.page) || 1;
    let pageSize = parseInt(req.params.pageSize) || 20;
    let offset = (page - 1) * pageSize;

    let sortField = req.params.sortField || 'createdAt';
    let sortOrder = req.params.sortOrder || 'desc';

    // params 검사
    if (!sortField || !['createdAt', 'likeCount', 'viewCount', 'answerCount'].includes(sortField)) {
      res.status(400).send({ error: '올바른 정렬 필드를 지정하세요.' });
      return;
    }
    if (!sortOrder || !['desc', 'asc'].includes(sortOrder)) {
      res.status(400).json({ error: '올바른 정렬 순서를 지정하세요.' });
      return;
    }

    const questionTotalCount = await Question.count();
    const questionPageCount = parseInt(Math.ceil(questionTotalCount / pageSize)); // 페이지 수 (올림처리)

    // 시퀄라이즈에 SQL 쿼리 그대로 사용
    // offset부터 ~~ offset+pageSize 만큼의 데이터만 불러온다.
    const sql = `
    SELECT q.qId, u.uName, u.uId, u.userImgPath, q.title, q.content, q.viewCount, q.likeCount, q.createdAt, q.updatedAt, COALESCE(count(a.aId), 0) as answerCount
      FROM question q
      LEFT JOIN answer a ON q.qId = a.qId
      LEFT JOIN user u ON q.uId = u.uId
      GROUP BY q.qId
      ORDER BY ${sortField} ${sortOrder} 
      LIMIT ${offset}, ${pageSize};`;

    const [paginatedQuestion, metadata] = await sequelize.query(sql);

    // 날짜 데이터 포맷 변경
    const questionCreateAt = [];
    for (q of paginatedQuestion) {
      questionCreateAt.push(moment(q.createdAt).format('YYYY-MM-DD'));
    }

    // 데이터 응답
    res.send({
      questionData: paginatedQuestion, // question 데이터(20개씩)
      questionCreateAt, // question 데이터에서 CreateAt의 포맷팅을 변경한 데이터
      pageCount: questionPageCount, // 총 몇페이지인지
      success: true,
      msg: '페이지별 QnA 질문 호출 처리 완료',
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error: '서버 에러',
    });
  }
};

//=== QnA 특정 질문 상세 페이지 렌더링 GET ===
// 1. 특정 질문과 그 질문에 대한 답변 전체 리스트 가져오기 (Cquestion)
// 2. 특정 답변에 대한 전체 댓글 리스트 가져오기 (Ccomment)
// /question/:qId
exports.getQuestion = async (req, res) => {
  // 세션 검사
  let isLogin = req.session.user ? true : false;

  try {
    const { qId } = req.params;

    // question 데이터 조회
    const question = await Question.findOne({
      where: { qId },
      include: [
        {
          model: User,
          attributes: ['uId', 'uName', 'userImgPath'],
        },
      ],
    });

    // question 날짜 데이터 포맷 변경
    const questionCreateAt = moment(question.createdAt).format('YYYY-MM-DD HH:mm');

    // answers 데이터 조회
    const answers = await Answer.findAll({
      where: { qId },
      include: [
        {
          model: User,
          attributes: ['uId', 'uName', 'userImgPath'],
        },
      ],
      attributes: { exclude: ['title'] }, // title 컬럼을 제외
    });

    // answers 날짜 데이터 포맷 변경
    const answersCreateAt = [];
    for (a of answers) {
      answersCreateAt.push(moment(a.createdAt).format('YYYY-MM-DD HH:mm'));
    }

    // comments 데이터 조회
    const comments = await Comment.findAll({
      where: { qId },
      include: [
        {
          model: User,
          attributes: ['uId', 'uName', 'userImgPath'],
        },
      ],
    });

    // comments 날짜 데이터 포맷 변경
    const commentsCreateAt = [];
    for (c of comments) {
      commentsCreateAt.push(moment(c.createdAt).format('YYYY-MM-DD HH:mm'));
    }

    // 질문 좋아요 초기값을 false로 설정
    let qResultLike = false;
    let uLikeAnswersResult = []; // 답변 좋아요 초기값을 빈 배열로 설정

    if (isLogin) {
      const uId = req.session.user;

      const user = await User.findOne({
        where: { uId },
      });
      // 1) 질문 좋아요
      // [태균] uLike 테이블에서 해당하는 qId에 대한 row데이터를 가져옴
      const uLikeQuestionFind = await uLike.findOne({
        where: {
          qId,
          uId: req.session.user,
        },
      });

      // 질문에 대한 좋아요가 있는지 없는지 확인 결과 (T/F)
      qResultLike = !!uLikeQuestionFind;

      // 2) 여러 개의 답변 좋아요
      // answers = 질문에 달린 복수 답변 전체의 데이터

      for (let i = 0; i < answers.length; i++) {
        // (1) 좋아요 히스토리에서 해당하는 질문에 대한 답변 찾기
        const uLikeAnswersFind = await uLike.findOne({
          where: {
            aId: answers[i].aId,
            uId: req.session.user,
          },
        });

        // (2) 답변의 결과 (T/F)
        const uLikeAnswerFindResult = !!uLikeAnswersFind;

        // (3) 결과 값 리스트에 담기
        uLikeAnswersResult.push(uLikeAnswerFindResult);
      }
      return res.render('community/questionDetail', {
        data: question, // 질문의 데이터와 질문 작성자 데이터
        questionCreateAt, // 질문의 생성일 (포맷을 변경)
        answerData: answers, // 답변의 데이터와 답변 작성자 데이터
        answersCreateAt, // 답변의 생성일 (포맷을 변경)
        commentData: comments, // 질문에 달린 모든 답변에 대한 모든 댓글 데이터와 댓글의 작성자 데이터
        commentsCreateAt, // 댓글의 생성일 (포맷을 변경)
        isLogin,
        currentUser: req.session.user,
        qResult: qResultLike, // 특정 질문에 대한 결과 (T/F)
        aResult: uLikeAnswersResult, // 특정 질문에 대한 답변의 결과
        //+ 답변은 여러 개이므로, 배열로 결과 값을 보냄 ---> ex. [ true, false, false ]
        userData: user,
      });
    }

    // 비로그인 시 동작
    return res.render('community/questionDetail', {
      data: question, // 질문의 데이터와 질문 작성자 데이터
      questionCreateAt, // 질문의 생성일 (포맷을 변경)
      answerData: answers, // 답변의 데이터와 답변 작성자 데이터
      answersCreateAt, // 답변의 생성일 (포맷을 변경)
      commentData: comments, // 질문에 달린 모든 답변에 대한 모든 댓글 데이터와 댓글의 작성자 데이터
      commentsCreateAt, // 댓글의 생성일 (포맷을 변경)
      isLogin,
      currentUser: req.session.user,
      qResult: qResultLike, // 특정 질문에 대한 결과 (T/F)
      aResult: uLikeAnswersResult, // 특정 질문에 대한 답변의 결과
      //+ 답변은 여러 개이므로, 배열로 결과 값을 보냄 ---> ex. [ true, false, false ]
      userData: null,
    });
  } catch (err) {
    console.log(err);
    res.send('Internet Server Error!!!');
  }
};

//=== 조회수 업데이트 ===
exports.viewQuestion = async (req, res) => {
  try {
    const { qId } = req.params;

    const question = await Question.findOne({
      where: { qId },
    });

    await Question.update(
      { viewCount: question.viewCount + 1 },
      {
        where: { qId },
      }
    );

    res.send({ data: question });
  } catch (err) {
    console.log(err);
    res.send('Internet Server Error!!!');
  }
};

//=== 질문 생성 GET ===
// /question/create
exports.getCreateQuestion = async (req, res) => {
  // 세션 검사
  let isLogin = req.session.user ? true : false;

  try {
    const uId = req.session.user;

    const user = await User.findOne({
      where: { uId },
    });

    // 로그인 되어있을때 페이지 렌더링
    res.status(200).render('community/post', {
      isLogin,
      currentUser: req.session.user,
      userData: user,

      data: {
        type: 'qna',
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err); // 상태 코드가 500이면 프론트의 catch에서 처리된다.
  }
};

//=== 질문 생성 POST ===
exports.postQuestion = async (req, res) => {
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
      uId: req.session.user,
    });

    res.send({ result: newQuestion });
  } catch (err) {
    console.error(err);
    res.send('Internal Server Error');
  }
};

//=== 질문 수정 GET ===
// /question/:qId/edit
exports.getEditQuestion = async (req, res) => {
  // 세션 검사
  let isLogin = req.session.user ? true : false;

  const uId = req.session.user;

  const user = await User.findOne({
    where: { uId },
  });

  try {
    const { qId } = req.params;

    const question = await Question.findOne({
      where: { qId },
    });

    res.status(200).render('community/edit', {
      type: 'qna',
      data: question,
      isLogin,
      success: true,
      userData: user,
      currentUser: req.session.user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      isLogin,
      success: false,
      msg: 'Internal Server Error',
    });
  }
};

//=== 질문 수정 PATCH ===
// /question/:qId/edit
exports.patchQuestion = async (req, res) => {
  // 세션 확인
  let isLogin = req.session.user ? true : false;

  try {
    const { qId } = req.params;
    const { title, content, qType } = req.body;

    // 업데이트 전 질문 데이터 조회
    // const before = await Question.findByPk(qId);

    // uid로 게시글 소유자 여부 확인(권한 확인)
    // if (before.dataValues.uId !== req.session.user) {
    //   res.status(401).send({
    //     success: false,
    //     currentLoginUser: req.session.user,
    //     msg: "게시글의 소유자가 아님",
    //   });
    //   return;
    // }

    if (!isLogin) {
      res.status(401).send({
        success: false,
        isLogin,
        userData: user,
        currentLoginUser: req.session.user,
        msg: '로그인 되어있지 않습니다.',
      });
      return;
    }

    // 비어 있는 경우
    if (!title || !content) {
      res.status(400).send({
        success: false,
        isLogin,
        userData: user,
        currentLoginUser: req.session.user,
        msg: '데이터에 빈값이 있습니다.',
      });
    }

    const updatedQuestion = await Question.update(
      { title, content, qType },
      {
        where: { qId },
      }
    );

    //% qType 변경

    res.send({ data: updatedQuestion });
  } catch (err) {
    console.log(err);
    res.send('Internet Server Error!!!');
  }
};

//=== 질문 삭제하기 ===
// /question/:qId/delete
exports.deleteQuestion = async (req, res) => {
  // 세션 검사
  let isLogin = req.session.user ? true : false;

  try {
    const { qId } = req.params;

    const isDeleted = await Question.destroy({
      where: { qId },
    });

    const question = await Question.findOne({ where: { qId } });

    // 삭제 실패 처리
    if (!isDeleted) {
      res.status(404).send({
        result: false,
        isLogin,
        currentUser: req.session.user,
        msg: '질문 게시글이 삭제되지 않았습니다.',
      });
      return;
    }

    // 정상 삭제 처리
    res.send({ result: true, data: question });
  } catch (err) {
    console.log(err);

    res.status(500).send({
      result: false,
      isLogin,
      currentUser: req.session.user,
    });
  }
};

//=== 질문 좋아요 누르기 ===
// PATCH
// /question/:qId
exports.likeQuestion = async (req, res) => {
  // 세션 검사
  let isLogin = req.session.user ? true : false;

  try {
    const { qId } = req.params;

    if (isLogin) {
      const uLikeFind = await uLike.findOne({
        where: {
          qId,
          uId: req.session.user,
        },
      });

      // 잠시 주석처리
      // let resultLike = !!uLikeFind;

      const getQuestion = await Question.findOne({
        where: { qId },
      });

      // 1) uLike findOne -> qId 없으면,
      if (!uLikeFind) {
        // (1) 좋아요 히스토리 생성 : uLike 해당 qId 생성됨.
        await uLike.create({
          uId: req.session.user,
          qId,
        });

        // (2) 질문 likeCount 업데이트 +1
        await Question.update({ likeCount: getQuestion.likeCount + 1 }, { where: { qId } });

        res.send({ data: getQuestion, qResult: true });
      } else {
        // 2) uLike findOne -> qId 있으면,
        // (1) 좋아요 -> uLike 해당 qId 삭제함
        await uLike.destroy({
          where: { qId },
        });

        // (2) 질문 likeCount 업데이트 -1
        await Question.update({ likeCount: getQuestion.likeCount - 1 }, { where: { qId } });

        res.send({ data: getQuestion, qResult: false });
      }
    } else {
      res.send({ isLogin });
    }
  } catch (err) {
    console.log(err);
    res.send('Internet Server Error!!!');
  }
};
