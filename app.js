const express = require('express');
const app = express();

// 환경변수
const dotenv = require('dotenv');
dotenv.config();
const { PORT } = process.env;

// 라우터
const indexRouter = require('./routes/index');
const questionRouter = require('./routes/questionRouter');
const boardRouter = require('./routes/boardRouter');
const usersRouter = require('./routes/usersRouter');
const uploadRouter = require('./routes/uploadRouter');

// sequelize 모듈을 불러옵니다.
const { sequelize } = require('./models');
// swagger 모듈을 불러옵니다.
const { swaggerUi, swaggerSpec } = require('./middlewares/swagger/swagger');
// 세션 설정 모듈을 불러옵니다.
const configureSession = require('./middlewares/session/session');

// ejs
app.set('view engine', 'ejs');
app.use('/views', express.static(__dirname + '/views'));
app.use('/static', express.static(__dirname + '/static'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 세션 설정
configureSession(app);

// users 라우터로 이동 // 마이페이지, 회원 관련
app.use('/users', usersRouter);

// swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 파일 업로드 라우터로 이동
app.use('/upload', uploadRouter);

// question 라우터로 이동
app.use('/question', questionRouter);

// board 라우터로 이동
app.use('/board', boardRouter);

// indexRouter 로 이동 // 메인 페이지, 유저 관련
app.use('/', indexRouter);

// 404 처리
app.get('*', (req, res) => {
  res.render('404.ejs');
});

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`server open on port ${PORT}`);
  });
});
