const express = require('express');
const session = require('express-session');
const app = express();
const { sequelize } = require('./models');
const { swaggerUi, swaggerSpec } = require('./swagger');
const dotenv = require('dotenv');
dotenv.config();
const { PORT, SESSION_KEY } = process.env; // env 폴더에 정의한 걸 구조분해

// ejs
app.set('view engine', 'ejs');

app.use('/views', express.static(__dirname + '/views'));
app.use('/static', express.static(__dirname + '/static'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 세션
app.use(
  session({
    secret: SESSION_KEY,
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

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`server open on port ${PORT}`);
  });
});
