// (시작) module
// 경로 선언과 관련된 내용 기술
const express = require("express");
const router = express.Router();
const Cuser = require("../controller/Cuser");
const Cquestion = require("../controller/Cquestion");
const Cboard = require("../controller/Cboard");
const Cprofile = require("../controller/Cprofile");
// const CprofileTest = require("../controller/CprofileTest");

// 메인 페이지 관련
router.get("/", Cquestion.getQuestions);

router.get("/users/:uId/profile", Cprofile.getUser);

// 유저 관련
/**
 * @swagger
 * tags:
 *   name: User
 *   description: 사용자 관리
 */

///////////////////////////////////// 회원가입 페이지
// 회원 가입 페이지 렌더링
router.get("/join", Cuser.getJoin);

// 중복 확인
router.get("/checkDuplicate", Cuser.checkDuplicate);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: 회원 가입 처리
 *     tags:
 *       - User
 *     description: 회원 가입 처리
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uId:
 *                 type: string
 *                 description: 사용자 아이디
 *               pw:
 *                 type: string
 *                 description: 비밀번호
 *               uName:
 *                 type: string
 *                 description: 닉네임
 *               email:
 *                 type: string
 *                 description: 이메일
 *               isSesac:
 *                 type: string
 *                 description: 새싹인 여부
 *               campus:
 *                 type: string
 *                 description: 소속 캠퍼스
 *
 *     responses:
 *       200:
 *         description: 성공적으로 사용자 추가되었을 때 응답
 *       500:
 *         description: 서버 에러
 */
// 회원 가입 관련 api
// post /user 요청이 오면 사용자 추가
router.post("/users", Cuser.postUser);

//////////////////////////////////////// 로그인 페이지

// 로그인 페이지 렌더링
router.get("/login", Cuser.login);

// 로그인 처리
/**
 * @swagger
 * /login:
 *   post:
 *     summary: 사용자 로그인
 *     description: 로그인 처리 진행
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uId:
 *                 type: string
 *                 description: 사용자 아이디
 *               pw:
 *                 type: string
 *                 description: 비밀번호
 *     responses:
 *       '200':
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isLogin:
 *                   type: boolean
 *                   description: 로그인 여부
 *       '401':
 *         description: 로그인 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 오류 메시지
 */
router.post("/login", Cuser.userLogin);

// 로그아웃 처리
/**
 * @swagger
 * /logout:
 *   post:
 *     summary: 사용자 로그아웃
 *     description: 로그인이 되어있다고 가정하고 session에 저장된 유저를 삭제하는 처리
 *     tags:
 *       - User
 *     responses:
 *       '302':
 *         description: 로그아웃 성공 및 리다이렉트
 *       '500':
 *         description: 서버 오류 발생
 */
router.post("/logout", Cuser.userLogout);

module.exports = router;
