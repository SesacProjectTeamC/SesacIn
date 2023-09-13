"use strict";

// 시퀄라이즈 모듈 호출
const Sequelize = require("sequelize");

// config.json 파일을 불러와서 환경설정
const env = "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

// config를 이용해서 시퀄라이즈 객체 설정 및 생성
let sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
);

const User = require("./User")(sequelize, Sequelize);
const Answer = require("./Answer")(sequelize, Sequelize);
const Board = require("./Board")(sequelize, Sequelize);
const Comment = require("./Comment")(sequelize, Sequelize);
const Question = require("./Question")(sequelize, Sequelize);
const uLike = require("./Like")(sequelize, Sequelize);

//=== Relation 설정 ===
// 전체 1:다 관계

// 1. User - Question
// 한명의 유저는 여러개의 질문 가능 / 질문 올린 유저 존재
User.hasMany(Question, { foreignKey: "uId", onDelete: "CASCADE" });
Question.belongsTo(User, { foreignKey: "uId", onDelete: "CASCADE" });

// 2. User - Answer
// 한명의 유저는 여러개의 답변 가능 / 답변 올린 유저 존재
User.hasMany(Answer, { foreignKey: "uId", onDelete: "CASCADE" });
Answer.belongsTo(User, { foreignKey: "uId", onDelete: "CASCADE" });

// 3. User - Board
// 한명의 유저는 여러개 게시글 업로드 가능 / 게시글 올린 사람 존재
User.hasMany(Board, { foreignKey: "uId", onDelete: "CASCADE" });
Board.belongsTo(User, { foreignKey: "uId", onDelete: "CASCADE" });

// 4. User - Comment
// 한명의 유저는 여러개의 댓글 가능 / 댓글 올린 유저 존재
User.hasMany(Comment, { foreignKey: "uId", onDelete: "CASCADE" });
Comment.belongsTo(User, { foreignKey: "uId", onDelete: "CASCADE" });

// 5. Question - Answer
// 하나의 질문에는 여러개의 답변 가능 / 답변은 질문에 속해있음
Question.hasMany(Answer, { foreignKey: "qId", onDelete: "CASCADE" });
Answer.belongsTo(Question, { foreignKey: "qId", onDelete: "CASCADE" });

// 6. Answer - Comment
// 하나의 답변에는 여러개의 댓글 가능 / 댓글은 답변에 속해있음
Answer.hasMany(Comment, { foreignKey: "aId", onDelete: "CASCADE" });
Comment.belongsTo(Answer, { foreignKey: "aId", onDelete: "CASCADE" });

// 7. Question - Comment
// 하나의 질문에는 여러개의 댓글 가능 / 댓글은 질문에 속해있음
Question.hasMany(Comment, { foreignKey: "qId", onDelete: "CASCADE" });
Comment.belongsTo(Question, { foreignKey: "qId", onDelete: "CASCADE" });

// 8. Board - Comment
// 하나의 게시글에는 여러개의 댓글 가능 / 댓글은 게시글에 속해있음
Board.hasMany(Comment, { foreignKey: "bId", onDelete: "CASCADE" });
Comment.belongsTo(Board, { foreignKey: "bId", onDelete: "CASCADE" });

// 9. Like - User
// 한 명의 유저는 여러개의 좋아요 가능 / 좋아요는 한 명의 유저에 속해있음
User.hasMany(uLike, { foreignKey: "uId", onDelete: "CASCADE" });
uLike.belongsTo(User, { foreignKey: "uId", onDelete: "CASCADE" });

// 10. uLike - Question
// 하나의 질문은 여러개의 좋아요 가능 / 좋아요는 한 질문에 속해있음
Question.hasMany(uLike, { foreignKey: "qId", onDelete: "CASCADE" });
uLike.belongsTo(Question, { foreignKey: "qId", onDelete: "CASCADE" });

// 11. uLike - Answer
// 하나의 답변은 여러개의 좋아요 가능 / 좋아요는 한 답변에 속해있음
Answer.hasMany(uLike, { foreignKey: "aId", onDelete: "CASCADE" });
uLike.belongsTo(Answer, { foreignKey: "aId", onDelete: "CASCADE" });

// 12. isLike - Board
// 하나의 댓글은 여러개의 좋아요 가능 / 좋아요는 한 댓글에 속해있음
Board.hasMany(uLike, { foreignKey: "bId", onDelete: "CASCADE" });
uLike.belongsTo(Board, { foreignKey: "bId", onDelete: "CASCADE" });

db.sequelize = sequelize; // DB연결정보를 가진 시퀄라이저
db.Sequelize = Sequelize; // 시퀄라이저 모듈

db.User = User;
db.Answer = Answer;
db.Board = Board;
db.Comment = Comment;
db.Question = Question;
db.uLike = uLike;

module.exports = db;
