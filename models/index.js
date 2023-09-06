"use strict";

// sequelize 모듈 호출
const Sequelize = require("sequelize");

// config.json파일을 불러와서 development 환경의 db설정 적용
// config: db접근 가능한 설정 값 저장
const config = require(__dirname + "/../config/config.json")["development"];

// 빈 db객체 생성
const db = {};

// Sequelize 객체 생성해서 sequelize 변수에 저장
const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
);

// db = {sequelize: sequelize, Sequelize: Sequelize}
db.sequelize = sequelize;
db.Sequelize = Sequelize;

//  !! models/ 폴더에 정의되는 model(테이블)은 db 객체에 저장
// db.Visitor = require("./Visitor")(sequelize, Sequelize);

// db 객체 내보냄 (모듈화 내보냄. 다른 곳에서 db 객체 사용 가능)
module.exports = db;
