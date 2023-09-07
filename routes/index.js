// (시작) module
// 경로 선언과 관련된 내용 기술
const express = require('express');
const Cpage = require('../controller/Cpage');
const router = express.Router();

router.get('/', Cpage.main);

module.exports = router;
