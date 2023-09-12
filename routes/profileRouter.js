const express = require('express');
const router = express.Router();
const Cprofile = require('../controller/Cprofile');

// 프로필 조회
router.get('/:uId', Cprofile.getProfile);

// 프로필 수정
router.get('/:uId/edit', Cprofile.getEditProfile);
router.patch('/:uId/edit', Cprofile.patchProfile);

// 유저 삭제 (회원탈퇴)
router.delete('/:uId/edit', Cprofile.deleteProfile);

module.exports = router;
