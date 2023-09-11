const express = require("express");
const app = express();
const PORT = 8000;
const {sequelize} = require("./models");
const session = require("express-session");

// Swagger
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Swagger 정의 옵션 설정
const swaggerOptions = {
  definition: {
    openapi: "3.0.0", // 또는 '2.0' 사용 가능
    info: {
      title: "API 문서",
      version: "1.0.0",
      description: "API 문서를 위한 Swagger",
    },
  },
  // API 파일 경로 설정 (자신의 애플리케이션 경로에 맞게 설정)
  apis: ["./routes/*.js"], // 예시: './routes/*.js'
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ejs
app.set("view engine", "ejs");

app.use("/views", express.static(__dirname + "/views"));
app.use("/static", express.static(__dirname + "/static"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// 세션
app.use(
  session({
    secret: "MySessionSecretKey",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      maxAge: 60 * 1000, // 1m
    },
  })
);

// routers
const indexRouter = require("./routes/index");
const questionRouter = require("./routes/questionRouter");
const boardRouter = require("./routes/boardRouter");

// indexRouter 로 이동
// 메인페이지, 유저 관련
app.use("/", indexRouter);

// question 라우터로 이동
app.use("/question", questionRouter);

// board 라우터로 이동
app.use("/board", boardRouter);

// 404 처리
app.get("*", (req, res) => {
  res.render("404.ejs");
});

// force: false; 실제 데이터베이스에 테이블이 존재하지 않으면 모델에 정의한대로 생성
sequelize.sync({force: false}).then(() => {
  app.listen(PORT, () => {
    console.log(`server open on port ${PORT}`);
  });
});
