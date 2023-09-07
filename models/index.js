'use strict';

// 시퀄라이즈 모듈 호출
const Sequelize = require('sequelize');

// config.json 파일을 불러와서 환경설정
const env = 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

// config를 이용해서 시퀄라이즈 객체 설정 및 생성
let sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const User = require('./User')(sequelize, Sequelize);
const Answer = require('./Answer')(sequelize, Sequelize);
const Board = require('./Board')(sequelize, Sequelize);
const Comment = require('./Comment')(sequelize, Sequelize);
const Question = require('./Question')(sequelize, Sequelize);

User.hasMany(Question, { foreignKey: 'uid', onDelete: 'CASCADE' });
Question.belongsTo(User, { foreignKey: 'uid', onDelete: 'CASCADE' });
// 한명의 유저는 여러개의 답변 가능 / 답변 올린 유저 존재
User.hasMany(Answer, { foreignKey: 'uid', onDelete: 'CASCADE' });
Answer.belongsTo(User, { foreignKey: 'uid', onDelete: 'CASCADE' });
// 하나의 질문에는 여러개의 답변 가능 / 답변은 질문에 속해있음
Question.hasMany(Answer, { foreignKey: 'qid', onDelete: 'CASCADE' });
Answer.belongsTo(Question, { foreignKey: 'qid', onDelete: 'CASCADE' });
// 한명의 유저는 여러개 게시글 업로드 가능 / 게시글 올린 사람 존재
User.hasMany(Board, { foreignKey: 'uid', onDelete: 'CASCADE' });
Board.belongsTo(User, { foreignKey: 'uid', onDelete: 'CASCADE' });
// 한명의 유저는 여러개의 댓글 가능 / 댓글 올린 유저 존재
User.hasMany(Comment, { foreignKey: 'uid', onDelete: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'uid', onDelete: 'CASCADE' });
// 하나의 게시글에는 여러개의 댓글 가능 / 댓글은 게시글에 속해있음
Board.hasMany(Comment, { foreignKey: 'bid', onDelete: 'CASCADE' });
Comment.belongsTo(Board, { foreignKey: 'bid', onDelete: 'CASCADE' });

db.sequelize = sequelize; // DB연결정보를 가진 시퀄라이저
db.Sequelize = Sequelize; // 시퀄라이저 모듈

db.User = User;
db.Answer = Answer;
db.Board = Board;
db.Comment = Comment;
db.Question = Question;

module.exports = db;
