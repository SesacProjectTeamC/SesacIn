const { User } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');

// 회원가입 창 렌더링
exports.getJoin = (req, res) => {
  res.render('jointest');
};

// 회원 가입 시 사용자 생성
exports.postUser = async (req, res) => {
  console.log(req.body)
  try {
    let { uId, pw, uName, email, isSesac, campus } = req.body;
    // db에 넣기전 pw 암호화
    pw = hashPassword(pw);

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

// 로그인 페이지 렌더링
exports.login = (req, res) => {
  res.render('login', {
    title: 'test',
    uId: req.body,
    pw: req.body,
  });
};

// 로그인 처리
exports.userLogin = async (req, res) => {
  const resultUser = await User.findOne({
    where: {
      uId: req.body.uId,
    },
  });

  // 아이디 검사
  if (resultUser === null) {
    return res.status(401).json({ message: '사용자를 찾을 수 없습니다.' });
  }

  // 암호 검사
  const passCheck = comparePassword(req.body.pw, resultUser.pw);

  // 성공 처리
  if (passCheck) {
    // 로그인 성공처리. 세션에 uId 저장
    req.session.user = resultUser.uId;
    // 성공 응답 보내주기
    return res.status(200).json({
      message: '로그인 성공',
      isLogin: true,
    });
  } else {
    return res.status(401).json({ message: '비밀번호 불일치' });
    // 비밀번호 불일치
  }
};

// 로그아웃
exports.userLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return;
    }
    res.redirect('/');
  });
};

// password 해싱 함수. hash된 패스워드를 리턴함
const hashPassword = (password) => {
  let saltRounds = 10;
  return bcrypt.hashSync(password, saltRounds);
};

// 원문 비밀번호와 해시된 비밀번호가 일치하는 확인하는 함수
const comparePassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};
