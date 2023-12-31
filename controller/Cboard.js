const { Board, Comment, uLike, User, sequelize } = require("../models/index");
const moment = require("moment");
const session = require("express-session");

// 게시글 메인
exports.getBoardMain = async (req, res) => {
  // 세션 확인
  let isLogin = req.session.user ? true : false;

  try {
    let page = parseInt(req.params.page) || 1;
    let pageSize = parseInt(req.params.pageSize) || 20;
    let offset = (page - 1) * pageSize;

    let sortField = req.params.sortField || "createdAt";
    let sortOrder = req.params.sortOrder || "desc";

    // params 검사
    if (
      !sortField ||
      !["createdAt", "likeCount", "viewCount", "commentCount"].includes(
        sortField,
      )
    ) {
      res.status(400).send({ error: "올바른 정렬 필드를 지정하세요." });
      return;
    }
    if (!sortOrder || !["desc", "asc"].includes(sortOrder)) {
      res.status(400).json({ error: "올바른 정렬 순서를 지정하세요." });
      return;
    }

    const boardTotalCount = await Board.count();
    // 페이지 수 (올림처리)
    const boardPageCount = parseInt(Math.ceil(boardTotalCount / pageSize));

    // 시퀄라이즈에 SQL 쿼리 그대로 사용
    const sql = `
    SELECT b.bId, u.uName, u.uId, u.userImgPath, b.title, b.content, b.viewCount, b.likeCount, b.createdAt, b.updatedAt, COALESCE(count(c.cId), 0) as commentCount 
      FROM board b 
      LEFT JOIN comment c ON b.bId = c.bId 
      LEFT JOIN user u ON b.uId = u.uId 
      GROUP BY b.bId 
      ORDER BY ${sortField} ${sortOrder} 
      LIMIT ${offset}, ${pageSize};`;

    // 페이징 처리된 Board 데이터 조회
    const [paginatedBoard, metadata] = await sequelize.query(sql);

    // 날짜 데이터 포맷 변경
    const boardCreateAt = [];
    for (b of paginatedBoard) {
      boardCreateAt.push(moment(b.createdAt).format("YYYY-MM-DD"));
    }

    // 로그인시 처리
    if (isLogin) {
      const uId = req.session.user;

      const userData = await User.findOne({
        where: { uId },
      });

      res.render("community/listMain", {
        type: "board",
        boardData: paginatedBoard, // 페이징 처리된 Board 데이터
        boardCreateAt, // Board 데이터에서 CreateAt의 포맷팅을 변경한 데이터
        pageCount: boardPageCount, // 총 몇페이지인지
        success: true,
        msg: "페이지별 게시글 호출 처리 완료",
        isLogin,
        currentLoginUser: uId,
        userData: { userImgPath: req.session.userImgPath },
      });
    } else {
      // 비로그인시 처리
      res.render("community/listMain", {
        type: "board",
        boardData: paginatedBoard, // 페이징 처리된 Board 데이터
        boardCreateAt, // Board 데이터에서 CreateAt의 포맷팅을 변경한 데이터
        pageCount: boardPageCount, // 총 몇페이지인지
        success: true,
        msg: "페이지별 게시글 호출 처리 완료",
        isLogin,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error: "서버 에러",
    });
  }
};

// 새 게시글 생성 페이지 렌더링
// /board/create
exports.newBoardPage = async (req, res) => {
  // 세션 검사
  let isLogin = req.session.user ? true : false;

  try {
    const uId = req.session.user;

    const user = await User.findOne({
      where: { uId },
    });

    res.status(200).render("community/post", {
      success: true,
      isLogin,
      userData: user,

      currentLoginUser: req.session.user,
      msg: "페이지 렌더링 정상 처리",
      data: {
        type: "자유",
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      isLogin,
      currentLoginUser: req.session.user,
      msg: "서버에러 발생",
    });
  }
};

// 개별 게시글 페이지 렌더링
// board/detail/:bId
exports.detailBoard = async (req, res) => {
  // 세션 확인
  let isLogin = req.session.user ? true : false;

  try {
    // req 데이터 검사
    const { bId } = req.params;
    if (!req.params.bId) {
      res.status(404).send({
        success: false,
        isLogin,
        msg: "전달받은 bId 값이 없음",
      });
      return;
    }

    // 게시글 데이터 조회
    const boardSql = `SELECT b.*, u.uId, u.uName, u.userImgPath
    FROM board b
    INNER JOIN user u ON b.uId = u.uId
    WHERE b.bId = ${bId};`;
    const [eachBoard] = await sequelize.query(boardSql);

    // 게시글의 날짜 데이터 포맷 변경
    const create = moment(eachBoard.createdAt).format("YYYY-MM-DD HH:mm");

    // 댓글 데이터 조회
    const commentSql = `SELECT c.*, u.uId, u.uName, u.userImgPath
    FROM comment c
    INNER JOIN user u ON c.uId = u.uId
    WHERE c.bId = ${bId}
    ORDER BY c.createdAt desc;`;
    const [allComment] = await sequelize.query(commentSql);

    // 댓글의 날짜 데이터 포맷 변경
    const commentCreateAt = [];
    for (c of allComment) {
      commentCreateAt.push(moment(c.createdAt).format("YYYY-MM-DD HH:mm"));
    }

    // 1. 좋아요
    // 1) 좋아요 히스토리 찾기
    let uLikeFind;

    if (isLogin) {
      const uId = req.session.user;

      const user = await User.findOne({
        where: { uId },
      });

      uLikeFind = await uLike.findOne({
        where: {
          bId,
          //! uId
          uId: req.session.user, // 로그인 유저
        },
      });
      const resultLike = isLogin ? !!uLikeFind : false;

      res.status(200).render("community/boardDetail", {
        success: true,
        isLogin,
        currentLoginUser: req.session.user,
        msg: "페이지 렌더링 정상 처리",
        boardData: eachBoard[0],
        userData: user,
        cDate: create,
        commentData: allComment,
        commentCreateAt,
        bResult: resultLike, // 좋아요 히스토리 결과 (T/F)
      });
    } else {
      res.status(200).render("community/boardDetail", {
        success: true,
        isLogin,
        currentLoginUser: req.session.user,
        msg: "페이지 렌더링 정상 처리",
        boardData: eachBoard[0],
        cDate: create,
        commentData: allComment,
        commentCreateAt,
        bResult: false, // 좋아요 히스토리 결과 (T/F)
      });
    }
    // }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      isLogin,
      currentLoginUser: req.session.user,
      msg: "서버에러 발생",
    });
  }
};

