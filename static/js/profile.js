function change(buttonType) {
  console.log(buttonType);
  const contentDiv = document.getElementById('content');
  const cautionDiv = document.getElementById('caution');
  cautionDiv.style.display = 'none';
  axios({
    method: 'GET',
    url: `/users/profile/${buttonType}`,
  })
    .then((response) => {
      console.log('백엔드로부터 전달받은 데이터', response);
      const data = response.data;
      console.log(data);
      if (buttonType === 'liked') {
        liked(data, contentDiv);
        return;
      } else if (buttonType === 'commented') {
        commented(data, contentDiv);
        return;
      } else if (buttonType === 'qna') {
        qna(data, contentDiv);
        return;
      } else if (buttonType === 'free') {
        free(data, contentDiv);
        return;
      } else {
        contentDiv.style.display = 'none';
      }
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      contentDiv.style.display = 'none';
    });
}

// 좋아요 선택한 글
const liked = (data, contentDiv) => {
  contentDiv.innerHTML = '';
  const cautionDiv = document.getElementById('caution');

  if (data.boardsData.length === 0 || data.postData.length === 0) {
    cautionDiv.style.display = 'block';
    cautionDiv.innerHTML = '🙏🏻 작성한 게시글이 없습니다.🙏🏻';
    contentDiv.style.display = 'none';
    return;
  }
  contentDiv.style.display = 'block';
  for (let i = 0; i < data.likeQuestionData.length; i++) {
    contentDiv.innerHTML += [
      `
      <div class="postedQuestion">
      <a href ="/question/${data.likeQuestionData[i].qId}">
        <div class="qnaList">
        <h3>${data.likeQuestionData[i].title}</h3>
        <h3>${data.likeQuestionData[i].content}</h3>
        <div class="like">
        <img src="../../static/svg/heart.svg" alt="좋아요" width="5px" class="svg"/>
        <p>${data.likeQuestionData[i].likeCount}</p>
        <img src="../../static/img/question-and-answer.png" alt="답변개수" width="5px" class="svg"/>
        <p>${data.postAnswerCount[i]}</p>
        </div>
        </div>
        </div>
        <hr>
        `,
    ];
    console.log('qna');
  }

  for (let i = 0; i < data.likeAnswerData.length; i++) {
    contentDiv.innerHTML += [
      `
                <div class="freeBoards">
                <a href="/board/detail/${data.likeAnswerData[i].bId}">
                <div class="freeList">
                <h3>${data.likeAnswerData[i].title}</h3>
                <h3>${data.likeAnswerData[i].content}</h3>
                <div class="like">
                <img src="../../static/svg/heart.svg" alt="좋아요" width="5px" class="svg"/>
                <p>${data.likeAnswerData[i].likeCount}</p>
                <img src="../../static/svg/message.svg" alt="답변개수" width="5px" class="svg"/>
                <p>${data.commentsCount[i]}</p>
                </div>
                </div>
                </div>
                <hr>
                `,
    ];
    console.log('free');
  }
  for (let i = 0; i < data.likeBoardData.length; i++) {
    contentDiv.innerHTML += [
      `
                <div class="freeBoards">
                <a href="/board/detail/${data.likeBoardData[i].bId}">
                <div class="freeList">
                <h3>${data.likeBoardData[i].title}</h3>
                <h3>${data.likeBoardData[i].content}</h3>
                <div class="like">
                <img src="../../static/svg/heart.svg" alt="좋아요" width="5px" class="svg"/>
                <p>${data.likeBoardData[i].likeCount}</p>
                <img src="../../static/svg/message.svg" alt="답변개수" width="5px" class="svg"/>
                <p>${data.commentsCount[i]}</p>
                </div>
                </div>
                </div>
                <hr>
                `,
    ];
    console.log('free');
  }
};
//댓글 단 글 (전체 qna랑 free 둘다 가져옴)
const commented = (data, contentDiv) => {
  console.log(data);
  contentDiv.innerHTML = '';
  const cautionDiv = document.getElementById('caution');

  if (data.boardsData.length === 0 || data.postData.length === 0) {
    cautionDiv.style.display = 'block';
    cautionDiv.innerHTML = '🙏🏻 작성한 게시글이 없습니다.🙏🏻';
    contentDiv.style.display = 'none';
    return;
  }
  contentDiv.style.display = 'block';
  for (let comment of data.commentData) {
    if (!comment.qId) {
      //free
      contentDiv.innerHTML += [
        `
                    <div class="question">
                    <a href="/board/detail/${comment.bId}">
                    <div class="commentedList">
                    <h3>${comment.content}</h3>
                    </div>
                    </div>
                    <hr>
                    `,
      ];
    } else {
      //qna
      contentDiv.innerHTML += [
        `
                    <div class="freeBoards">
                    <a href="/question/${comment.qId}">
                    <div class="commentedList">
                    <he>${comment.content}</h3>
                    </div>
                    </div>
                    <hr>
                    `,
      ];
    }
    console.log('commented');
  }
};

