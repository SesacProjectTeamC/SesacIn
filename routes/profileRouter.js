const express = require('express');
const router = express.Router();
const Cprofile = require('../controller/Cprofile');

//////////////////////////////////// 마이페이지

/////////////////////////////////////////////////// 사용자 정보 수정 페이지

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
router.get('/:uId/profile', Cprofile.getUser);

// 회원 정보 수정 페이지 렌더링
router.get('/editprofile', Cprofile.getUserInfo);

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
router.patch('/editprofile', Cprofile.patchUser);

// 회원 탈퇴시 정보 삭제
router.delete('/deleteprofile', Cprofile.deleteUser);

module.exports = router;
