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
      // res.status(301).send({
      //   isLogin,
      //   currentUser: req.session.user,
      //   success: false,
      //   msg: '이미 로그인되어있어서 회원가입 페이지로 이동시키면 안됨',
      // });
      // return;

      // 이 경우 세션 삭제 후 다시 회원가입 할 수 있도록 함
      req.session.destroy((err) => {
        if (err) {
          console.log(err);
          return;
        }
        res.redirect('/join');
      });
    } else {
      res.render('join', {
        isLogin,
        currentUser: req.session.user,
        success: true,
        msg: '회원가입창 페이지 렌더링 처리 성공',
      });
    }
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
      return res.status(400).json({
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

    // 중복 검사 (uId, uNname)
    const uIdIsDuplicate = await User.count({ where: { uId } });
    const uNameIsDuplicate = await User.count({ where: { uName } });

    if (uIdIsDuplicate || uNameIsDuplicate) {
      return res.status(409).json({
        OK: false,
        uIdIsDuplicate,
        uNameIsDuplicate,
        msg: 'uId 또는 uNname 가 이미 존재합니다.',
      });
    }

    // 새싹 크루 아니라고 선택했을 때 캠퍼스 값 없이 db 저장
    if (isSesac === 'false') {
      campus = null;
    }

    // db에 넣기전 pw 암호화
    pw = hashPassword(pw);

    const newUser = await User.create({
      uId: uId,
      pw: pw,
      uName: uName,
      email: email,
      isSesac: isSesac === 'true',
      campus: campus,
    });
    res.status(200).send(newUser);
  } catch (err) {
    // 기타 데이터베이스 오류
    console.log(err);
    // res.status(500).send({
    //   OK: false,
    //   msg: '데이터베이스 오류 발생',
    // });
    // return;

    // [태균] 비속어 관련
    // 미들웨어에서 던진 에러를 처리 : 닉네임에만 적용. 비속어있을 경우 status 코드 400 발생
    res.status(err.statusCode || 500).send({
      msg: err.message,
      OK: false,
    });
  }
};

