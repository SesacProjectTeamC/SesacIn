// (시작) module
// 경로 선언과 관련된 내용 기술
const express = require("express");
const Cpage = require("../controller/Cpage");
const Cquestion = require("../controller/Cquestion");
const router = express.Router();

router.get("/", Cpage.main);
router.get("/login",Cpage.login);
/**
 * @swagger
 * /:
 *   get:
 *     summary: 첫 페이지 보여주기
 *     description: 첫 페이지를 보여주는 기능입니다.
 *     responses:
 *       200:
 *         description: 성공적으로 사용자 목록을 가져왔을 때 응답
 *       500:
 *         description: 서버 에러
 */

// 전체 질문 조회
router.get("/questions", Cquestion.getQuestions);

// 특정 질문 조회
router.get("/question/:qId", Cquestion.getQuestion);

// 질문 추가
router.post("/question", Cquestion.postQuestion);

// 특정 질문 내용 수정
router.patch("/questions/:qId/question", Cquestion.patchQuestion);

// 특정 질문 삭제
router.delete("/questions/:qId", Cquestion.deleteQuestion);

module.exports = router;
