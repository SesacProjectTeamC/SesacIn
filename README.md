# SesacIn (Sesac + 지식in)

<center><img src="./static/img/header-logo-2.png" width="500" />

새싹 캠퍼스 학생들을 위한 SesacIn 커뮤니티 프로젝트입니다.

&nbsp;

🖥️ 프로젝트 소개
--

&nbsp;
새싹인들을 위한 지식 공유 커뮤니티입니다.

[새싹인 서비스 바로가기](https://sesacin.online/)

[새싹인 프로젝트 포트폴리오 바로가기](https://polydactyl-cello-2db.notion.site/1efa19cb902d448da0a5a11271e66488?pvs=4)
&nbsp;

🕰️ 개발 기간
--
23.09.06일 - 23.09.22일
</center>
&nbsp;

## 시작 가이드
### Requirements


- [Node.js 20.7.0](https://www.npmjs.com/package/node/v/20.7.0)
- [Npm 10.2.0](https://www.npmjs.com/package/npm/v/10.2.0)


### Installation
``` bash
$ git clone https://github.com/SesacProjectTeamC/SesacIn.git
```

```
$ npm i
$ npm start
```


### 🧑‍🤝‍🧑 팀 구성

| 프론트 개발 | 프론트 개발 | 백엔드 개발 | 백엔드 개발 |백엔드 개발 |
|---|---|---|---|---|
| <img src="static/img/profile_sangwoo.jpeg" width="100px" height="100px" alt="이미지 설명"> | <img src="static/img/profile_chaelim.jpeg" width="100px" height="100px" alt="이미지 설명"> | <img src="static/img/profile_sehwa.jpeg" width="100px" height="100px" alt="이미지 설명">| <img src="static/img/profile_taegyun.jpeg" width="100px" height="100px" alt="이미지 설명"> | <img src="static/img/profile_hyojin.jpeg" width="100px" height="100px" alt="이미지 설명">
|  [@sangwoo](https://github.com/Sangwoo97) | [@chaelim](https://github.com/ellin45) | [@sehwa](https://github.com/loveflora)| [@taegyun](https://github.com/hotdog7778) | [@hyojin](https://github.com/jinnymoon1124)
| 김상우 | 정채림 | 김세화 | 김태균 | 문효진    



| 이름    | 담당 역할                                      |
|-------|------------------------------------------------|
| 김상우 | 메인 페이지 및 게시판 작성 및 상세 페이지 구현     |
| 정채림 | 사용자 관련 페이지 구현, 마이페이지 게시글 분류 정리|
| 김세화 | 질문 게시판 관련 API 개발, 좋아요 및 조회수 기능 개발|
| 김태균 | 자유 게시판 관련 API 개발, 페이지네이션 기능, 미들웨어 처리|
| 문효진 | 사용자 관련 API 개발, 이메일 인증 및 유효성 검사    |


&nbsp;

### ⚙️ 개발 환경

**[FE]**
 ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)![Bootstrap](https://img.shields.io/badge/bootstrap-%238511FA.svg?style=for-the-badge&logo=bootstrap&logoColor=white)
 
**[BE]** ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)	![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)


**[DB]** 	![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white) ![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white)


 **[SERVER]**
 	![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)

**[COMMUNITY]**
![SLACK](https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=slack&logoColor=white)
![NOTION](https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white)
&nbsp;


📌 주요 기능
--
|          |        |
|----------|--------| 
| 로그인 | 회원가입 |
|<img src="./static/img/login.gif" width="300px" height="300px">|<img src="./static/img/register.gif" width="300px" height="300px">|
|아이디찾기 |비밀번호 찾기|
|<img src="./static/img/아이디찾기.gif" width="300px" height="300px">|<img src="./static/img/%EB%B9%84%EB%B0%80%EB%B2%88%ED%98%B8_%EC%B0%BE%EA%B8%B0.gif" width="300px" height="300px">|
|Q&A 게시판질문에 대한 답변 작성,답변에 대한 댓글 작성|자유게시판 글에 댓글 작성 및 수정|
|<img src="./static/img/Q%26A%EA%B2%8C%EC%8B%9C%ED%8C%90%EB%8B%B5%EB%B3%80%EB%8C%93%EA%B8%80.gif" width="300px" height="300px">|<img src="./static/img/%EC%9E%90%EC%9C%A0%EA%B2%8C%EC%8B%9C%ED%8C%90_%EB%8C%93%EA%B8%80.gif" width="300px" height="300px">|
|Q&A 게시판 , 자유 게시판 글 작성|마이페이지 내 게시글, 좋아요, 댓글 조회| 
|<img src="./static/img/%EA%B8%80%20%EC%9E%91%EC%84%B1%ED%95%98%EA%B8%B0.gif" width="300px" height="300px">|<img src="./static/img/%EB%A7%88%EC%9D%B4%ED%8E%98%EC%9D%B4%EC%A7%80_%EC%A1%B0%ED%9A%8C.gif" width="300px" height="300px">|



## ERD
&nbsp;
<img src="./static/img/ERD.png" width="600px" height="600px">

## 와이어 프레임
&nbsp;
<img src="./static/img/%EC%99%80%EC%9D%B4%EC%96%B4%20%ED%94%84%EB%A0%88%EC%9E%84.png" width="600px" height="600px">


- ID 및 닉네임 중복 체크
- 닉네임 비속어 필터
- 유효성 검사
 
&nbsp;

로그인

- DB 값 검증
- ID 찾기
- 비밀번호 재설정  
    - 이메일 인증 여부에 따라 동작 
- 로그인 시 세션( Session ) 생성
 
&nbsp;

메인페이지

- 로그인 여부에 따라 헤더 변경
- 캐러셀 링크 연동
- 게시판 별 최근 20개의 글 스와이퍼 형식으로 제공
- 각 게시글에 대한 좋아요, 조회수, 댓글 수 확인
 
&nbsp;

Q&A 게시판

- CRUD
- 질문 유형별 태그 선택
- 질문에 대한 답변 작성
    - 답변에 대한 댓글 작성 
- 좋아요 및 조회수 확인
 
&nbsp;

자유 게시판 

- CRUD
- 댓글 작성
- 좋아요 및 조회수 확인
 
&nbsp;

마이페이지

- 프로필 사진 변경
- 활동 기록 조회 기능
    - 작성한 게시글 ( QnA / 자유 )
    - 댓글 작성한 게시글
    - 좋아요 누른 게시글
 
&nbsp;

회원 정보 수정

- 닉네임 중복 검사
- 비속어 필터
- 유효성 검사
- 회원 탈퇴



## 디렉토리 구조

```bash
├── README.md
├── api.http
├── app.js
├── config
│   ├── config.json
│   └── email.js
├── controller
│   ├── Canswer.js
│   ├── Cboard.js
│   ├── Ccomment.js
│   ├── Cmain.js
│   ├── Cprofile.js
│   ├── Cquestion.js
│   ├── Cupload.js
│   └── Cuser.js
├── middlewares
│   ├── badWordsFilter
│   │   └── badWordsFilter.js
│   ├── multer
│   │   └── multerConfig.js
│   ├── needToLogin.js
│   ├── session
│   │   └── session.js
│   └── swagger
│       ├── swagger.js
│       └── swaggerDefinition.json
├── models
│   ├── Answer.js
│   ├── Board.js
│   ├── Comment.js
│   ├── Like.js
│   ├── Question.js
│   ├── User.js
│   └── index.js
├── routes
│   ├── boardRouter.js
│   ├── index.js
│   ├── profileRouterToBeDelete.js
│   ├── questionRouter.js
│   ├── uploadRouter.js
│   └── usersRouter.js
├── static
│   ├── editor
│   │   ├── ckeditor.js
│   │   └── editorStyle.css
│   ├── editorImg
│   ├── img
│   ├── js
│   │   ├── boardDetail.js
│   │   ├── edit.js
│   │   ├── index.js
│   │   ├── listMain.js
│   │   ├── main.js
│   │   ├── post.js
│   │   ├── profile.js
│   │   └── questionDetail.js
│   ├── profileImg
│   └── svg
└── views
    ├── 404.ejs
    ├── community
    │   ├── boardDetail.ejs
    │   ├── edit.ejs
    │   ├── listMain.ejs
    │   ├── post.ejs
    │   └── questionDetail.ejs
    ├── components
    │   ├── carousel.ejs
    │   ├── cdn.ejs
    │   ├── footer.ejs
    │   ├── freeBoardCard.ejs
    │   ├── header.ejs
    │   └── questionBoardCard.ejs
    ├── main.ejs
    ├── styles
    │   ├── boardDetail.css
    │   ├── editProfile.css
    │   ├── email.css
    │   ├── findId.css
    │   ├── findPw.css
    │   ├── globalstyle.css
    │   ├── index.css
    │   ├── listMain.css
    │   ├── login.css
    │   ├── post.css
    │   ├── profile.css
    │   └── register.css
    └── user
        ├── editprofile.ejs
        ├── email.ejs
        ├── findId.ejs
        ├── findPw.ejs
        ├── join.ejs
        ├── login.ejs
        └── profile.ejs

```