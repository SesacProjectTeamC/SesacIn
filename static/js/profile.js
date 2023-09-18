function change(buttonType) {
  console.log(buttonType);
  const contentDiv = document.getElementById('content');
  axios({
    method: 'GET',
    url: `/users/profile/${buttonType}`,
  })
    .then((response) => {
      console.log('백엔드로부터 전달받은 데이터', response);
      const data = response.data;
      if (buttonType === 'liked') {
        liked(data, contentDiv);
        return;
      } else if (buttonType === 'commented') {
        commented(data, contentDiv);
        return;
      } else if (buttonType === 'answered') {
        answered(data, contentDiv);
        return;
      } else if (buttonType === 'qna') {
        qna(data, contentDiv);
        return;
      } else if (buttonType === 'free') {
        free(data, contentDiv);
        return;
      } else {
        contentDiv.innerHTML = '선택된 내용이 없습니다.';
      }
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      cautionA.innerHTML = '작성하신 글이 없습니다.';
    });
}
// 좋아요 선택한 글
const liked = (data, contentDiv) => {
  contentDiv.innerHTML = '';
  for (let question of data.likeQuestionData) {
    contentDiv.innerHTML += [
      `<div class="question">
            <a href="/question/${data.qId}">
            <h3>${question.title}</h3>
            <p>${question.qType}</p>
            <p>${question.content}</p>
            </div>`,
    ];
    console.log('liked');
  }

  for (let boards of data.boardsData) {
    contentDiv.innerHTML += [
      `
                <div class="freeBoards">
                <a href="/board/detail/${data.bId}">
                <p>${boards.title}</p>
                <p>${boards.content}</p>
                <div class="like">
                <img src="../../static/svg/heart.svg" alt="좋아요" width="5px" class="svg"/>
                <p>${boards.likeCount}</p>
                <img src="../../static/svg/message.svg" alt="답변개수" width="5px" class="svg"/>
                <p>${boards.viewCount}</p>
                </div>
                </div>
                `,
    ];
    console.log('liked');
  }
};
//댓글 단 글
const commented = (data, contentDiv) => {
  console.log(data);
  contentDiv.innerHTML = '';
  for (let answer of data.likeAnswerData) {
    contentDiv.innerHTML += [
      `
      <div class="answer">
      <a href="/question/${data.qId}">
        <h3>${answer.title}</h3>
        <p>${answer.content}</p>
        </div>`,
    ];
    console.log('commented');
  }
  for (let boards of data.boardsData) {
    contentDiv.innerHTML += [
      `
                <div class="freeBoards">
                <a href="/board/detail/${data.bId}">
                <p>${boards.title}</p>
                <p>${boards.content}</p>
                <div class="like">
                <img src="../../static/svg/heart.svg" alt="좋아요" width="5px" class="svg"/>
                <p>${boards.likeCount}</p>
                <img src="../../static/svg/message.svg" alt="답변개수" width="5px" class="svg"/>
                <p>${boards.viewCount}</p>
                </div>
                </div>`,
    ];
    console.log('commented');
  }
};

// qna 게시글
const qna = (data, contentDiv) => {
  contentDiv.innerHTML = '';
  for (let post of data.postData) {
    contentDiv.innerHTML += [
      `
      <div class="postedQuestion">
      <a href ="/question/${data.qId}">
        <div class="qna">
        <h3>${post.title}</h3>
        <p>${post.content}</p>
        <div class="like">
        <img src="../../static/svg/heart.svg" alt="좋아요" width="5px" class="svg"/>
        <p>${post.likeCount}</p>
        <img src="../../static/svg/message.svg" alt="답변개수" width="5px" class="svg"/>
        <p>${post.viewCount}</p>
        </div>
        </div>
        <hr>
        </div>`,
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
  for (let boards of data.boardsData) {
    contentDiv.innerHTML += [
      `
                <div class="freeBoards">
                <a href="/board/detail/${data.bId}">
                <p>${boards.title}</p>
                <p>${boards.content}</p>
                <div class="like">
                <img src="../../static/svg/heart.svg" alt="좋아요" width="5px" class="svg"/>
                <p>${boards.likeCount}</p>
                <img src="../../static/svg/message.svg" alt="답변개수" width="5px" class="svg"/>
                <p>${boards.viewCount}</p>
                </div>
                </div>`,
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

async function userProfileImgUpload() {
  const formData = new FormData();
  const file = document.getElementById('fileInput');

  formData.append('userImgFile', file.files[0]);

  await axios({
    method: 'post',
    url: '/upload/image/user',
    data: formData,
    header: {
      'Content-Type': 'multipart/form-data',
    },
  }).then((res) => {
    location.href = location.href;
  });
}

function goTohome() {
  window.location.href = '/';
}
