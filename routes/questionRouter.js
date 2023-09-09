const express = require("express");
const router = express.Router();
const Cquestion = require("../controller/Cquestion");
const CquestionJoin = require("../controller/CquestionJoin");
const Canswer = require("../controller/Canswer");

//==== Question, Answer ====
// 특정 질문 조회
// router.get("/:qId", Cquestion.getQuestion);
router.get("/:qId", CquestionJoin.getQuestion);

// 답변 전체 조회
router.get("/:qId", Canswer.getAnswers);

// 답변 추가
router.post("/answer/create", Canswer.postAnswer);

// 특정 답변 내용 수정
router.patch("/answer/create", Canswer.patchAnswer);

// 특정 답변 삭제
router.delete("/answer/create", Canswer.deleteAnswer);

//==== Question ====
// 질문 추가
router.post("/create", Cquestion.postQuestion);

// 특정 질문 내용 수정
router.patch("/questions/:qId/question", Cquestion.patchQuestion);

// 특정 질문 삭제
router.delete("/questions/:qId", Cquestion.deleteQuestion);

module.exports = router;
