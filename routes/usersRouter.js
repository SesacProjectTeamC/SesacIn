const express = require('express');
const router = express.Router();
const Cprofile = require('../controller/Cprofile');
const Cuser = require('../controller/Cuser');
const { needToLogin } = require('../util/middleware');

// 마이페이지 렌더링
// /users/profile
router.get('/profile', needToLogin, Cprofile.getUser);

router.get('/profile/:bool', needToLogin, Cprofile.getUser);

// 회원 정보 수정 페이지 렌더링
// /users/editprofile
router.get('/editprofile', needToLogin, Cprofile.getUserInfo);

// 사용자 회원가입 처리
// /users
router.post('/', Cuser.postUser);

// 회원 정보 수정 처리
// /users/editprofile
router.patch('/editprofile', needToLogin, Cprofile.patchUser);

// 회원 탈퇴 처리
// /users/deleteprofile
router.delete('/deleteprofile', needToLogin, Cprofile.deleteUser);

module.exports = router;
