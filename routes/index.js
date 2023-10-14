const express = require("express");
const router = express.Router();
const Cmain = require("../controller/Cmain");
const Cuser = require("../controller/Cuser");

// 메인 페이지 렌더링
router.get("/", Cmain.getMainPage);

// 회원 가입 페이지 렌더링
router.get("/join", Cuser.getJoin);

// 중복 확인 처리 (아이디/패스워드)
router.get("/checkDuplicate", Cuser.checkDuplicate);

// 로그인 페이지 렌더링
router.get("/login", Cuser.login);

// 로그인 처리
router.post("/login", Cuser.userLogin);

// 로그아웃 처리
router.post("/logout", Cuser.userLogout);

// 아이디찾기 페이지 렌더링
router.get("/id", Cuser.id);

// 아이디찾기 기능
router.post("/id", Cuser.findId);

// 비밀번호 찾기 페이지 렌더링
router.get("/pw", Cuser.pw);

// 비밀번호 재설정 기능
router.patch("/pw", Cuser.updatePassword);

// 인증여부 확인 기능
router.post("/checkEmailVerify", Cuser.checkEmailVerify);

// 이메일 인증 페이지 렌더링
router.get("/email", Cuser.getEmail);

// 이메일 인증 처리
router.post("/email", Cuser.postEmail);
router.post("/verify", Cuser.postVerify);

module.exports = router;
