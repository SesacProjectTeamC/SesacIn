const express = require("express");
const router = express.Router();
const Cquestion = require("../controller/Cquestion");
const Canswer = require("../controller/Canswer");
const Ccomment = require("../controller/Ccomment");

// 질문 추가
router.get("/create", Cquestion.getCreateQuestion);
router.post("/create", Cquestion.postQuestion);

// 특정 질문 조회
router.get("/:qId", Cquestion.getQuestion);

// 특정 질문 좋아요
router.patch("/:qId", Cquestion.likeQuestion);

// 특정 답변 좋아요
router.patch("/:qId/:aId", Canswer.likeAnswer);

//==== Question ====

// 페이지별 질문 조회
router.get("/list/:page", Cquestion.paginateQuestion);

// 특정 질문 내용 수정
router.get("/:qId/edit", Cquestion.getEditQuestion);
router.patch("/:qId/edit", Cquestion.patchQuestion);

// 특정 질문 삭제
router.delete("/:qId/delete", Cquestion.deleteQuestion);

//==== Answer ====
// 답변 전체 조회
// router.get("/:qId", Canswer.getAnswers);

// 답변 생성
router.get("/:qId/answer/create", Canswer.getCreateAnswer);
router.post("/:qId/answer/create", Canswer.postAnswer);

// 특정 답변 내용 수정
router.get("/:qId/answer/:aId/edit", Canswer.getEditAnswer);
router.patch("/:qId/answer/:aId/edit", Canswer.patchAnswer);

// 특정 답변 삭제
router.delete("/:qId/answer/:aId/delete", Canswer.deleteAnswer);

//=== Comment ===
// 특정 질문의 특정 답변에 대한 댓글

// 조회
router.get("/:qId/comment", Ccomment.getAnswerComments);

// 생성
router.get("/:qId/:aId/comment/create", Ccomment.getCreateComment);
router.post("/:qId/:aId/comment/create", Ccomment.postComment);

// 수정
router.get("/:qId/:aId/comment/:cId/edit", Ccomment.getEditComment);
router.patch("/:qId/:aId/comment/:cId/edit", Ccomment.patchComment);

// 삭제
router.delete("/:qId/:aId/comment/:cId/delete", Ccomment.deleteComment);

module.exports = router;
