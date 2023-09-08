const User = (Sequelize, DataTypes) => {
  // Sequelize: models/index.js에서 sequelize
  // DataTypes: models/index.js에서 Sequelize
  const User = Sequelize.define(
    'User',
    {
      uId: {
        // id INT NOT NULL PRIMARY KEY auto_increment,
        type: DataTypes.STRING(50),
        allowNull: false,
        primaryKey: true,
      },
      pw: {
        // id INT NOT NULL PRIMARY KEY auto_increment,
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      uName: {
        // name VARCHAR(10) NOT NULL,
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      email: {
        // name VARCHAR(10) NOT NULL,
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      isSesac: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      campus: {
        // name VARCHAR(10) NOT NULL,
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    {
      tableName: 'user', // 실제 db 테이블명
      freezeTableName: true, // 테이블명 고정 (모델 이름 테이블로 바꿀 때 복수형으로 바뀜)
      timestamps: true,
    }
  );
  return User;
};
module.exports = User;
