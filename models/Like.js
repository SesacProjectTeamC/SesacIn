const uLike = (Sequelize, DataTypes) => {
  const uLike = Sequelize.define(
    "uLike",
    {
      likeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    {
      tableName: "uLike", // 실제 db 테이블명
      freezeTableName: true, // 테이블명 고정 (모델 이름 테이블로 바꿀 때 복수형으로 바뀜)
      timestamps: false,
    },
  );

  return uLike;
};
module.exports = uLike;
