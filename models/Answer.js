// Answer 모델 정의

const Answer = (Sequelize, DataTypes) => {
  // Sequelize: models/index.js에서 sequelize
  // DataTypes: models/index.js에서 Sequelize
  const Answer = Sequelize.define(
    'Answer',
    {
      aid: {
        // id INT NOT NULL PRIMARY KEY auto_increment,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      answer: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      like_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      tableName: 'answer', // 실제 db 테이블명
      freezeTableName: true, // 테이블명 고정 (모델 이름 테이블로 바꿀 때 복수형으로 바뀜)
      timestamps: true, // 모델의 createdAt, updatedAt 컬럼 자동 생성
      // timestamps: false,
    }
  );

  return Answer;
};

module.exports = Answer;
