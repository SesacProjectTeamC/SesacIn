// (시작) module
// 경로 선언과 관련된 내용 기술
const express = require('express');
const router = express.Router();
const Cuser = require("../controller/Cuser");
const Cquestion = require("../controller/Cquestion");
const Cboard = require("../controller/Cboard");
const Cprofile = require("../controller/Cprofile");
// const CprofileTest = require("../controller/CprofileTest");

// 메인 페이지 렌더링
router.get("/", Cquestion.getQuestions);

// 회원 가입 페이지 렌더링
router.get('/join', Cuser.getJoin);

// 중복 확인 처리 (아이디/패스워드)
router.get('/checkDuplicate', Cuser.checkDuplicate);

// 사용자 회원가입 처리
router.post('/users', Cuser.postUser);

// 로그인 페이지 렌더링
router.get('/login', Cuser.login);

// 로그인 처리
router.post('/login', Cuser.userLogin);

// 로그아웃 처리
router.post('/logout', Cuser.userLogout);

module.exports = router;
