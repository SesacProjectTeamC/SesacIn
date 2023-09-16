// 비속어 필터링 모듈 가져오기
const { filterBadWords, isBadWords } = require('../util/badWordsFilter');

const Question = (Sequelize, DataTypes) => {
  // Sequelize: models/index.js에서 sequelize
  // DataTypes: models/index.js에서 Sequelize
  const Question = Sequelize.define(
    'Question',
    {
      qId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      viewCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      likeCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      qType: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: 'question',
      freezeTableName: true,
      timestamps: true,
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
  return Question;
};
module.exports = Question;
