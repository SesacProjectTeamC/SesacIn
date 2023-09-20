const express = require('express');
const router = express.Router();

// 컨트롤러
const Cprofile = require('../controller/Cprofile');
const Cuser = require('../controller/Cuser');

// 로그인 검사 미들웨어
const { needToLogin } = require('../middlewares/needToLogin');

// 마이페이지 렌더링
// /users/profile
router.get('/profile', needToLogin, Cprofile.getUser);
router.get('/profile/:buttonType', needToLogin, Cprofile.getUser);

// 마이페이지에서 버튼터입별 데이터 호출
// router.get('/profile/:buttonType', needToLogin, Cprofile.getMyPageContentData);

// 회원 정보 수정 페이지 렌더링
// /users/editprofile
router.get('/editprofile', needToLogin, Cprofile.getUserInfo);

// 사용자 회원가입 처리
// /users
router.post('/', Cuser.postUser);

// 회원 정보 수정 처리
// /users/editprofile
router.patch('/editprofile', needToLogin, Cprofile.patchUser);

// 회원 탈퇴 시 비밀번호 확인
// /users/checkpassword
router.post('/checkpassword', Cprofile.checkPassword);

// 회원 탈퇴 처리
// /users/deleteprofile
router.delete('/deleteprofile', needToLogin, Cprofile.deleteUser);

module.exports = router;
