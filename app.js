const express = require('express');
const session = require('express-session');
const app = express();
const PORT = 8000;
const { sequelize } = require('./models');
const { swaggerUi, swaggerSpec } = require('./swagger');

// ejs
app.set('view engine', 'ejs');

app.use('/views', express.static(__dirname + '/views'));
app.use('/static', express.static(__dirname + '/static'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 세션
app.use(
  session({
    secret: 'MySessionSecretKey',
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      maxAge: 60 * 1000 * 60, // 1H
    },
  })
);

// routers
const indexRouter = require('./routes/index');
const questionRouter = require('./routes/questionRouter');
const boardRouter = require('./routes/boardRouter');
const usersRouter = require('./routes/usersRouter');

// swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// users 라우터로 이동 // 마이페이지, 회원 관련
app.use('/users', usersRouter);

// question 라우터로 이동
app.use('/question', questionRouter);

// board 라우터로 이동
app.use('/board', boardRouter);

// indexRouter 로 이동 // 메인페이지, 유저 관련
app.use('/', indexRouter);

// test
app.get('/check', (req, res) => {
  res.send(req.session);
});

// 404 처리
app.get('*', (req, res) => {
  res.render('404.ejs');
});

// force: false; 실제 데이터베이스에 테이블이 존재하지 않으면 모델에 정의한대로 생성
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`server open on port ${PORT}`);
  });
});
