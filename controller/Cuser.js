const { User } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
// const Filter = require('bad-words');
// const filter = new Filter();

// 회원가입 창 렌더링
exports.getJoin = (req, res) => {
  // 세션 검사
  let isLogin = req.session.user ? true : false;

  try {
    if (isLogin) {
      res.status(301).send({
        isLogin,
        currentUser: req.session.user,
        success: false,
        msg: '이미 로그인되어있어서 회원가입 페이지로 이동시키면 안됨',
      });
      return;
    }

    res.render('join', {
      isLogin,
      currentUser: req.session.user,
      success: true,
      msg: '회원가입창 페이지 렌더링 처리 성공',
    });
  } catch (error) {
    res.status(500).send({
      isLogin,
      currentUser: req.session.user,
      success: false,
      msg: '서버 에러 발생',
    });
  }
};

// 중복 확인
exports.checkDuplicate = async (req, res) => {
  const { field, value } = req.query;

  try {
    const isDuplicate = await checkIfValueIsDuplicate(field, value);

    res.json({ isDuplicate });
  } catch (error) {
    console.error('중복 확인 중 오류 발생:', error);
    res.status(500).json({ error: '서버 오류' });
  }
};

// 중복 확인 로직 수행
async function checkIfValueIsDuplicate(field, value) {
  if (field === 'uId') {
    // 아이디 중복 확인
    const existingUser = await User.findOne({
      where: {
        uId: value,
      },
    });
    return !!existingUser;
  } else if (field === 'uName') {
    // 닉네임 중복 확인
    const existingUser = await User.findOne({
      where: {
        uName: value,
      },
    });
    return !!existingUser;
  }
}

// 회원 가입 시 사용자 생성
exports.postUser = async (req, res) => {
  console.log(req.body);
  try {
    let { uId, pw, uName, email, isSesac, campus } = req.body;

    // null 값 있는지 검사
    if (!uId || !pw || !uName || !email || !isSesac || !campus) {
      return res.status(400).send({
        OK: false,
        msg: '입력 필드 중 하나 이상이 누락되었습니다.',
      });
    }

    // 비속어 검사 - 근데 말그대로 필터링 되는 방식이라.. 좀 애매함
    // const containsBadWord = filter.isProfane(uId) || filter.isProfane(uName);
    // if (containsBadWord) {
    //   return res.status(400).send({
    //     OK: false,
    //     msg: '비속어가 포함되어 있습니다.',
    //   });
    // }

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
    // 기타 데이터베이스 오류
    console.log(err);
    res.status(500).send({
      OK: false,
      msg: '데이터베이스 오류 발생',
    });
    return;
  }
};

// 로그인 페이지 렌더링
exports.login = (req, res) => {
  // 세션 검사
  let isLogin = req.session.user ? true : false;

  try {
    if (isLogin) {
      res.status(301).send({
        isLogin,
        currentUser: req.session.user,
        success: false,
        msg: '이미 로그인 되어 있습니다.',
      });
      return;
    }

    res.render('login', {
      title: 'test',
      uId: req.body,
      pw: req.body,
      isLogin,
      currentUser: req.session.user,
      success: true,
      msg: '로그인 페이지 렌더링 정상 처리',
    });
  } catch (error) {
    res.status(500).send({
      isLogin,
      currentUser: req.session.user,
      success: false,
      msg: '로그인 페이지 렌더링 중 서버 에러 발생',
      error,
    });
  }
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
    console.log('login >>>', req.session.user);

    // 성공 응답 보내주기
    return res.status(200).json({
      message: '로그인 성공',
      currentLoginUser: req.session.user,
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
