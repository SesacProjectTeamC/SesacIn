const { Question, Answer, Comment, uLike } = require("../models");
const moment = require("moment");

// 메인페이지,질문 목록 가져오기
exports.getQuestions = async (req, res) => {
  // 세션 검사
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
      order: [["createdAt", "DESC"]], // 정렬 기준
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });

    // 날짜 데이터 포맷 변경
    const create = [];

    for (q of paginatedQuestions) {
      create.push(moment(q.createdAt).format("YYYY-MM-DD"));
    }

    if (isLogin) {
      console.log("로그인O 사용자 >>>", req.session.user);

      res.status(200).render("index", {
        type: "qna",
        data: paginatedQuestions,
        pageCount: pageCount,
        cDate: create,
        isLogin,
      });
    } else {
      console.log("로그인X");

      res.render("index", {
        type: "qna",
        data: paginatedQuestions,
        pageCount: pageCount,
        cDate: create,
        isLogin,
      });
    }
  } catch (err) {
    console.log(err);
    res.send("Internet Server Error!!!");
  }
};

// 질문 목록 가져오기(페이지별)
exports.paginateQuestion = async (req, res) => {
  let page = parseInt(req.params.page) || 1;
  let pageSize = parseInt(req.params.pageSize) || 20;

  try {
    // 전체 Question목록 개수 계산
    const totalPage = await Question.count();

    // 페이지 수 (올림처리)
    const pageCount = parseInt(Math.ceil(totalPage / pageSize));

    // 페이지에 해당하는 Question 데이터 조회
    const paginatedQuestions = await Question.findAll({
      //최신글 정렬
      order: [["createdAt", "DESC"]],
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });

    // 날짜 데이터 포맷 변경
    const create = [];
    for (q of paginatedQuestions) {
      create.push(moment(q.dataValues.createdAt).format("YYYY-MM-DD"));
    }

    res.send({
      questions: paginatedQuestions,
      pageCount,
      cDate: create,
      msg: "페이지별 Question 호출 처리 완료",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error: "서버 에러",
    });
  }
};

//-- QnA 특정 질문 상세 페이지 GET
// 특정 질문과 그 질문에 대한 답변 전체 리스트 가져오기 (Cquestion)
// 특정 답변에 대한 전체 댓글 리스트 가져오기 (Ccomment)
exports.getQuestion = async (req, res) => {
  // 세션 검사
  let isLogin = req.session.user ? true : false;

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

    // 1) uLike findOne -> qId 없으면,
    // if (!uLikeFind) {

    //   const answers = await Answer.findOne({ where: { qId } });
    //   const comments = await Comment.findOne({ where: { qId } });
    //   return res.render('question', {
    //     data: updatedLike,
    //     answerData: answers,
    //     commentData: comments,
    //     result: true,
    //   });
    // } else if (uLikeFind) {

    //   const answers = await Answer.findOne({ where: { qId } });
    //   const comments = await Comment.findOne({ where: { qId } });

    //   res.render('question', {
    //     data: updatedLike,
    //     answerData: answers,
    //     commentData: comments,
    //     result: false,
    //   });

    // 좋아요
    const uLikeFind = await uLike.findOne({
      where: {
        qId,
        //! uId
        uId: 1, // 임의 유저 1
      },
    });

    const resultLike = !!uLikeFind; // uLikeFind가 존재하면 true, 아니면 false

    console.log(resultLike);

    // 조회수 업데이트
    const updatedQuestion = await Question.update(
      { viewCount: question.viewCount + 1 },
      {
        where: { qId },
      },
    );

    // 조회수 업데이트 성공
    if (updatedQuestion) {
      const updatedQuestion = await Question.findOne({
        where: { qId },
      });

      res.render("questionTest", {
        data: updatedQuestion,
        answerData: answers,
        commentData: comments,
        isLogin,
        currentUser: req.session.user,
        qResult: resultLike,
        aResult: null,
      });

      //~ 수정 여부 재확인
    } else {
      res.render("questionTest", {
        data: question,
        answerData: answers,
        commentData: comments,
        isLogin,
        currentUser: req.session.user,
        qResult: resultLike,
        aResult: null,
      });
    }
  } catch (err) {
    console.log(err);
    res.send("Internet Server Error!!!");
  }
};