// 조회수 처리 (메인페이지에서 자유게시글 상세페이지 클릭 시, 조회수 + 1)
// PATCH
// board/detail/view/:bId
exports.viewBoard = async (req, res) => {
  try {
    const { bId } = req.params;

    const eachBoard = await getBoard(bId);

    // 조회수 업데이트 +1
    await Board.update(
      { viewCount: eachBoard.viewCount + 1 },
      { where: { bId } },
    );
    res.status(200).send({ boardData: eachBoard });
  } catch (error) {
    console.error(error);
    res.send("Internal Server Error");
  }
};

// 좋아요 버튼 클릭 시, 게시글 좋아요 추가 및 삭제 처리
// PATCH
// board/detail/like/:bId
exports.likeBoard = async (req, res) => {
  // 세션 확인
  let isLogin = req.session.user ? true : false;

  try {
    const { bId } = req.params;

    const eachBoard = await getBoard(bId);

    // 1. 좋아요 히스토리 찾기
    const uLikeFind = await uLike.findOne({
      where: {
        bId,
        uId: req.session.user, // 현재 로그인 된 유저
      },
    });

    // 2. 좋아요 히스토리에 있으면 true, 없으면 false
    const resultLike = !!uLikeFind;

    // 3-1. uLike findOne -> bId 없으면,
    if (!uLikeFind) {
      // (1) 좋아요 히스토리 생성 : uLike에 해당 bId 생성됨.
      await uLike.create({
        uId: req.session.user,
        bId,
      });

      // (2) 자유게시글 likeCount +1 업데이트
      await Board.update(
        { likeCount: eachBoard.likeCount + 1 },
        { where: { bId } },
      );
    } else if (uLikeFind) {
      // 3-2. uLike findOne -> bId 있으면,
      // (1) 좋아요 히스토리 삭제 : uLike에 해당 bId 삭제함
      await uLike.destroy({
        where: { bId },
      });

      // (2) 자유게시글 likeCount -1 업데이트
      await Board.update(
        { likeCount: eachBoard.likeCount - 1 },
        { where: { bId } },
      );
    }

    res.status(200).send({
      bResult: resultLike, // 좋아요 결과 T/F
    });
  } catch (error) {
    console.error(error);
    res.send("Internal Server Error");
  }
};

