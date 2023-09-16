const express = require('express');
const router = express.Router();
const Cboard = require('../controller/Cboard');
const { needToLogin } = require('../util/middleware');

// 자유게시판 메인 페이지 렌더링
router.get('/main', Cboard.getBoardMain);

// 개별 게시글 페이지 렌더링
// /board/detail/:bId
router.get('/detail/:bId', Cboard.detailBoard);

// 게시글 조회수 처리
// /board/view/:bId
router.patch('/detail/view/:bId', Cboard.viewBoard);

// 게시글 좋아요 추가 처리
// /board/like/:bId
router.patch('/detail/like/:bId', needToLogin, Cboard.likeBoard);

// 새 게시글 생성 페이지 렌더링
// /board/create
router.get('/create', needToLogin, Cboard.newBoardPage);

// 새 게시글 생성 처리
// /board/create
router.post('/create', needToLogin, Cboard.createBoard);

// 게시글 수정 페이지 렌더링
// /board/edit/:bId
router.get('/edit/:bId', needToLogin, Cboard.editBoardPage);

// 게시글 수정 처리
// /board/edit/:bId
router.patch('/edit/:bId', needToLogin, Cboard.editBoard);

// 게시글 삭제 처리
// /board/delete/:bId
router.delete('/delete/:bId', needToLogin, Cboard.deleteBoard);

// 게시글 페이지별 호출시 처리
// /board/list/:page
router.get('/list/:page&:pageSize', Cboard.paginateBoard);

// 게시글 댓글 생성 처리
// /board/comment/create/:bId
router.post('/comment/create/:bId', Cboard.createComment);

// 게시글 댓글 수정 처리
// /board/comment/edit/:cId
router.patch('/comment/edit/:cId', Cboard.editComment);

// 게시글 댓글 삭제 처리
// /board/comment/delete/:cId
router.delete('/comment/delete/:cId', Cboard.deleteComment);

// 댓글 다 가져오기
// /board/comment/list/:bId
router.get('/comment/list/:bId', Cboard.getCommentList);

module.exports = router;
