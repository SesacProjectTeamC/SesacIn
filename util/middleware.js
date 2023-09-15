// needToLogin 미들웨어 함수 정의(로그인이 되어있어야 하는 API에 적용)
function needToLogin(req, res, next) {
  if (req.session.user) {
    // 세션에 사용자 정보가 있는 경우 (로그인 상태)
    console.log('needToLogin : 다음 로직으로 이동');
    return next();
  }
  // 세션에 사용자 정보가 없는 경우 (로그아웃 상태)
  console.log('needToLogin : /login 로 리다이렉트');
  res.redirect('/login'); // 또는 res.status(401).send('로그인이 필요합니다.');
}

module.exports = {
  needToLogin,
};
