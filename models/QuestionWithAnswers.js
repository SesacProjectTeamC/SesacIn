//=== JOIN 진행할 경우 추가 예정 ===

const Sequelize = require("sequelize");

// Sequelize 설정 및 데이터베이스 연결 설정 (이미 설정한 경우 생략 가능)

const QuestionWithAnswers = sequelize.define("QuestionWithAnswers", {
  questionContent: {
    type: Sequelize.STRING, // 질문 내용의 데이터 타입에 따라 변경
  },
  answerTitle: {
    type: Sequelize.STRING, // 답변 제목의 데이터 타입에 따라 변경
  },
  answerContent: {
    type: Sequelize.TEXT, // 답변 내용의 데이터 타입에 따라 변경
  },
});