// qna 게시글
const qna = (data, contentDiv) => {
  contentDiv.innerHTML = '';
  const cautionDiv = document.getElementById('caution');

  if (data.postData.length === 0) {
    cautionDiv.style.display = 'block';
    content.style.display = 'none';
    cautionDiv.innerHTML = '🙏🏻 작성한 게시글이 없습니다.🙏🏻';
    return;
  }
  content.style.display = 'block';

  for (let i = 0; i < data.postData.length; i++) {
    contentDiv.innerHTML += [
      `
      <div class="postedQuestion">
      <a href ="/question/${data.postData[i].qId}">
        <div class="qnaList">
        <h3>${data.postData[i].title}</h3>
        <h3>${data.postData[i].content}</h3>
        <div class="like">
        <img src="../../static/svg/heart.svg" alt="좋아요" width="5px" class="svg"/>
        <p>${data.postData[i].likeCount}</p>
        <img src="../../static/img/question-and-answer.png" alt="답변개수" width="5px" class="svg"/>
        <p>${data.postAnswerCount[i]}</p>
        </div>
        </div>
        </div>
        <hr>
        `,
    ];
    console.log('qna');
  }
};

// const answered = (data, contentDiv) => {
//   contentDiv.innerHTML = "";
//   for (let answer of data.answerData) {
//     contentDiv.innerHTML = [
//             `<div class="postedAnswer">
//            <a href ="/question/${data.qId}">
//             <h3>${answer.title}</h3>
//             <p>${answer.content}</p>
//             </div>
//             `,
//     ];
//   }
//   console.log("answered");
// };

// 자유 게시판
const free = (data, contentDiv) => {
  contentDiv.innerHTML = '';
  const cautionDiv = document.querySelector('#caution');

  if (data.boardsData.length === 0) {
    cautionDiv.style.display = 'block';
    cautionDiv.innerHTML = '🙏🏻 작성한 게시글이 없습니다.🙏🏻';
    contentDiv.style.display = 'none';
    return;
  }
  contentDiv.style.display = 'block';
  for (let i = 0; i < data.boardsData.length; i++) {
    contentDiv.innerHTML += [
      `
                <div class="freeBoards">
                <a href="/board/detail/${data.boardsData[i].bId}">
                <div class="freeList">
                <h3>${data.boardsData[i].title}</h3>
                <h3>${data.boardsData[i].content}</h3>
                <div class="like">
                <img src="../../static/svg/heart.svg" alt="좋아요" width="5px" class="svg"/>
                <p>${data.boardsData[i].likeCount}</p>
                <img src="../../static/svg/message.svg" alt="답변개수" width="5px" class="svg"/>
                <p>${data.commentsCount[i]}</p>
                </div>
                </div>
                </div>
                <hr>
                `,
    ];
    console.log('free');
  }
};

function isSesac(data) {
  const sesacElements = document.getElementsByClassName('sesac_badge');
  axios({
    method: 'GET',
    url: '/users/profile',
  })
    .then((response) => {
      const data = response.data;
      if (data.isSesac === true) {
        for (let element of sesacElements) {
          element.style.display = ''; // 기본값으로 재설정하여 엘리먼트를 보이게 합니다.
        }
      } else {
        for (let element of sesacElements) {
          element.style.display = 'none'; // 엘리먼트를 숨깁니다.
        }
      }
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
}

function editProfile() {
  axios({
    method: 'GET',
    url: '/users/editprofile',
  }).then((res) => {
    if (res) {
    }
  });
}

// function handleFileInput() {
//   // 파일 입력 요소 가져오기
//   // var fileInput = document.getElementById('fileInput');

//   // 파일이 선택되었는지 확인
//   // if (fileInput.files.length > 0) {
//   //   // 선택한 파일의 정보를 가져와서 표시
//   //   var selectedFile = fileInput.files[0];
//   //   alert('선택한 파일: ' + selectedFile.name);
//   // } else {
//   //   alert('파일을 선택하지 않았습니다.');
//   // }

//   const formData = new FormData();
//   const file = document.getElementById('fileInput');
//   // const file = document.querySelector('#dynamic-file');
//   // console.dir(file);
//   // console.dir(file.files);
//   // console.dir(file.files[0]);
// }

function userProfileImgUpload() {
  const formData = new FormData();
  const file = document.getElementById('fileInput');
  console.log(file);
  formData.append('userImgFile', file.files[0]);

  axios({
    method: 'post',
    url: '/upload/image/user',
    data: formData,
    header: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then((res) => {
      location.href = location.href;
    })
    .catch((err) => {
      if (err.response.status) {
        alert(err.response.data.error);
      }
    });
}

function goTohome() {
  window.location.href = '/';
}

function userLogout() {
  axios({
    method: 'post',
    url: '/logout',
  })
    .then((response) => {
      window.location.href = '/';
    })
    .catch((error) => {
      // 에러발생시 프론트에서 처리
      console.log(error.response.data);
      window.location.href = '/404';
    });
}
