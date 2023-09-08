// (시작) module
// 경로 선언과 관련된 내용 기술
const express = require("express");
const Cpage = require("../controller/Cpage");
const Cquestion = require("../controller/Cquestion");
const router = express.Router();

router.get("/", Cpage.main);
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

const controller = require('../controller/Cuser');

/**
 * @swagger
 * /users:
 *   post:
 *     summary: 회원 가입 관련 api
 *     description: post /user 요청이 오면 선수 추가
 *     responses:
 *       200:
 *         description: 성공적으로 사용자 추가되었을 때 응답
 *       500:
 *         description: 서버 에러
 */

// 회원 가입 관련 api
// post /user 요청이 오면 선수 추가
router.post('/users', controller.postUser);

/**
 * @swagger
 * /users/{uId}:
 *   get:
 *     summary: 특정 플레이어 데이터 가져오기
 *     description: 특정 플레이어의 데이터를 가져옵니다.
 *     parameters:
 *       - in: path
 *         name: uId
 *         required: true
 *         schema:
 *           type: string
 *         description: 플레이어의 고유 ID
 *     responses:
 *       200:
 *         description: 성공적으로 데이터를 가져온 경우
 *       404:
 *         description: 플레이어를 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */
router.get('/users/:uId', controller.getUser);

/**
 * @swagger
 * /users/{uId}/patch:
 *   patch:
 *     summary: 회원 정보 수정
 *     description: 비밀번호, 이름을 수정하여 사용자 정보를 업데이트합니다.
 *     parameters:
 *       - in: path
 *         name: uId
 *         description: 사용자의 고유 식별자
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: user
 *         description: 수정할 사용자 정보 (비밀번호와 이름)
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             pw:
 *               type: string
 *               description: 수정할 비밀번호
 *             uName:
 *               type: string
 *               description: 수정할 사용자 이름
 *     responses:
 *       200:
 *         description: 사용자 정보가 성공적으로 수정되었을 때 응답
 *       404:
 *         description: 해당 사용자를 찾을 수 없을 때 응답
 *       500:
 *         description: 서버 에러
 */
router.patch('/users/:uId/userinfo', controller.patchUser);


// 회원 탈퇴시 정보 삭제
router.delete('/users/:uId', controller.deleteUser);

module.exports = router;
