//=== 마이 페이지 ===
// 1. 좋아요 / 작성한 게시글 / 답변 / 댓글
// 2. 회원정보 GET
// 3. 수정 버튼 -> 회원정보 PATCH, DELETE

//////////////////////////////////////////////
const { User, Question, Answer, Comment, Board, uLike } = require("../models");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");

// 마이페이지 렌더링
exports.getUser = async (req, res) => {
  // 세션 검사
  let isLogin = req.session.user ? true : false;

  try {
    // 세션에서 로그인 된 사용자 id 가져오기
    const uId = req.session.user;
    const isButton = req.params.buttonType ? true : false;
    // buttonType 은 liked, commented, answered, qna, free

    // 데이터베이스에서 해당 사용자 정보를 조회합니다.
    const user = await User.findOne({
      where: { uId },
    });

    // 좋아요 히스토리 가져오기
    const likes = await uLike.findAll({ where: { uId } });

    // 좋아요 누른 질문
    const likeQuestion = await Question.findAll({
      where: { qId: likes.map((like) => like.qId) },
    });

    // 좋아요 누른 답변
    const likeAnswer = await Answer.findAll({
      where: { aId: likes.map((like) => like.aId) },
    });

    // 좋아요 누른 자유게시글
    const likeBoard = await Board.findAll({
      where: { bId: likes.map((like) => like.bId) },
    });

    // 작성한 질문
    const posts = await Question.findAll({ where: { uId } });

    // 작성한 질문에 대한 답변
    let postAnswerCount = [];
    for (let i = 0; i < posts.length; i++) {
      const postAnswers = await Answer.findAll({
        where: { qId: posts[i].qId },
      });
      postAnswerCount.push(postAnswers.length);
    }

    // 좋아요 누른 질문에 대한 답변 수
    let likeQuestionAnswerCount = [];
    for (let i = 0; i < likeQuestion.length; i++) {
      const likeQuestionAnswers = await Answer.findAll({
        where: { qId: likeQuestion[i].qId },
      });
      likeQuestionAnswerCount.push(likeQuestionAnswers.length);
    }

    // 좋아요 누른 답변에 대한 댓글 수
    let likeAnswerCommentCount = [];
    for (let i = 0; i < likeAnswer.length; i++) {
      const likeAnswerComments = await Comment.findAll({
        where: { aId: likeAnswer[i].aId },
      });
      likeAnswerCommentCount.push(likeAnswerComments.length);
    }

    // 좋아요 누른 자유에 대한 댓글 수
    let likeBoardCommentCount = [];
    for (let i = 0; i < likeBoard.length; i++) {
      const likeBoardComments = await Comment.findAll({
        where: { bId: likeBoard[i].bId },
      });
      likeBoardCommentCount.push(likeBoardComments.length);
    }

    // 작성한 답변
    const answers = await Answer.findAll({ where: { uId } });

    // 작성한 댓글
    const comments = await Comment.findAll({ where: { uId } });

    // 내가 작성한 자유게시글 데이터
    const boards = await Board.findAll({
      where: { uId },
      order: [["createdAt", "DESC"]], // createdAt 기준으로 내림차순으로 정렬
    });

    let commentsCount = [];
    for (let i = 0; i < boards.length; i++) {
      const boardComments = await Comment.findAll({
        where: { bId: boards[i].bId },
      });
      commentsCount.push(boardComments.length);
    }

    if (isButton) {
      // send
      res.send({
        userData: user,
        likeQuestionData: likeQuestion, // 좋아요 누른 질문
        likeAnswerData: likeAnswer, // 좋아요 누른 답변
        likeQuestionAnswerCount, // 좋아요 누른 질문에 대한 답변 수
        likeAnswerCommentCount, // 좋아요 누른 답변에 대한 댓글 수
        likeBoardCommentCount, // 좋아요 누른 자유에 대한 댓글 수
        likeBoardData: likeBoard, // 좋아요 누른 자유게시글
        postData: posts, // 내가 작성한 질문
        postAnswerCount, // 내가 작성한 질문에 대한 답변 수
        boardsData: boards, // 내가 작성한 자유게시판 게시글
        answerData: answers, // 내가 작성한 답변
        commentData: comments, // 내가 작성한 댓글
        commentsCount, //작성한 댓글에 대한 개수
        isLogin,
        currentUser: req.session.user,
        success: true,
      });
      return;
    }

    // 마이페이지 렌더링
    res.render("user/profile", {
      userData: user,
      likeQuestionData: likeQuestion, // 좋아요 누른 질문
      likeAnswerData: likeAnswer, // 좋아요 누른 답변
      likeBoardData: likeBoard, // 좋아요 누른 자유게시글
      likeQuestionAnswerCount, // 좋아요 누른 질문에 대한 답변 수
      likeAnswerCommentCount, // 좋아요 누른 답변에 대한 댓글 수
      postData: posts, // 내가 작성한 질문
      postAnswerCount, // 내가 작성한 질문에 대한 답변 수
      boardsData: boards, // 내가 작성한 자유게시판 게시글
      answerData: answers, // 내가 작성한 답변
      commentData: comments, // 내가 작성한 댓글
      commentsCount, //작성한 댓글에 대한 개수
      isLogin,
      commentsCount,
      currentUser: req.session.user,
      success: true,
      msg: "마이페이지 렌더링 정상 처리",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      isLogin,
      currentUser: req.session.user,
      success: false,
      msg: "마이페이지 렌더링 중 서버에러 발생",
    });
  }
};

