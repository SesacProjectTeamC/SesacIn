const {User} = require("../models");
const {Op} = require("sequelize");
const bcrypt = require("bcrypt");

// 회원가입 창 렌더링
exports.getJoin = (req, res) => {
  res.render("join");
};

// 회원 가입 시 사용자 생성
exports.postUser = async (req, res) => {
  console.log(req.body);
  try {
    let {uId, pw, uName, email, isSesac, campus} = req.body;
    // db에 넣기전 pw 암호화
    // pw = hashPassword(pw);

    // null 값이거나 비속어 등이 섞여있으면 처리하기

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
    res.send("Internal Server Error");
  }
};

//////////////////////////////// 회원 정보 페이지

/// 회원 조회
exports.getUser = async (req, res) => {
  try {
    const {uId} = req.params; // 객체에서 꺼내온 유저 아이디 값

    //!! (START) test 위해 잠시 주석처리합니다.
    // // 세션에서 로그인 된 사용자 id 가져오기
    // const loginUserId = req.session.user;

    // // 현재 로그인 된 사용자의 ID와 요청된 사용자 ID가 일치하는지 확인
    // if (loginUserId === uId) {
    //   // 데이터베이스에서 해당 사용자 정보를 조회합니다.
    //   const user = await User.findOne({
    //     where: { uId: uId },
    //   });
    //   // 사용자 정보를 마이페이지 템플릿에 전달하여 렌더링합니다.
    //   res.render('profileTest', { userData: user });
    // } else {
    //   // 현재 로그인한 사용자와 요청된 사용자가 다를 경우 권한 없음을 응답
    //   res
    //     .status(403)
    //     .send('Forbidden: You do not have permission to access this page.');
    // }
    //!! (END) test 위해 잠시 주석처리합니다.

    // !! (START) test용 1번 유저 가져오기
    const user = await User.findOne({
      where: { uId: 1 },
    });
    console.log('User>>>>', user);

    res.render('profileTest', { userData: user });
    // !! (END) test용 1번 유저 가져오기
  } catch (err) {
    console.error(err);
    res.send("Internal Server Error");
  }
};

/////////////////////////////////////////////////// 사용자 정보 수정 페이지
// 정보 수정 창 렌더링
exports.getUserInfo = (req, res) => {
  // 이 부분에서 사용자 정보를 가져오는 로직 추가
  // 예를 들어, req.session.user 를 사용하여 사용자 정보를 가져옵니다.
  const userData = {
    uId: req.session.user, // 세션에서 사용자 ID 가져오기
  };
  // ********** 추후에 어떤 화면으로 이동할 지 이름 수정 필요할수도 있음
  res.render("editprofile", {userData});
};

// 회원 정보 수정 - 비밀번호, 이름 (이미지는 후순위)
exports.patchUser = async (req, res) => {
  try {
    const uId = req.session.user;
    console.log(uId);

    const userData = {uId: uId};
    let {pw, uName} = req.body;
    console.log(req.body);

    pw = hashPassword(pw);
    // update는 바꿔야하는 인자, 어디에 있는 건지 where 인자
    const updatedUser = await User.update(
      {pw: pw, uName: uName},
      {
        where: {uId},
      }
    );

    res.send(updatedUser); // 성공시 [1], 실패시 [0]
    // res.redirect('/') // 추후 어떤 페이지로 이동시키려면 수정
  } catch (err) {
    console.error(err);
    res.send("Internal Server Error");
  }
};

// 회원 삭제 - 회원 탈퇴할 경우
exports.deleteUser = async (req, res) => {
  try {
    const uId = req.session.user;
    const isDeleted = await User.destroy({
      where: {uId},
    });
    // console.log(isDeleted); // 성공시 1, 실패시 0
    if (isDeleted) {
      // 성공적으로 삭제된 경우
      req.session.destroy((err) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Internal Server Error");
        }
        res.send(true);
      });
    } else {
      // 삭제 실패
      res.send(false);
    }
  } catch (err) {
    console.error(err);
    res.send("Internal Server Error");
  }
};

// 로그인 페이지 렌더링
exports.login = (req, res) => {
  res.render("login", {
    title: "test",
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
    return res.status(401).json({message: "사용자를 찾을 수 없습니다."});
  }

  // 암호 검사
  const passCheck = comparePassword(req.body.pw, resultUser.pw);

  // 성공 처리
  if (passCheck) {
    // 로그인 성공처리. 세션에 uId 저장
    req.session.user = resultUser.uId;
    // 성공 응답 보내주기
    return res.status(200).json({
      message: "로그인 성공",
      isLogin: true,
    });
  } else {
    return res.status(401).json({message: "비밀번호 불일치"});
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
    res.redirect("/");
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
