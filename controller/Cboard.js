const { Board, Comment } = require("../models/index");
const { Op } = require("sequelize");
const moment = require("moment");

// 새 게시글 생성 페이지 렌더링
// /board/create
exports.newBoardPage = (req, res) => {
  // 테스트를 위해 로그인 된상태로 세팅
  req.session.user = "tgkim";

  try {
    // 로그인 여부 검사
    if (!req.session.user) {
      res.status(401).send({
        success: false,
        isLogin: false, // 결과값을 isLogin 값으로 보낸다.
        msg: "로그인 되어있지 않습니다.",
      });
    }

    res.status(200).render("post", {
      success: true,
      isLogin: true,
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
      isLogin: false,
      msg: "서버에러 발생",
    });
  }
};

// 개별 게시글 페이지 렌더링
// board/detail/:bId
exports.detailBoard = async (req, res) => {
  // 테스트를 위해 로그인 된상태로 세팅
  req.session.user = "tgkim";

  try {
    // 로그인 여부 검사
    if (!req.session.user) {
      res.status(401).send({
        success: false,
        isLogin: false, // 결과값을 isLogin 값으로 보낸다.
        msg: "로그인 되어있지 않습니다.",
      });
    }

    // req 데이터 검사
    if (!req.params.bId) {
      console.log("프론트로부터 전달받은 bId 가 없음");
      res.status(404).send({
        success: false,
        isLogin: true,
        msg: "전달받은 bId 값이 없음",
      });
    }
    const { bId } = req.params;

    const eachBoard = await getBoard(bId);
    const allComment = await getComment(bId);

    res.status(200).render("boardDetailTest", {
      success: true,
      isLogin: true,
      currentLoginUser: req.session.user,
      msg: "페이지 렌더링 정상 처리",
      boardData: eachBoard,
      commentData: allComment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      isLogin: false,
      msg: "서버에러 발생",
    });
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
getComment = async (bId) => {
  try {
    const comment = await Comment.findAll({
      where: { bId: bId },
    });
    return comment;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 게시글 페이지별 호출시 처리
exports.paginateBoard = async (req, res) => {
  console.log(req.params);
  let page = parseInt(req.params.page) || 1;
  let pageSize = parseInt(req.params.pageSize) || 20;
  try {
    // 전체 게시글 개수 계산
    const totalPage = await Board.count();

    // 페이지에 해당하는 게시글 데이터 조회
    // limit = 가져올 데이터 양
    // offset = 가져올 첫 데이터 위치
    const paginatedBoards = await Board.findAll({
      //최신글 정렬
      order: [["createdAt", "DESC"]],
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });

    // 날짜 데이터 포맷 변경
    const create = [];
    for (b of paginatedBoards) {
      create.push(moment(b.dataValues.createdAt).format("YYYY-MM-DD"));
    }

    res.send({
      boards: paginatedBoards,
      paginatedCount: pageSize,
      totalPage,
      cDate: create,
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
  // 테스트를 위해 로그인 된것으로 처리
  req.session.user = "tgkim";

  try {
    // 로그인 여부 검사
    // 결과값을 isLogin 값으로 보낸다.
    if (!req.session.user) {
      res.status(401).send({
        success: false,
        isLogin: false,
        msg: "로그인 되어있지 않습니다.",
      });
    }
    let loginUser = req.session.user;

    // Req 데이터 Null 검사
    if (!req.body.title || !req.body.content) {
      res.status(400).send({
        success: false,
        isLogin: true,
        currentLoginUser: loginUser,
        msg: "데이터에 빈값이 있습니다.",
      });
      return; // res.send 만 있어도 함수가 종료되지만 return으로 코드 가독성을 높임
    }

    // 게시글 제목과 내용에 부적절한 단어 사용에 대한 처리
    // ~~~~

    // DB작업
    const newBoard = await Board.create({
      title: req.body.title,
      content: req.body.content,
      uId: loginUser,
    });

    res.status(200).send({
      success: false,
      isLogin: true,
      currentLoginUser: loginUser,
      msg: "자유게시글 생성 처리 성공",
      bId: newBoard.dataValues.bId,
      data: {
        bId: newBoard.dataValues.bId,
      },
    });
    return;
  } catch (error) {
    // 기타 데이터베이스 오류
    console.log(error);
    res.status(500).send({
      OK: false,
      msg: "서버에러 발생",
    });
    return;
  }
};

// 게시글 수정 처리
// /edit/:bId
exports.editBoard = async (req, res) => {
  // 테스트를 위해 로그인 된것으로 처리
  req.session.user = "tgkim";

  if (!req.session.user) {
    // 로그인 상태가 아니면 홈으로 리다이렉트
    res.redirect("/");
  }
  const { bId } = req.params;
  const { title, content } = req.body;

  try {
    const isUpdated = await Board.update(
      {
        title: title,
        content: content,
      },
      {
        where: { bId: bId },
      }
    );
    if (isUpdated) {
      res.send({
        isUpdated: true,
      });
    } else {
      res.send({
        isUpdated: false,
      });
    }
  } catch (error) {
    // 에러 처리
  }
};

// 게시글 삭제 처리
exports.deleteBoard = async (req, res) => {
  // 테스트를 위해 로그인 된것으로 처리
  req.session.user = "tgkim";

  if (!req.session.user) {
    // 로그인 상태가 아니면 홈으로 리다이렉트
    res.redirect("/");
  }
  const { bId } = req.params;

  try {
    const isDeleted = await Board.destroy({
      where: {
        bId: bId,
      },
    });
    if (isDeleted) {
      return res.send({
        isDeleted: true,
      });
    } else {
      return res.send({
        isDeleted: false,
      });
    }
  } catch (error) {
    console.log(error);
    // 에러 처리
  }
};

// 게시글 댓글 생성 처리
exports.createComment = async (req, res) => {
  // 테스트를 위해 로그인 된것으로 처리
  req.session.user = "홍홍";

  try {
    // 로그인 여부 검사
    // 결과값을 isLogin 값으로 보낸다.
    if (!req.session.user) {
      res.status(401).send({
        success: false,
        isLogin: false,
        msg: "로그인 되어있지 않습니다.",
      });
    }
    let loginUser = req.session.user;

    // Req 데이터 Null 검사
    if (!req.body.content || !req.params.bId) {
      res.status(400).send({
        OK: false,
        msg: "데이터에 빈값이 있습니다.",
      });
      return; // res.send 만 있어도 함수가 종료되지만 return으로 코드 가독성을 높임
    }
    // 댓글이 달릴 게시판 = bId
    const currentBid = req.params.bId;
    const commentContent = req.body.content;

    const newComment = await Comment.create({
      uId: loginUser,
      bId: currentBid,
      content: commentContent,
    });

    res.status(200).send({
      OK: true,
      isLogin: true,
      currentLoginUser: req.session.user,
      msg: "게시글 댓글 생성 처리 성공",
      commentData: newComment.dataValues,
    });
    return;
  } catch (error) {
    // 기타 데이터베이스 오류
    console.log(error);
    res.status(500).send({
      OK: false,
      msg: "데이터베이스 오류 발생",
    });
    return;
  }
};

// 게시글 댓글 수정 처리
exports.editComment = async (req, res) => {
  // 테스트를 위해 로그인 된것으로 처리
  req.session.user = "홍홍";

  try {
    // 로그인 여부 검사
    // 결과값을 isLogin 값으로 보낸다.
    if (!req.session.user) {
      res.status(401).send({
        success: false,
        isLogin: false,
        msg: "로그인 되어있지 않습니다.",
      });
    }

    //////
    // 댓글의 생성자인지 확인하는 로직이 필요함 (프론트에서? 백엔드에서?)
    // 프론트에서는 유저 데이터를 보내고 백엔드에서 확인
    //////

    // 요청에서 cId(댓글 ID)와 수정할 내용(content) 받아오기
    const { cId } = req.params;
    const { content } = req.body;

    // 이 부분에서 댓글 작성자와 현재 사용자를 비교하여 권한이 없으면 에러 처리 가능
    // 1. cId로 댓글의 작성자를 확인하자
    const result = await Comment.findOne({
      where: { cId: cId },
    });

    // cid로 댓글 여부 먼저 확인
    if (result === null) {
      // 없는 댓글임
      res
        .status(401)
        .send({ msg: "서버 오류 발생: 해당 cid의 댓글이 없습니다." });
    }

    // uid로 댓글 소유자 여부 확인(권한 확인)
    const commentWriter = result.uId;
    if (req.session.user !== commentWriter) {
      res.status(401).send({ msg: "댓글의 소유자가 아님" });
    }

    // 댓글 수정
    const updatedComment = await Comment.update(
      { content: content },
      { where: { cId: cId } }
    );

    res.status(200).send({
      success: true,
      isLogin: true,
      currentLoginUser: req.session.user,
      msg: "댓글 수정처리 완료",
      updatedcId: cId,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      isLogin: false,
      msg: "서버에러 발생",
    });
  }
};

// 게시글 댓글 삭제 처리
exports.deleteComment = async (req, res) => {
  // 테스트용으로 미리 박아놓음
  req.session.user = "홍홍";

  try {
    if (!req.session.user) {
      res.status(401).send({
        success: false,
        isLogin: false,
        msg: "로그인 되어있지 않습니다.",
      });
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
      res
        .status(401)
        .send({ msg: "서버 오류 발생: 해당 cId의 댓글이 없습니다." });
    }

    // uId로 댓글 소유자 여부 확인(권한 확인)
    const commentWriter = result.uId;
    if (req.session.user !== commentWriter) {
      res.status(401).send({ msg: "댓글의 소유자가 아님" });
    }

    // 댓글 삭제
    const deletedComment = await Comment.destroy({
      where: { cId: cId },
    });

    if (deletedComment) {
      res.send({
        success: true,
        isLogin: true,
        currentLoginUser: req.session.user,
        msg: "댓글 삭제 완료",
        deletedcId: cId,
      });
    } else {
      res.status(401).send({ msg: "서버 오류 발생: 댓글 삭제 실패" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      isLogin: false,
      msg: "서버에러 발생",
    });
  }
};
