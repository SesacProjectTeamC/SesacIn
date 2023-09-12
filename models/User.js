const User = (Sequelize, DataTypes) => {
  const User = Sequelize.define(
    'User',
    {
      uId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        primaryKey: true,
      },
      pw: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      uName: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      isSesac: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      campus: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: 'NULL',
      },
      isLike: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: 'NULL',
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
