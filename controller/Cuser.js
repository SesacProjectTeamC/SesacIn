const { User } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');

// 회원가입 창 렌더링
exports.getJoin = (req, res) => {
  // 세션 검사
  let isLogin = req.session.user ? true : false;

  try {
    if (isLogin) {
      req.session.destroy((err) => {
        if (err) {
          console.log(err);
          return;
        }
        res.redirect('/join');
      });
    } else {
      res.render('user/join', {
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
  try {
    let { uId, pw, uName, email, isSesac, campus } = req.body;

    // null 값 있는지 검사
    if (!uId || !pw || !uName || !email || !isSesac || !campus) {
      return res.status(400).json({
        OK: false,
        msg: '입력 필드 중 하나 이상이 누락되었습니다.',
      });
    }

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
    console.log(err);
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
  try {
    if (isLogin) {
      // 이 경우 세션 삭제 후 다시 로그인 할 수 있도록 함
      req.session.destroy((err) => {
        if (err) {
          console.log(err);
          return;
        }
        res.redirect('/login');
      });
    } else {
      res.render('user/login', {
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

    // 성공 응답 보내주기
    return res.status(200).json({
      message: '로그인 성공',
      currentLoginUser: req.session.user,
    });
  } else {
    // 비밀번호 불일치
    return res.status(402).json({ message: '비밀번호가 일치하지 않습니다. ' });
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

  try {
    if (isLogin) {
      // 이 경우 세션 삭제 후
      req.session.destroy((err) => {
        if (err) {
          console.log(err);
          return;
        }
        res.redirect('/findId');
      });
    } else {
      res.render('user/findId', {
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

// 이메일 인증여부 확인 함수
async function checkIfEmailVerified(uId) {
  try {
    // 사용자 아이디를 기반으로 User 모델을 조회합니다.
    const user = await User.findOne({
      where: {
        uId,
      },
    });

    if (user) {
      // 사용자를 찾은 경우, emailVerify 필드 값을 확인합니다.
      const isEmailVerified = user.emailVerify;

      return isEmailVerified;
    } else {
      // 사용자를 찾지 못한 경우
      return false;
    }
  } catch (error) {
    console.error('이메일 인증 여부 확인 중 오류 발생:', error);
    throw new Error('이메일 인증 여부 확인 중 오류가 발생했습니다.');
  }
}

// 인증여부 확인 처리
// POST
// /checkEmailVerify
exports.checkEmailVerify = async (req, res) => {
  const { uId } = req.body;

  try {
    const user = await User.findOne({
      where: {
        uId: uId,
      },
    });

    if (!user) {
      // 사용자를 찾지 못한 경우 404 Not Found 상태 코드를 응답으로 보냅니다.
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    const isEmailVerified = await checkIfEmailVerified(uId);

    res.json({ isEmailVerified });
  } catch (error) {
    console.error('이메일 인증 여부 확인 중 오류 발생:', error);
    res.status(500).json({ error: '서버 오류' });
  }
};

// 비밀번호찾기 페이지 렌더링
exports.pw = (req, res) => {
  // 세션 검사
  let isLogin = req.session.user ? true : false;

  try {
    if (isLogin) {
      // 이 경우 세션 삭제 후
      req.session.destroy((err) => {
        if (err) {
          console.log(err);
          return;
        }
        res.redirect('/findPw');
      });
    } else {
      res.render('user/findPw', {
        title: 'test',
        uId: req.body,
        pw: req.body,
        isLogin,
        currentUser: req.session.user,
        success: true,
        msg: '비밀번호찾기 페이지 렌더링 정상 처리',
      });
    }
  } catch (error) {
    res.status(500).send({
      isLogin,
      currentUser: req.session.user,
      success: false,
      msg: '비밀번호찾기 페이지 렌더링 중 서버 에러 발생',
      error,
    });
  }
};

// 비밀번호 재설정 기능
exports.updatePassword = async (req, res) => {
  const { uId, pw } = req.body;

  try {
    // 데이터베이스에서 일치하는 사용자를 조회
    const user = await User.findOne({
      where: {
        uId: uId,
      },
    });

    if (!user) {
      // 사용자를 찾지 못한 경우
      return res.status(401).json({ error: '사용자를 찾을 수 없습니다.' });
    } else {
      if (!pw) {
        return res.status(400).json({
          OK: false,
          msg: '입력 필드 중 하나 이상이 누락되었습니다.',
        });
      }
      const hashedPw = hashPassword(pw); // 새 변수에 할당

      const updatedUser = await User.update(
        { pw: hashedPw },
        {
          where: { uId: uId },
        }
      );

      return res.status(200).json({ message: '비밀번호가 업데이트되었습니다.' });
    }
  } catch (error) {
    console.error('비밀번호 재설정 오류:', error);
    res.status(500).send('비밀번호 재설정 도중 오류가 발생했습니다.');
  }
};

// 로그인 페이지 렌더링
exports.login = (req, res) => {
  // 세션 검사
  let isLogin = req.session.user ? true : false;

  try {
    if (isLogin) {
      // 이 경우 세션 삭제 후 다시 로그인 할 수 있도록 함
      req.session.destroy((err) => {
        if (err) {
          console.log(err);
          return;
        }
        res.redirect('/login');
      });
    } else {
      res.render('user/login', {
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
exports.getEmail = async (req, res) => {
  // 세션 검사
  let isLogin = req.session.user ? true : false;

  try {
    if (isLogin) {
      // 로그인 되어있는 상태에서 이메일 인증창 가면 세션에 있는 사용자에게 저장되어있는 이메일과 일치하는지 조회
      const loggedInUserId = req.session.user;

      const loggedInUser = await User.findOne({
        where: { uId: loggedInUserId },
      });

      if (loggedInUser) {
        loggedInUserEmail = loggedInUser.email;

        res.render('user/email', {
          isLogin,
          currentUser: req.session.user,
          loggedInUserEmail, // 현재 로그인된 사용자의 이메일을 뷰에 전달
          success: true,
          msg: '페이지 렌더링 처리 성공',
        });
      } else {
        res.status(404).json({ ok: false, msg: '사용자를 찾을 수 없습니다.' });
      }
    } else {
      res.render('user/email', {
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
  let isLogin = req.session.user ? true : false;

  if (isLogin) {
    try {
      // 세션에서 사용자 아이디 가져오기
      const loggedInUserId = req.session.user;

      // 사용자 아이디를 기반으로 User 모델을 조회하여 이메일을 가져오기
      const loggedInUser = await User.findOne({
        where: { uId: loggedInUserId },
      });

      // 사용자가 로그인한 경우에만 이메일 전송
      if (loggedInUser && loggedInUser.email === req.body.email) {
        // 랜덤 인증 코드 생성
        const number = generateRandomNumber(111111, 999999);

        // 이메일 주소
        const email = req.body.email;

        // verificationCodes 객체에 인증 정보 저장
        verificationCodes[email] = {
          code: number,
          timestamp: Date.now(),
        };

        // 이메일 옵션 설정
        const mailOptions = {
          from: 'oliviamoon1124@naver.com', // 발신자 이메일 주소
          to: email, // 목적지 이메일 주소
          subject: '인증 관련 메일입니다.',
          html: '<h1>인증번호를 입력해주세요\n\n\n\n\n\n</h1>' + number,
        };

        // 이메일 전송
        smtpTransport.sendMail(mailOptions, (err, response) => {
          if (err) {
            return res.status(402).json({
              ok: false,
              error: '메일 전송에 실패하였습니다.!!!!!!!!!!!!!!',
            });
          } else {
            // 서버에서 만든 인증코드를 세션에 저장
            req.session.verificationCode = number;
            req.session.email = email;

            return res.status(200).json({
              ok: true,
              msg: '메일 전송에 성공하였습니다.!!!!!!!!!!!!!',
            });
          }
        });
      } else {
        // 사용자 정보가 올바르지 않은 경우
        return res.status(401).json({ error: '이메일 정보가 올바르지 않습니다.!!' });
      }
    } catch (error) {
      console.error('이메일 전송 중 오류 발생:', error);
      return res.status(500).json({ ok: false, error: '서버 오류' });
    }
  } else {
    const number = generateRandomNumber(111111, 999999);

    // 이메일 주소
    const email = req.body.email;

    // verificationCodes 객체에 인증 정보 저장
    verificationCodes[email] = {
      code: number,
      timestamp: Date.now(),
    };

    // 이메일 옵션 설정
    const mailOptions = {
      from: 'oliviamoon1124@naver.com', // 발신자 이메일 주소
      to: email, // 목적지 이메일 주소
      subject: '인증 관련 메일입니다.',
      html: '<h1>인증번호를 입력해주세요\n\n\n\n\n\n</h1>' + number,
    };

    // 이메일 전송
    smtpTransport.sendMail(mailOptions, (err, response) => {
      if (err) {
        res.status(402).json({ ok: false, error: '메일 전송에 실패하였습니다.' });
      } else {
        // 서버에서 만든 인증코드를 세션에 저장
        req.session.verificationCode = number;
        req.session.email = email;
        res.status(200).json({ ok: true, error: '메일 전송에 성공하였습니다.' });
      }
    });
  }
};

// '/verify' 엔드포인트를 생성
exports.postVerify = async (req, res) => {
  const { verificationCode } = req.body;

  if (req.session.verificationCode == verificationCode) {
    // 클라이언트에서 보낸 인증 코드와 저장된 코드를 비교
    req.session.verificationCode = null; // 코드 일치 시 세션에서 코드를 제거

    try {
      // 사용자 ID를 기반으로 User 모델을 조회합니다.
      const user = await User.findOne({ where: { email: req.session.email } });

      if (user) {
        // 사용자가 존재하는 경우, emailVerify 필드를 업데이트합니다.
        await User.update({ emailVerify: true }, { where: { email: req.session.email } });

        // 인증에 성공한 경우, 현재 로그인 세션을 유지합니다.
        req.session.user = user.uId;
        req.session.userImgPath = user.userImgPath;

        res.status(200).json({ ok: true, msg: '인증에 성공하였습니다.' });
      } else {
        res.status(401).json({ ok: false, msg: '사용자를 찾을 수 없습니다.' });
      }
    } catch (error) {
      console.error('인증 업데이트 오류:', error);
      res.status(402).json({ ok: false, msg: '인증 업데이트 중 오류가 발생했습니다.' });
    }
  } else {
    res.status(404).json({
      ok: false,
      msg: '인증에 실패하였습니다. 올바른 코드를 입력하세요.',
    });
  }
};