// 로그인 페이지 렌더링
exports.login = (req, res) => {
  // 세션 검사
  let isLogin = req.session.user ? true : false;
  console.log(req.session.user);
  try {
    if (isLogin) {
      // res.status(301).send({
      //   isLogin,
      //   currentUser: req.session.user,
      //   success: false,
      //   msg: '이미 로그인 되어 있습니다.',
      // });
      // return;

      // 이 경우 세션 삭제 후 다시 로그인 할 수 있도록 함
      req.session.destroy((err) => {
        if (err) {
          console.log(err);
          return;
        }
        res.redirect('/login');
      });
    } else {
      res.render('login', {
        title: 'test',
        uId: req.body,
        pw: req.body,
        isLogin,
        currentUser: req.session.user,
        success: true,
        msg: '로그인 페이지 렌더링 정상 처리',
      });
    }
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
    req.session.userImgPath = resultUser.userImgPath;
    console.log('login >>>', req.session.user);

    // 성공 응답 보내주기
    return res.status(200).json({
      message: '로그인 성공',
      currentLoginUser: req.session.user,
    });
  } else {
    return res.status(402).json({ message: '비밀번호가 일치하지 않습니다. ' });
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

// 아이디찾기 페이지 렌더링
exports.id = (req, res) => {
  // 세션 검사
  let isLogin = req.session.user ? true : false;
  console.log(req.session.user);
  try {
    if (isLogin) {
      // res.status(301).send({
      //   isLogin,
      //   currentUser: req.session.user,
      //   success: false,
      //   msg: '이미 로그인 되어 있습니다.',
      // });
      // return;

      // 이 경우 세션 삭제 후
      req.session.destroy((err) => {
        if (err) {
          console.log(err);
          return;
        }
        res.redirect('/findId');
      });
    } else {
      res.render('findId', {
        title: 'test',
        uId: req.body,
        pw: req.body,
        isLogin,
        currentUser: req.session.user,
        success: true,
        msg: '아이디찾기 페이지 렌더링 정상 처리',
      });
    }
  } catch (error) {
    res.status(500).send({
      isLogin,
      currentUser: req.session.user,
      success: false,
      msg: '아이디찾기 페이지 렌더링 중 서버 에러 발생',
      error,
    });
  }
};

// 아이디 찾기 기능
exports.findId = async (req, res) => {
  const { uName, email } = req.body;

  try {
    // 데이터베이스에서 일치하는 사용자를 조회
    const user = await User.findOne({
      where: {
        uName,
        email,
      },
    });

    if (user) {
      // 사용자를 찾은 경우
      res.send({ uId: user.uId }); // 아이디를 표시하는 페이지 렌더링
    } else {
      // 사용자를 찾지 못한 경우
      return res.status(401).json({ message: '사용자를 찾을 수 없습니다.' });
    }
  } catch (error) {
    console.error('아이디 찾기 오류:', error);
    res.status(500).send('아이디 찾기 중 오류가 발생했습니다.');
  }
};

// 로그인 페이지 렌더링
exports.login = (req, res) => {
  // 세션 검사
  let isLogin = req.session.user ? true : false;
  console.log(req.session.user);
  try {
    if (isLogin) {
      // res.status(301).send({
      //   isLogin,
      //   currentUser: req.session.user,
      //   success: false,
      //   msg: '이미 로그인 되어 있습니다.',
      // });
      // return;

      // 이 경우 세션 삭제 후 다시 로그인 할 수 있도록 함
      req.session.destroy((err) => {
        if (err) {
          console.log(err);
          return;
        }
        res.redirect('/login');
      });
    } else {
      res.render('login', {
        title: 'test',
        uId: req.body,
        pw: req.body,
        isLogin,
        currentUser: req.session.user,
        success: true,
        msg: '로그인 페이지 렌더링 정상 처리',
      });
    }
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

const nodemailer = require('nodemailer');
const smtpTransport = require('../config/email.js');

const verificationCodes = {};

// 이메일 인층 창 렌더링
exports.getEmail = (req, res) => {
  // 세션 검사
  let isLogin = req.session.user ? true : false;

  try {
    if (isLogin) {
      req.session.destroy((err) => {
        if (err) {
          console.log(err);
          return;
        }
        res.redirect('/email');
      });
    } else {
      res.render('email', {
        isLogin,
        currentUser: req.session.user,
        success: true,
        msg: '페이지 렌더링 처리 성공',
      });
    }
  } catch (error) {
    res.status(500).send({
      isLogin,
      currentUser: req.session.user,
      success: false,
      msg: '서버 에러 발생',
    });
  }
};

// 랜덤 인증 코드 생성
var generateRandomNumber = function (min, max) {
  var randNum = Math.floor(Math.random() * (max - min + 1)) + min;
  return randNum;
};

// 인증 이메일 발신
exports.postEmail = async (req, res) => {
  const number = generateRandomNumber(111111, 999999);

  const { email } = req.body; //사용자가 입력한 이메일

  verificationCodes[email] = {
    code: number,
    timestamp: Date.now(),
  };

  const mailOptions = {
    from: 'oliviamoon1124@naver.com ', // 발신자 이메일 주소.
    to: email, //사용자가 입력한 이메일 -> 목적지 주소 이메일
    subject: ' 인증 관련 메일 입니다. ',
    html: '<h1>인증번호를 입력해주세요 \n\n\n\n\n\n</h1>' + number,
  };
  smtpTransport.sendMail(mailOptions, (err, response) => {
    if (err) {
      res.json({ ok: false, msg: '메일 전송에 실패하였습니다.' });
    } else {
      // 서버에서 만든 인증코드를 세션에 저장
      req.session.email = email;

      req.session.verificationCodes = number;
      res.json({ ok: true, msg: '메일 전송에 성공하였습니다.' });
    }
  });
};

// 기존 코드와 함께

// '/users/verify' 엔드포인트를 생성
exports.postVerify = async (req, res) => {
  // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>', req.body);
  // const number = generateRandomNumber(111111, 999999);

  // const { email, verificationCode } = req.body; //사용자가 입력한 이메일
  const { verificationCode } = req.body; //사용자가 입력한 이메일
  if (req.session.verificationCodes == verificationCode) {
    // 클라이언트에서 보낸 인증 코드와 저장된 코드를 비교
    req.session.verificationCodes == null;

    // 사용자 ID를 기반으로 User 모델을 업데이트합니다.
    try {
      const updatedUser = await User.update(
        { emailVerify: true }, // 업데이트할 필드와 값을 설정합니다.
        { where: { email: req.session.email } } // 어떤 사용자를 업데이트할지 설정합니다.
      );
      console.log(updatedUser[0])

      if (updatedUser) {
        res.json({ ok: true, msg: '인증에 성공하였습니다.' });
      } else {
        res.json({ ok: false, msg: '사용자를 찾을 수 없습니다.' });
      }
    } catch (error) {
      console.error('인증 업데이트 오류:', error);
      res.json({ ok: false, msg: '인증 업데이트 중 오류가 발생했습니다.' });
    }
  } else {
    res.json({
      ok: false,
      msg: '인증에 실패하였습니다. 올바른 코드를 입력하세요.',
    });
  }
  // verificationCodes[email] = {
  //   code: number,
  //   timestamp: Date.now(),
  // };

  // if (verificationCodes[email].code === Number(verificationCode)) {
  //   // 클라이언트에서 보낸 인증 코드와 저장된 코드를 비교
  //   res.json({ ok: true, msg: '인증에 성공하였습니다.' });
  //   // 인증에 성공했으므로, 저장된 코드를 삭제할 수도 있습니다.
  //   delete verificationCodes[email];
  // } else {
  //   res.json({
  //     ok: false,
  //     msg: '인증에 실패하였습니다. 올바른 코드를 입력하세요.',
  //   });
  // }
};