/////////////////////////////////////////////////// 사용자 정보 수정 페이지
// 정보 수정 창 렌더링
exports.getUserInfo = (req, res) => {
  // 세션 검사
  let isLogin = req.session.user ? true : false;

  try {
    if (isLogin) {
      const userData = {
        uId: req.session.user, // 세션에서 사용자 ID 가져오기
      };

      // ********** 추후에 어떤 화면으로 이동할 지 이름 수정 필요할수도 있음
      res.status(200).render("user/editprofile", {
        userData,
      });
      return;
    } else {
      // 로그인 되어있지 않은 상태에서의 요청시
      // res.status(401).send({
      //   isLogin,
      //   currentUser: req.session.user,
      //   success: false,
      //   mgs: '로그인 정보 다름. 권한 없음.',
      // });
      // return;
      res.redirect("/404");
    }
  } catch (error) {
    console.log(error);

    res.status(500).send({
      isLogin,
      currentUser: req.session.user,
      success: false,
      msg: "회원정보 수정 페이지 렌더링 중 서버에러 발생",
    });
  }
};

// 회원 정보 수정 - 비밀번호, 이름 (이미지는 후순위)
exports.patchUser = async (req, res) => {
  // 세션 검사
  let isLogin = req.session.user ? true : false;

  try {
    const uId = req.session.user;
    console.log(uId);

    const userData = { uId: uId };
    let { email, pw, uName } = req.body;
    console.log(req.body);

    const uNameIsDuplicate = await User.count({ where: { uName } });

    if (uNameIsDuplicate) {
      return res.status(409).json({
        OK: false,
        uNameIsDuplicate,
        msg: "닉네임이 이미 존재합니다.",
      });
    }
    if (!pw) {
      return res.status(400).json({
        OK: false,
        msg: "입력 필드 중 하나 이상이 누락되었습니다.",
      });
    }

    pw = hashPassword(pw);

    // 사용자가 둘 다 빈 값으로 넘기면 닉네임, 이메일 수정 X
    if (!uName && !email) {
      const currentUser = await User.findOne({ where: { uId: uId } });

      const posts = await Question.findAll({ where: { uId: uId } });
      const answers = await Answer.findAll({ where: { uId: uId } });
      const comments = await Comment.findAll({ where: { uId: uId } });

      return res.render("user/profile", {
        userData: currentUser,
        postData: posts,
        answerData: answers,
        commentData: comments,
        isLogin,
        currentUser: req.session.user,
        success: true,
      });
    }

    const currentUser = await User.findOne({ where: { uId: uId } });
    const updateData = {};
    // uName 바꾸면 uName 업데이트
    if (uName !== "") {
      updateData.uName = uName;
    }

    // email 바꾸면 email 업데이트
    if (email !== "") {
      if (!isValidEmail(email)) {
        return res.status(401).json({
          OK: false,
          msg: "올바른 이메일 형식을 입력해주세요.",
        });
      }
      updateData.email = email;
    }

    const updatedUser = await User.update(
      { email: updateData.email, pw: pw, uName: updateData.uName },
      {
        where: { uId: uId },
      },
    );

    const posts = await Question.findAll({ where: { uId: uId } });
    const answers = await Answer.findAll({ where: { uId: uId } });
    const comments = await Comment.findAll({ where: { uId: uId } });

    // 세션 지우는 로직 (이로직을 수행하면 로그인이 풀려버린다.)
    // console.log('>>>>>>>', updatedUser);
    // req.session.destroy((err) => {
    //   if (err) {
    //     console.log('세션 삭제 에러 >>> ', err);
    //   } else {
    //     console.log('세션 삭제 완료');
    //   }
    // });

    res.render("user/profile", {
      userData: updatedUser,
      postData: posts,
      answerData: answers,
      commentData: comments,
      isLogin,
      currentUser: req.session.user,
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(err.statusCode || 500).send({
      isLogin,
      currentUser: req.session.user,
      success: false,
      msg: err.message,
    });
  }
};

// 이메일 형식 검사 함수
function isValidEmail(email) {
  // 이메일 형식 검사 로직을 추가하세요.
  // 예를 들어, 정규식을 사용하여 이메일 형식을 확인할 수 있습니다.
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailRegex.test(email);
}

// 회원 탈퇴할 때 비밀번호 체크 위한 로직
exports.checkPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const uId = req.session.user;

    const user = await User.findOne({
      where: { uId },
    });

    if (!user) {
      // 사용자가 존재하지 않는 경우
      res
        .status(400)
        .json({ success: false, message: "사용자가 존재하지 않습니다." });
      return;
    }

    // 비밀번호 일치 여부 확인
    const passwordMatch = await bcrypt.compare(password, user.pw);

    if (!passwordMatch) {
      // 비밀번호가 일치하지 않는 경우
      res
        .status(401)
        .json({ success: false, message: "비밀번호가 일치하지 않습니다." });
      return;
    }

    // 비밀번호가 일치하는 경우
    res.status(200).json({ success: true, message: "비밀번호가 일치합니다." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "서버 오류 발생" });
  }
};

// 회원 삭제 - 회원 탈퇴할 경우
// /users/deleteprofile
exports.deleteUser = async (req, res) => {
  // 세션 검사
  let isLogin = req.session.user ? true : false;

  try {
    const uId = req.session.user;
    const isDeleted = await User.destroy({
      where: { uId: uId },
    });

    if (isDeleted) {
      // 성공적으로 삭제된 경우
      req.session.destroy((err) => {
        // 세션 삭제 실패
        if (err) {
          console.log(err);
          res.status(301).send({
            isLogin,
            success: false,
            msg: "세션 삭제 실패",
          });
          return;
        }

        // 정상 처리
        res.status(200).send({
          isLogin: false,
          deletedUser: uId,
          success: true,
        });
      });
    } else {
      // 서버 에러
      res.status(500).send({
        isLogin,
        currentUser: req.session.user,
        success: false,
        msg: "서버 에러 발생",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      isLogin,
      currentUser: req.session.user,
      success: false,
      msg: "서버 오류 발생",
    });
  }
};

// password 해싱 함수. hash된 패스워드를 리턴함
const hashPassword = (password) => {
  let saltRounds = 10;
  return bcrypt.hashSync(password, saltRounds);
};
