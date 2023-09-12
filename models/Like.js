const Like = (Sequelize, DataTypes) => {
  const Like = Sequelize.define(
    'Like',
    {
      likeId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    {
      tableName: 'like', // 실제 db 테이블명
      freezeTableName: true, // 테이블명 고정 (모델 이름 테이블로 바꿀 때 복수형으로 바뀜)
      timestamps: false,
    }
  );
  return Like;
};
module.exports = Like;