// 게시글 전체 조회
exports.getBoardList = async (req, res) => {
  try {
    const BoardList = await Board.findAll();
    res.render("index", { type: "board", data: BoardList });
  } catch (error) {
    console.error(error);
    res.send("Internal Server Error");
  }
};

// 게시글 개별 조회 함수
const getBoard = async (bId) => {
  try {
    const board = await Board.findOne({
      where: { bId: bId },
    });

    return board;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 댓글 전부 가져오기
// board/comment/list
exports.getCommentList = async (req, res) => {
  try {
    const comment = await Comment.findAll({
      where: { bId: req.params.bId },
    });
    res.status(200).send({
      comment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      msg: "서버에러",
    });
  }
};

// Board-댓글. 게시글의 모든 댓글 조회 함수
const getComment = async (bId) => {
  try {
    const comment = await Comment.findAll({
      where: { bId: bId },
      include: [
        {
          model: User,
          attributes: ["uId", "uName", "userImgPath"],
        },
      ],
    });

    return comment;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 게시글 페이지별 호출시 처리
// /board/list/:page&:pageSize&:sortField&:sortOrder
exports.paginateBoard = async (req, res) => {
  // 세션 확인
  let isLogin = req.session.user ? true : false;

  try {
    let page = parseInt(req.params.page) || 1;
    let pageSize = parseInt(req.params.pageSize) || 20;
    let offset = (page - 1) * pageSize;

    let sortField = req.params.sortField || "createdAt";
    let sortOrder = req.params.sortOrder || "desc";

    // params 검사
    if (
      !sortField ||
      !["createdAt", "likeCount", "viewCount", "commentCount"].includes(
        sortField,
      )
    ) {
      res.status(400).send({ error: "올바른 정렬 필드를 지정하세요." });
      return;
    }
    if (!sortOrder || !["desc", "asc"].includes(sortOrder)) {
      res.status(400).json({ error: "올바른 정렬 순서를 지정하세요." });
      return;
    }

    const boardTotalCount = await Board.count();
    const boardPageCount = parseInt(Math.ceil(boardTotalCount / pageSize)); // 페이지 수 (올림처리)

    // 시퀄라이즈에 SQL 쿼리 그대로 사용
    const sql = `
    SELECT b.bId, u.uName, u.uId, u.userImgPath, b.title, b.content, b.viewCount, b.likeCount, b.createdAt, b.updatedAt, COALESCE(count(c.cId), 0) as commentCount 
      FROM board b 
      LEFT JOIN comment c ON b.bId = c.bId 
      LEFT JOIN user u ON b.uId = u.uId 
      GROUP BY b.bId 
      ORDER BY ${sortField} ${sortOrder} 
      LIMIT ${offset}, ${pageSize};`;

    const [paginatedBoard, metadata] = await sequelize.query(sql);

    // 날짜 데이터 포맷 변경
    const boardCreateAt = [];
    for (b of paginatedBoard) {
      boardCreateAt.push(moment(b.createdAt).format("YYYY-MM-DD"));
    }

    // 데이터 응답
    res.send({
      boardData: paginatedBoard, // Board 데이터(20개씩)
      boardCreateAt, // Board 데이터에서 CreateAt의 포맷팅을 변경한 데이터
      pageCount: boardPageCount, // 총 몇페이지인지
      success: true,
      msg: "페이지별 게시글 호출 처리 완료",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error: "서버 에러",
    });
  }
};

// 게시글 생성 처리
// /board/create
exports.createBoard = async (req, res) => {
  // 세션 검사
  let isLogin = req.session.user ? true : false;

  try {
    if (!isLogin) {
      res.status(401).send({
        success: false,
        isLogin,
        currentLoginUser: req.session.user,
        msg: "로그인 되어있지 않습니다.",
      });
      return;
    }

    // Req 데이터 Null 검사
    if (!req.body.title || !req.body.content) {
      res.status(400).send({
        success: false,
        isLogin,
        currentLoginUser: req.session.user,
        msg: "데이터에 빈값이 있습니다.",
      });
      return;
    }

    // DB작업
    const newBoard = await Board.create({
      title: req.body.title,
      content: req.body.content,
      uId: req.session.user,
    });
    const uId = req.session.user;

    const user = await User.findOne({
      where: { uId },
    });

    res.status(200).send({
      success: true,
      isLogin,
      currentLoginUser: req.session.user,
      msg: "자유게시글 생성 처리 성공",
      bId: newBoard.dataValues.bId,
      userData: user,
      data: {
        bId: newBoard.dataValues.bId,
      },
    });
  } catch (error) {
    // 기타 데이터베이스 오류
    console.log(error);
    res.status(500).send({
      success: false,
      isLogin,
      currentLoginUser: req.session.user,
      msg: "서버에러 발생",
    });
  }
};

// 게시글 수정 처리
// /board/edit/:bId
exports.editBoard = async (req, res) => {
  // 세션 검사
  let isLogin = req.session.user ? true : false;

  try {
    const { bId } = req.params;
    const { title, content } = req.body;

    // 업데이트 전 게시글 데이터 조회
    const before = await Board.findByPk(bId);

    // uid로 게시글 소유자 여부 확인(권한 확인)
    if (before.dataValues.uId !== req.session.user) {
      res.status(401).send({
        success: false,
        isLogin,
        currentLoginUser: req.session.user,
        msg: "게시글의 소유자가 아님",
      });
      return;
    }

    // update 처리 성공시 result[0] = 1
    // update 처리 실패시 result[0] = 0
    // 하지만 실제로 같은 데이터로 업데이트를 수행해서 데이터변경이 없어도 update결과로 result는 1(성공)이 나와버린다.
    let result = await Board.update(
      {
        title: title,
        content: content,
      },
      {
        where: { bId: bId },
      },
    );

    // 업데이트 후 데이터 조회
    const after = await Board.findByPk(bId);

    // 업데이터 전과 후 실제 데이터 변경값 확인
    const hasChangedResult = hasChanged(before.dataValues, after.dataValues);
    isUpdated = hasChangedResult ? true : false;

    // 정상 처리
    res.status(200).send({
      success: true,
      isLogin,
      currentLoginUser: req.session.user,
      isUpdated,
      msg: "게시글 업데이트 처리 성공",
    });
  } catch (error) {
    // 에러 처리
    console.log(error);
    res.status(500).send({
      success: false,
      isLogin: true,
      currentLoginUser: req.session.user,
      msg: "서버 에러 발생",
    });
  }
};

// 자유게시판 게시글 내용/제목 변경여부 확인 함수
const hasChanged = (before, after) =>
  before.title !== after.title || before.content !== after.content;

// 게시글 삭제 처리
// /board/delete/:bId
exports.deleteBoard = async (req, res) => {
  // 세션 확인
  let isLogin = req.session.user ? true : false;

  const { bId } = req.params;

  try {
    const isDeleted = await Board.destroy({
      where: {
        bId: bId,
      },
    });

    if (!isDeleted) {
      // 삭제 실패 처리
      res.status(404).send({
        isDeleted: false,
        currentLoginUser: req.session.user,
        msg: "게시글이 삭제되지 않았습니다.",
      });
      return;
    } else {
      // 정상 삭제 처리
      res.status(200).send({
        isDeleted: true,
        currentLoginUser: req.session.user,
        msg: "게시글이 정상적으로 삭제되었습니다.",
      });
    }
  } catch (error) {
    console.log(error);
    // 에러 처리
    res.status(500).send({
      currentLoginUser: req.session.user,
      msg: "게시글 삭제처리 중 서버에러 발생",
    });
  }
};

// 게시글 댓글 생성 처리
// /board/comment/create/:bId
exports.createComment = async (req, res) => {
  // 세션 검사
  let isLogin = req.session.user ? true : false;

  try {
    // 로그인 여부 검사
    // 결과값을 isLogin 값으로 보낸다.
    if (!isLogin) {
      res.status(401).send({
        success: false,
        isLogin,
        currentLoginUser: req.session.user,
        msg: "로그인 되어있지 않습니다.",
      });
      return;
    }

    // Req 데이터 Null 검사
    if (!req.body.content || !req.params.bId) {
      res.status(400).send({
        success: false,
        isLogin,
        currentLoginUser: req.session.user,
        msg: "데이터에 빈값이 있습니다.",
      });
      return;
    }

    // 댓글이 달릴 게시판 = bId
    const currentBid = req.params.bId;
    const commentContent = req.body.content;

    const newComment = await Comment.create({
      uId: req.session.user,
      bId: currentBid,
      content: commentContent,
    });

    // 게시글의 총 댓글수 확인
    const commentCount = await getCommentCount(currentBid);

    // 정상 처리
    res.status(200).send({
      success: true,
      isLogin,
      currentLoginUser: req.session.user,
      commentUserImgPath: req.session.userImgPath,
      msg: "게시글 댓글 생성 처리 성공",
      commentData: newComment.dataValues,
      commentCount, // 게시글에 달린 총 댓글수
    });
    return;
  } catch (error) {
    // 기타 데이터베이스 오류
    console.log(error);
    res.status(500).send({
      success: false,
      isLogin,
      currentLoginUser: req.session.user,
      msg: "데이터베이스 오류 발생",
    });
    return;
  }
};

// 게시글 댓글 수정 처리
// /board/comment/edit/:cId
exports.editComment = async (req, res) => {
  // 세션 검사
  let isLogin = req.session.user ? true : false;

  try {
    // 로그인 여부 검사
    if (!isLogin) {
      res.status(401).send({
        success: false,
        isLogin,
        currentLoginUser: req.session.user,
        msg: "로그인 되어있지 않습니다.",
      });
      return;
    }

    // 요청에서 cId(댓글 ID)와 수정할 내용(content) 받아오기
    const { cId } = req.params;
    const { content } = req.body;

    // 이 부분에서 댓글 작성자와 현재 사용자를 비교하여 권한이 없으면 에러 처리 가능
    // 1. 댓글의 작성자를 확인
    const comment = await Comment.findOne({
      where: { cId: cId },
    });
    // 2. 로그인한 유저와 비교
    if (comment.uId !== req.session.user) {
      res.status(401).send({
        success: false,
        isLogin,
        currentLoginUser: req.session.user,
        msg: "댓글의 소유자가 아님",
      });
      return;
    }

    // 댓글 수정
    const isUpdatedComment = await Comment.update(
      { content: content },
      { where: { cId: cId } },
    );

    // 댓글이 달린 게시글의 총 댓글수 확인
    const commentCount = await getCommentCount(cId);

    res.status(200).send({
      success: true,
      isLogin,
      currentLoginUser: req.session.user,
      msg: "댓글 수정처리 완료",
      updatedcId: cId,
      commentCount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      isLogin,
      currentLoginUser: req.session.user,
      msg: "서버에러 발생",
    });
  }
};

// 게시글 댓글 삭제 처리
// /board/comment/delete/:cId
exports.deleteComment = async (req, res) => {
  // 세션 검사
  let isLogin = req.session.user ? true : false;

  try {
    // 로그인 여부 검사
    if (!isLogin) {
      res.status(401).send({
        success: false,
        isLogin,
        currentLoginUser: req.session.user,
        msg: "로그인 되어있지 않습니다.",
      });
      return;
    }

    // 요청에서 cId(댓글 ID) 받아오기
    const { cId } = req.params;

    // 이 부분에서 댓글 작성자와 현재 사용자를 비교하여 권한이 없으면 에러 처리 가능
    // 1. cId로 댓글의 작성자를 확인하자
    const result = await Comment.findOne({
      where: { cId: cId },
    });

    // cId로 댓글 여부 먼저 확인
    if (result === null) {
      // 없는 댓글임
      res.status(404).send({
        success: false,
        isLogin,
        currentLoginUser: req.session.user,
        msg: "서버 오류 발생: 해당 cid의 댓글이 없습니다.",
      });
      return;
    }

    // uId로 댓글 소유자 여부 확인(권한 확인)
    const commentWriter = result.uId;
    if (req.session.user !== commentWriter) {
      res.status(401).send({
        success: false,
        isLogin,
        currentLoginUser: req.session.user,
        msg: "댓글의 소유자가 아님",
      });
      return;
    }

    // 댓글 삭제
    const isDeletedComment = await Comment.destroy({
      where: { cId: cId },
    });

    if (isDeletedComment) {
      res.status(200).send({
        success: true,
        isLogin,
        currentLoginUser: req.session.user,
        msg: "댓글 삭제 완료",
        deletedcId: cId,
      });
    } else {
      res.status(404).send({
        success: false,
        isLogin,
        currentLoginUser: req.session.user,
        msg: "서버 오류 발생: 댓글 삭제 실패",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      isLogin,
      currentLoginUser: req.session.user,
      msg: "서버에러 발생",
    });
  }
};

// 게시글 수정 페이지 렌더링
// /board/edit/:bId
exports.editBoardPage = async (req, res) => {
  // 세션 검사
  let isLogin = req.session.user ? true : false;

  try {
    // 세션 검사
    if (!isLogin) {
      res.status(200).render("community/post", {
        success: false,
        isLogin,
        msg: "권한없는 유저 접근",
      });
      return;
    } else {
      const uId = req.session.user;

      const user = await User.findOne({
        where: { uId },
      });

      // 게시글 데이터 선택
      const board = await Board.findOne({
        where: { bId: req.params.bId },
      });

      // 정상 처리
      res.status(200).render("community/edit", {
        success: true,
        type: "board",
        isLogin,
        currentLoginUser: req.session.user,
        boards: board.dataValues,
        userData: user,
        msg: "페이지 렌더링 정상 처리",
      });
    }
  } catch (error) {
    console.log(error);
    // 에러 처리
    res.status(200).render("community/edit", {
      success: false,
      isLogin,
      currentLoginUser: req.session.user,
      msg: "서버 에러",
    });
  }
};

// 댓글이 달린 게시글의 총 댓글수를 확인하기 위한 함수
const getCommentCount = async (bId) => {
  const boardCommentCount = await Comment.count({ where: { bId: bId } });
  return boardCommentCount;
};
