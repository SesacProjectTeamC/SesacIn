// 비속어 필터링 모듈 가져오기
const { filterBadWords, isBadWords } = require('../middlewares/badWordsFilter/badWordsFilter');

// Answer 모델 정의
const Answer = (Sequelize, DataTypes) => {
  // Sequelize: models/index.js에서 sequelize
  // DataTypes: models/index.js에서 Sequelize
  const Answer = Sequelize.define(
    'Answer',
    {
      aId: {
        // id INT NOT NULL PRIMARY KEY auto_increment,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(1000),
        allowNull: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      likeCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      tableName: 'answer', // 실제 db 테이블명
      freezeTableName: true, // 테이블명 고정 (모델 이름 테이블로 바꿀 때 복수형으로 바뀜)
      timestamps: true, // 모델의 createdAt, updatedAt 컬럼 자동 생성
      hooks: {
        beforeCreate: (record, options) => {
          if (record.dataValues.content) {
            record.dataValues.content = filterBadWords(record.dataValues.content);
          }
          if (record.dataValues.title) {
            record.dataValues.title = filterBadWords(record.dataValues.title);
          }
          if (record.dataValues.uName) {
            const result = isBadWords(record.dataValues.uName);
            console.log(result);
            if (result) {
              // 비속어가 발견되면 에러 객체를 생성
              const error = new Error('비속어가 포함된 uName입니다.');
              error.statusCode = 411; // 상태 코드 설정
              throw error; // 에러를 던집니다.
            }
          }
        },

        beforeBulkUpdate: (options) => {
          if (options.attributes.content) {
            options.attributes.content = filterBadWords(options.attributes.content);
          }
          if (options.attributes.title) {
            options.attributes.title = filterBadWords(options.attributes.title);
          }
          if (options.attributes.uName) {
            const result = isBadWords(options.attributes.uName);
            if (result) {
              // 비속어가 발견되면 에러 객체를 생성
              const error = new Error('비속어가 포함된 uName입니다.');
              error.statusCode = 411; // 상태 코드 설정
              throw error; // 에러를 던집니다.
            }
          }
        },
      },
    }
  );

  return Answer;
};

module.exports = Answer;
