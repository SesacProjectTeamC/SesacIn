const express = require('express');
const router = express.Router();
const Cboard = require('../controller/Cboard');

// 개별 게시글 페이지 렌더링
/**
 * @swagger
 * /board/detail/:bId:
 *   get:
 *     summary: 개별 게시글 페이지 렌더링
 *     description: 개별 게시글 페이지 렌더링 완료
 *     tags:
 *       - 자유게시판
 *     responses:
 *       '200':
 *         description: 개별 게시글 페이지 렌더링 완료
 *         content:
 *           text/html:
 *             example: HTML 페이지를 렌더링합니다.
 */
router.get('/:bId', Cboard.detailBoard);

// 새 게시글 생성 페이지 렌더링
/**
 * @swagger
 * /board/create:
 *   get:
 *     summary: 새 게시글 생성 페이지 렌더링
 *     tags:
 *       - 자유게시판
 *     responses:
 *       '200':
 *         description: 새 게시글 생성 페이지 렌더링 완료
 *         content:
 *           text/html:
 *             example: HTML 페이지를 렌더링합니다.
 */
router.get('/create', Cboard.newBoardPage);

// 새 게시글 생성 처리
/**
 * @swagger
 * /board/create:
 *   post:
 *     summary: 새 게시글 생성 처리
 *     description: 새 게시글 생성 처리. 로그인 되어있지 않으면 uId를 가져올 수 없기때문에 생성 불가능
 *     tags:
 *       - 자유게시판
 *     requestBody:
 *       description: 게시글 정보
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 게시글 제목
 *               content:
 *                 type: string
 *                 description: 게시글 내용
 *     responses:
 *       '200':
 *         description: 새 게시글 생성 완료
 *         content:
 *           application/json:
 *             example:
 *               msg: 새 게시글 생성 완료
 */
router.post('/create', Cboard.createBoard);

// 게시글 수정 처리
/**
 * @swagger
 * /board/edit/{bId}:
 *   patch:
 *     summary: 게시글 수정 처리
 *     description: 게시글을 수정합니다.
 *     tags:
 *       - 자유게시판
 *     parameters:
 *       - in: path
 *         name: bId
 *         description: 수정할 게시글의 고유 ID
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *         description: 수정할 게시글의 제목(title)과 내용(content)
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *     responses:
 *       '200':
 *         description: 게시글 수정 완료
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 */
router.patch('/edit/:bId', Cboard.editBoard);

// 게시글 삭제 처리
/**
 * @swagger
 * /board/delete/{bId}:
 *   delete:
 *     summary: 게시글 삭제 처리
 *     description: 게시글을 삭제합니다.
 *     tags:
 *       - 자유게시판
 *     parameters:
 *       - in: path
 *         name: bId
 *         description: 삭제할 게시글의 고유 ID
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: 게시글 삭제 완료
 */
router.delete('/delete/:bId', Cboard.deleteBoard);

// 게시글 페이지별 호출시 처리
/**
 * @swagger
 * /board/list/{page}:
 *   get:
 *     summary: 게시글 페이지별 호출시 처리
 *     description: 게시글 페이지별 호출시 처리 (ex 1페이지, 2페이지)
 *                  최근 게시글 기준으로 21개 기준으로 나눔
 *     tags:
 *       - 자유게시판
 *     parameters:
 *       - in: path
 *         name: page
 *         description: 페이지 번호
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: 페이지별 게시글 처리 완료
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts:
 *                   type: array
 *                   description: 페이지에 해당하는 게시글 목록
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *                 totalCount:
 *                   type: integer
 *                   description: 전체 게시글 개수
 */
router.get('/list/:page', Cboard.paginateBoard);

// 게시글 댓글 생성 처리
/**
 * @swagger
 * /board/comment/create/{bId}:
 *   post:
 *     summary: 자유게시판 게시글 댓글 생성 처리
 *     description: 자유게시판 게시글에 댓글을 생성합니다.
 *     tags:
 *       - 자유게시판 댓글
 *     parameters:
 *       - in: path
 *         name: bId
 *         description: 댓글을 생성할 게시글의 고유 ID
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *         description: 댓글 내용(content)
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 content:
 *                   type: string
 *     responses:
 *       '200':
 *         description: 댓글 생성 완료
 */
router.post('/comment/create/:bId', Cboard.createComment);

// 게시글 댓글 수정 처리
/**
 * @swagger
 * /board/comment/edit/{cId}:
 *   patch:
 *     summary: 자유게시판 댓글 수정 처리
 *     description: 선택한 자유게시판 게시글의 댓글을 수정합니다.
 *     tags:
 *       - 자유게시판 댓글
 *     parameters:
 *       - in: path
 *         name: cId
 *         description: 수정할 댓글의 고유 ID
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *         description: 수정할 댓글의 내용
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 content:
 *                   type: string
 *                   description: 수정할 댓글의 내용
 *     responses:
 *       '200':
 *         description: 댓글 수정 완료
 *       '401':
 *         description: 권한이 없음 (댓글 작성자와 현재 사용자가 다를 경우)
 *       '404':
 *         description: 선택한 댓글이 존재하지 않음
 */
router.patch('/comment/edit/:cId', Cboard.editComment);

// 게시글 댓글 삭제 처리
/**
 * @swagger
 * /board/comment/delete/{cId}:
 *   delete:
 *     summary: 자유게시판 게시글 댓글 삭제 처리
 *     description: 자유게시판 게시글의 댓글을 삭제합니다.
 *     tags:
 *       - 자유게시판 댓글
 *     parameters:
 *       - in: path
 *         name: cId
 *         description: 삭제할 댓글의 고유 ID
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: 댓글 삭제 완료
 *       '401':
 *         description: 댓글 삭제 실패 또는 권한이 없음
 *       '404':
 *         description: 해당 댓글이 이미 삭제되었거나 존재하지 않음
 */
router.delete('/comment/delete/:cId', Cboard.deleteComment);

module.exports = router;
