const express = require('express');
const router = express.Router();
const Cboard = require('../controller/Cboard');

// 개별 게시글 페이지 렌더링
router.get('/:bId');
// 새 게시물 생성 페이지 렌더링
router.get('/create');

// 새 게시물 생성 처리
router.post('/create');
// 게시물 수정 처리
router.patch('/:bId/edit');
// 게시물 삭제 처리
router.delete('/:bId/delete');

// 게시물 댓글 생성 처리
router.post('/:bId/comment/create');
// 게시물 댓글 수정 처리
router.patch('/:bId/comment/edit');
// 게시물 댓글 삭제 처리
router.delete('/:bId/comment/delete');

module.exports = router;
