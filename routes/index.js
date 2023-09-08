// (시작) module
// 경로 선언과 관련된 내용 기술
const express = require('express');
const Cpage = require('../controller/Cpage');
const router = express.Router();

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
router.get('/', Cpage.main);

module.exports = router;
