const express = require('express');
const router = express.Router();

// 컨트롤러
const Cquestion = require('../controller/Cquestion');
const Canswer = require('../controller/Canswer');
const Ccomment = require('../controller/Ccomment');

// 로그인 검사 미들웨어
const { needToLogin } = require('../middlewares/needToLogin');

// QnA 메인 페이지 렌더링
router.get('/main', Cquestion.getQuestions);
router.get('/main/:page&:pageSize&:sortField&:sortOrder', Cquestion.getQuestions); // 파라미터에 따른 정렬기능 추가

// 질문 추가 페이지 렌더링
router.get('/create', needToLogin, Cquestion.getCreateQuestion);

// 질문 추가 처리
// /question/create
router.post('/create', needToLogin, Cquestion.postQuestion);

// 특정 질문 페이지 렌더링
// /question/:qId
router.get('/:qId', Cquestion.getQuestion);

// 특정 질문 좋아요
router.patch('/:qId', needToLogin, Cquestion.likeQuestion);

// 조회수
router.patch('/:qId/view', Cquestion.viewQuestion);

// 특정 답변 좋아요
router.patch('/:qId/like/:aId', needToLogin, Canswer.likeAnswer);

//==== Question ====

// 페이지별 질문 조회
// /question/list/:page&:pageSize&:sortField&:sortOrder
router.get('/list/:page&:pageSize&:sortField&:sortOrder', Cquestion.paginateQuestion);

// 특정 질문 내용 수정 페이지 렌더링
// /question/:qId/edit
router.get('/:qId/edit', needToLogin, Cquestion.getEditQuestion);

// 특정 질문 내용 수정 처리
router.patch('/:qId/edit', Cquestion.patchQuestion);

// 특정 질문 삭제
// /question/:qId/delete
router.delete('/:qId/delete', needToLogin, Cquestion.deleteQuestion);

//==== Answer ====
// 답변 전체 조회
// router.get("/:qId", Canswer.getAnswers);

// 답변 생성
router.get('/:qId/answer/create', Canswer.getCreateAnswer);
router.post('/:qId/answer/create', needToLogin, Canswer.postAnswer);

// 특정 답변 내용 수정
router.get('/:qId/answer/:aId/edit', needToLogin, Canswer.getEditAnswer);
router.patch('/:qId/answer/:aId/edit', needToLogin, Canswer.patchAnswer);

// 특정 답변 삭제
router.delete('/:qId/answer/:aId/delete', needToLogin, Canswer.deleteAnswer);

//=== Comment ===
// 특정 질문의 특정 답변에 대한 댓글

// 생성
router.get('/:qId/:aId/comment/create', Ccomment.getCreateComment);
router.post('/:qId/:aId/comment/create', needToLogin, Ccomment.postComment);

// 수정
router.get('/:qId/:aId/comment/:cId/edit', Ccomment.getEditComment);
router.patch('/:qId/:aId/comment/:cId/edit', Ccomment.patchComment);

// 삭제
router.delete('/:qId/:aId/comment/:cId/delete', needToLogin, Ccomment.deleteComment);

module.exports = router;
