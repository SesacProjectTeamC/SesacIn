const express = require('express');
const app = express();
const { sequelize } = require('./models');
const { swaggerUi, swaggerSpec } = require('./swagger');
const dotenv = require('dotenv');
dotenv.config();
const { PORT } = process.env; // env 폴더에서 정의한 것을 구조분해

// 세션 설정 모듈을 불러옵니다.
const configureSession = require('./session');

// ejs
app.set('view engine', 'ejs');

app.use('/views', express.static(__dirname + '/views'));
app.use('/static', express.static(__dirname + '/static'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 세션 설정을 모듈로 처리
configureSession(app);

// routers
const indexRouter = require('./routes/index');
const questionRouter = require('./routes/questionRouter');
const boardRouter = require('./routes/boardRouter');
const usersRouter = require('./routes/usersRouter');
const uploadRouter = require('./routes/uploadRouter'); // uploadRouter 불러오기

// 미들웨어: 로그인 여부 확인 (로그인 이후에만 사용이 가능한 api에 적용)
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    // 세션에 사용자 정보가 있는 경우
    next(); // 다음 미들웨어 또는 라우터로 진행
  } else {
    // 로그인이 필요하다.
    res.redirect('/');
  }
}

// users 라우터로 이동 // 마이페이지, 회원 관련
app.use('/users', usersRouter);

// swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 파일 업로드 라우터 사용
app.use('/upload', uploadRouter);

// question 라우터로 이동
app.use('/question', questionRouter);

// board 라우터로 이동
app.use('/board', boardRouter);

// indexRouter 로 이동 // 메인 페이지, 유저 관련
app.use('/', indexRouter);

// test
app.get('/check', (req, res) => {
  res.render('mainTest');
});

// 404 처리
app.get('*', (req, res) => {
  res.render('404.ejs');
});

sequelize.sync({ force: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`server open on port ${PORT}`);
  });
});