// 질문 생성 GET
exports.getCreateQuestion = async (req, res) => {
  // 세션 검사
  let isLogin = req.session.user ? true : false;

  try {
    if (!isLogin) {
      // 로그인 안한상태에서 QnA 글쓰기 페이지를 요청하면 로그인 페이지로 리다이렉트
      res.status(301).redirect("/login");
    } else {
      // 로그인 되어있을때 페이지 렌더링
      res.status(200).render("post", {
        isLogin,
        currentUser: req.session.user,
        data: {
          type: "qna",
        },
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(err); // 상태 코드가 500이면 프론트의 catch에서 처리된다.
  }
};

// 질문 생성 POST
exports.postQuestion = async (req, res) => {
  // test login
  req.session.user = 1;

  if (!req.session.user) {
    res.redirect("/");
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
    console.log("추가>>>", { result: newQuestion });
    res.send({ result: newQuestion });
  } catch (err) {
    console.error(err);
    res.send("Internal Server Error");
  }
};

// 질문 수정 GET
exports.getEditQuestion = async (req, res) => {
  // 세션 검사
  let isLogin = req.session.user ? true : false;

  try {
    const { qId } = req.params;

    // 특정 질문만 가져오기
    const question = await Question.findOne({
      where: { qId },
    });

    res.status(200).render("questionEditTest", {
      data: question,
      isLogin,
      success: true,
      currentUser: req.session.user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      isLogin,
      success: false,
      msg: "Internal Server Error",
    });
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
      },
    );

    console.log("::::::::", updatedQuestion);

    const answers = await Answer.findAll({ where: { qId } });
    const comments = await Comment.findAll({ where: { qId } });

    if (updatedQuestion) {
      res.render("questionTest", {
        data: updatedQuestion,
        answerData: answers,
        commentData: comments,
      });
    }
  } catch (err) {
    console.log(err);
    res.send("Internet Server Error!!!");
  }
};

// 질문 삭제하기
exports.deleteQuestion = async (req, res) => {
  // 세션 검사
  let isLogin = req.session.user ? true : false;

  try {
    if (isLogin) {
      const { qId } = req.params;

      const isDeleted = await Question.destroy({
        where: { qId },
      });

      console.log("isDeleted >>>", isDeleted); // 성공 시 1, 실패 시 0

      if (isDeleted) {
        return res.status(200).send({
          result: true,
          isLogin,
          currentUser: req.session.user,
          success: true,
        });
      } else {
        return res.status(500).send({
          result: false,
          isLogin,
          currentUser: req.session.user,
          success: false,
        });
      }
    } else {
      res.status(401).send({
        isLogin,
        currentUser: req.session.user,
        success: false,
      });
    }
  } catch (err) {
    console.log(err);
    res.send("Internet Server Error!!!");
  }
};

//-- 좋아요 누르기
exports.likeQuestion = async (req, res) => {
  try {
    const { qId } = req.params;

    const uLikeFind = await uLike.findOne({
      where: {
        qId,
        //! uId
        uId: 1, // 임의 유저 1
      },
    });

    const resultLike = !!uLikeFind; // uLikeFind가 존재하면 true, 아니면 false

    const getQuestion = await Question.findOne({
      where: { qId },
    });

    //~~~
    // 조회수 업데이트
    // const getQuestion = await Question.findOne({
    //   where: { qId },
    // });

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
        { where: { qId } },
      );

      const answers = await Answer.findAll({ where: { qId } });
      const comments = await Comment.findAll({ where: { qId } });
      return res.render("questionTest", {
        data: updatedLike,
        answerData: answers,
        commentData: comments,
        qResult: resultLike,
        aResult: null,
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
        { where: { qId } },
      );

      const updatedQuestion = await Question.update(
        { likeCount: updatedLike.viewCount - 1 },
        { where: { qId } },
      );

      const answers = await Answer.findOne({ where: { qId } });
      const comments = await Comment.findOne({ where: { qId } });

      res.render("questionTest", {
        data: updatedQuestion,
        answerData: answers,
        commentData: comments,
        qResult: resultLike,
        aResult: null,
      });
    }
  } catch (err) {
    console.log(err);
    res.send("Internet Server Error!!!");
  }
};
