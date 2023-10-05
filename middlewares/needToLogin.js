// needToLogin 미들웨어 함수 정의(로그인이 되어있어야 하는 API에 적용)
function needToLogin(req, res, next) {
  if (req.session.user) {
    // 세션에 사용자 정보가 있는 경우 (로그인 상태)
    console.log('needToLogin 수행 : 유저는 로그인 상태 입니다.');
    return next();
  }
  // 세션에 사용자 정보가 없는 경우 (로그아웃 상태)
  // GET 일떄
  if (req.method === 'GET') {
    console.log('needToLogin 수행 : 유저는 비로그인 상태 입니다. 요청 메소드는 GET. 로그인페이지로 리다이렉트 합니다.');
    res.redirect('/login');
    return;
  }

  // GET 외의 요청일 때
  console.log('needToLogin 수행: 유저는 비로그인 상태 입니다. 로그인이 필요하다는 응답값 전달 합니다.');
  res.status(401).send('로그인이 필요합니다.'); // 프론트에서는 전달받은 에러객체의 err.response.status 로 401을 확인 할 수 있음
}

module.exports = {
  needToLogin,
};
