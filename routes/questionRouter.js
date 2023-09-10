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

//==== Question ====

// 특정 질문 내용 수정
router.get("/:qId/edit", Cquestion.getEditQuestion);
router.patch("/:qId/edit", Cquestion.patchQuestion);

// 특정 질문 삭제
router.delete("/:qId/delete", Cquestion.deleteQuestion);

//==== Answer ====
// 답변 전체 조회
// router.get("/:qId", Canswer.getAnswers);

// 답변 추가
router.get("/:qId/answer", Canswer.getCreateAnswer);
router.post("/:qId/answer", Canswer.postAnswer);

// 특정 답변 내용 수정
router.get("/:qId/answer/:aId/edit", Canswer.getEditAnswer);
router.patch("/:qId/answer/:aId/edit", Canswer.patchAnswer);

// 특정 답변 삭제
router.delete("/:qId/answer/:aId/delete", Canswer.deleteAnswer);

//=== Comment ===
router.get("/:qId/comment", Ccomment.getCreateComment);
router.post("/:qId/comment", Ccomment.postComment);

// 특정 답변 내용 수정
router.get("/:qId/comment/:cId/edit", Ccomment.getEditComment);
router.patch("/:qId/comment/:cId/edit", Ccomment.patchComment);

// 특정 답변 삭제
router.delete("/:qId/comment/:cId/delete", Ccomment.deleteComment);

module.exports = router;
