// (시작) module
// 경로 선언과 관련된 내용 기술
const express = require('express');
const router = express.Router();
const Cmain = require('../controller/Cmain');
const Cuser = require('../controller/Cuser');
const Cquestion = require('../controller/Cquestion');
const Cboard = require('../controller/Cboard');

// 메인 페이지 관련
// router.get("/", Cmain.main);
// QnA 전체 질문 리스트 가져오기
router.get('/', Cquestion.getQuestions);
// 자유게시판 전체 리스트 가져오기
router.get('/', Cboard.getBoardList);
// 유저 id 가져오기 (uId)
router.get('/', Cuser.getUser);

// 유저 관련
/**
 * @swagger
 * tags:
 *   name: User
 *   description: 사용자 관리
 */

///////////////////////////////////// 회원가입 페이지
// 회원 가입 페이지 렌더링
router.get('/join', Cuser.getJoin);
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
router.post('/users', Cuser.postUser);

//////////////////////////////////// 마이페이지

/**
 * @swagger
 * /users/{uId}/profile:
 *   get:
 *     summary: 특정 플레이어 데이터 가져오기
 *     tags: [User]
 *     description: 로그인 된 사용자의 데이터를 가져옵니다.
 *     parameters:
 *       - in: path
 *         name: uId
 *         required: true
 *         schema:
 *           type: string
 *         description: 로그인 된 사용자의 고유 ID
 *     security:
 *       - session: []  # 세션을 사용한 인증을 요구합니다.
 *     responses:
 *       200:
 *         description: 성공적으로 데이터를 가져온 경우
 *       401:
 *         description: 로그인 되어 있지 않음
 *       403:
 *         description: 다른 사용자의 데이터를 조회할 권한이 없음
 *       500:
 *         description: 서버 에러
 */
// 회원 정보 창에서 사용자 정보 확인
router.get('/users/:uId/profile', Cuser.getUser);

/////////////////////////////////////////////////// 사용자 정보 수정 페이지
// 회원 정보 수정 페이지 렌더링
router.get('/editprofile', Cuser.getUserInfo);

// 회원 정보 수정
/**
 * @swagger
 * /users/{uId}/patch:
 *   patch:
 *     summary: 회원 정보 수정
 *     tags:
 *       - User
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
router.patch('/editprofile', Cuser.patchUser);

// 회원 탈퇴시 정보 삭제
router.delete('/deleteprofile', Cuser.deleteUser);

//////////////////////////////////////// 로그인 페이지

// 로그인 페이지 렌더링
router.get('/login', Cuser.login);

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
router.post('/login', Cuser.userLogin);

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
router.post('/logout', Cuser.userLogout);

module.exports = router;
