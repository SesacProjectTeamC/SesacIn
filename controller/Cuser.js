const { User } = require('../models');
const { Op } = require('sequelize');

// 회원 가입 시 사용자 생성
exports.postUser = async (req, res) => {
  try {
    const { uId, pw, uName, email, isSesac, campus } = req.body;
    const newUser = await User.create({
      uId: uId,
      pw: pw,
      uName: uName,
      email: email,
      isSesac: isSesac,
      campus: campus,
    });
    res.send(newUser);
  } catch (err) {
    console.error(err);
    res.send('Internal Server Error');
  }
};

/// 회원 조회
exports.getUser = async (req, res) => {
  try {
    const { uId } = req.params; // 객체에서 꺼내온 유저 아이디 값
    const user = await User.findOne({
      where: { uId: uId },
    });
    res.send(user);
  } catch (err) {
    console.error(err);
    res.send('Internal Server Error');
  }
};

// 회원 정보 수정 - 비밀번호, 이름 (이미지는 후순위)
exports.patchUser = async (req, res) => {
  try {
    const { uId } = req.params;
    const { pw, uName } = req.body;
    // update는 바꿔야하는 인자, 어디에 있는 건지 where 인자
    const updatedUser = await User.update(
      { pw: pw, uName: uName },
      {
        where: { uId },
      }
    );

    res.send(updatedUser); // 성공시 [1], 실패시 [0]
  } catch (err) {
    console.error(err);
    res.send('Internal Server Error');
  }
};

// 회원 삭제 - 회원 탈퇴할 경우
exports.deleteUser = async (req, res) => {
  try {
    const { uId } = req.params;
    const isDeleted = await User.destroy({
      where: { uId },
    });
    // console.log(isDeleted); // 성공시 1, 실패시 0
    if (isDeleted) {
      return res.send(true);
    } else {
      return res.send(false);
    }
  } catch (err) {
    console.error(err);
    res.send('Internal Server Error');
  }
};
