const express = require('express');
const router = express.Router();
const Cprofile = require('../controller/Cprofile');
const Cuser = require('../controller/Cuser');

// 마이페이지 렌더링
// /users/profile
router.get('/profile', Cprofile.getUser);

// 회원 정보 수정 페이지 렌더링
// /users/editprofile
router.get('/editprofile', Cprofile.getUserInfo);

// 사용자 회원가입 처리
router.post('/', Cuser.postUser);

// 회원 정보 수정
router.patch('/editprofile', Cprofile.patchUser);

// 회원 탈퇴시 정보 삭제
router.delete('/deleteprofile', Cprofile.deleteUser);

module.exports = router;