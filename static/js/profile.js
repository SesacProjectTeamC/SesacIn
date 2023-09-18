function change(buttonType) {
  console.log(buttonType);
  const contentDiv = document.getElementById("content");
  axios({
    method: "GET",
    url: `/users/profile/${buttonType}`,
  })
    .then((response) => {
      console.log("백엔드로부터 전달받은 데이터", response);
      const data = response.data;
      if (buttonType === "liked") {
        liked(data, contentDiv);
        return;
      } else if (buttonType === "commented") {
        commented(data, contentDiv);
        return;
      } else if (buttonType === "answered") {
        answered(data, contentDiv);
        return;
      } else if (buttonType === "qna") {
        qna(data, contentDiv);
        return;
      } else if (buttonType === "free") {
        free(data, contentDiv);
        return;
      } else {
        contentDiv.innerHTML = "선택된 내용이 없습니다.";
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      cautionA.innerHTML = "작성하신 글이 없습니다.";
    });
}
// 좋아요 선택한 글
const liked = (data, contentDiv) => {
  contentDiv.innerHTML = "";
  for (let question of data.likeQuestionData) {
    contentDiv.innerHTML += [
      `<div class="question">
            <a href="/question/${data.qId}">
            <h3>${question.title}</h3>
            <p>${question.qType}</p>
            <p>${question.content}</p>
            </div>`,
    ];
    console.log("liked");
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
    console.log("liked");
  }
};
//댓글 단 글
const commented = (data, contentDiv) => {
  console.log(data);
  contentDiv.innerHTML = "";
  for (let answer of data.likeAnswerData) {
    contentDiv.innerHTML += [
      `
      <div class="answer">
      <a href="/question/${data.qId}">
        <h3>${answer.title}</h3>
        <p>${answer.content}</p>
        </div>`,
    ];
    console.log("commented");
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
    console.log("commented");
  }
};

// qna 게시글
const qna = (data, contentDiv) => {
  contentDiv.innerHTML = "";
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
    console.log("qna");
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
  contentDiv.innerHTML = "";
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
    console.log("free");
  }
};

function isSesac(data) {
  const sesacElements = document.getElementsByClassName("sesac_badge");
  axios({
    method: "GET",
    url: "/users/profile",
  })
    .then((response) => {
      const data = response.data;
      if (data.isSesac === true) {
        for (let element of sesacElements) {
          element.style.display = ""; // 기본값으로 재설정하여 엘리먼트를 보이게 합니다.
        }
      } else {
        for (let element of sesacElements) {
          element.style.display = "none"; // 엘리먼트를 숨깁니다.
        }
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function editProfile() {
  axios({
    method: "GET",
    url: "/users/editprofile",
  }).then((res) => {
    if (res) {
    }
  });
}
function fileUpload() {
  console.log("동적 파일 업로드");
  // js파일만으로 폼을 전송 ( 파일 데이터를 서버로 전송해야 하는 케이스)
  // FormData 객체를 활용하면 쉽게 전송 가능!
  const formData = new FormData();
  const file = document.querySelector("#dynamic-file");
  console.dir(file);
  console.dir(file.files);
  console.dir(file.files[0]);

  //append( key, value)
  formData.append("dynamicUserfile", file.files[0]);

  axios({
    method: "post",
    url: "/dynamicFile",
    data: formData,
    header: {
      "Content-Type": "multipart/form-data",
    },
  }).then((res) => {
    const {data} = res;
    console.log(data);
    document.querySelector("img").src = "/" + data.path;
  });
}

function goTohome() {
  window.location.href = "/";
}
