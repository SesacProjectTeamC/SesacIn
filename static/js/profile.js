function change(buttonType) {
  const contentDiv = document.getElementById("content");
  const cautionDiv = document.getElementById("caution");

  cautionDiv.style.display = "none";
  axios({
    method: "GET",
    url: `/users/profile/${buttonType}`,
  })
    .then((response) => {
      const data = response.data;
      if (buttonType === "liked") {
        liked(data, contentDiv);
        return;
      } else if (buttonType === "commented") {
        commented(data, contentDiv);
        return;
      } else if (buttonType === "qna") {
        qna(data, contentDiv);
        return;
      } else if (buttonType === "free") {
        free(data, contentDiv);
        return;
      } else {
        contentDiv.style.display = "none";
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      contentDiv.style.display = "none";
    });
}

const emptyData = (text) => {
  const cautionDiv = document.getElementById("caution");

  cautionDiv.style.display = "block";
  cautionDiv.style.padding = "20px";
  cautionDiv.style.borderRadius = "10px";
  content.style.display = "none";
  cautionDiv.innerHTML = text;
};

//=== 1. qna 게시글 ===
const qna = (data, contentDiv) => {
  contentDiv.innerHTML = "";

  if (data.qnaData.length === 0) {
    emptyData("작성한 게시글이 없습니다.");
    return;
  }
  content.style.display = "block";

  for (let i = 0; i < data.qnaData.length; i++) {
    contentDiv.innerHTML += [
      `
      <div class="postedQuestion">
      <a href ="/question/${data.qnaData[i].qId}">
        <div class="qnaList">
        <div class="question title">${data.qnaData[i].title}</div>
        <div class="question content">${data.qnaData[i].content}</div>
        <div class="like">
        <img src="../../static/svg/heart.svg" alt="좋아요" width="5px" class="svg"/>
        <p>${data.qnaData[i].likeCount}</p>
        <img src="../../static/img/question-and-answer.png" alt="답변개수" width="5px" class="svg"/>
        <p>${data.qnaAnswerCount[i]}</p>
        </div>
        </div>
        </a> 
        </div>
        <hr>
        `,
    ];
  }
};

//=== 2. 자유 게시판 ===
const free = (data, contentDiv) => {
  contentDiv.innerHTML = "";

  if (data.boardsData.length === 0) {
    emptyData("작성한 게시글이 없습니다.");
    return;
  }

  contentDiv.style.display = "block";
  for (let i = 0; i < data.boardsData.length; i++) {
    contentDiv.innerHTML += [
      `
                <div class="freeBoards">
                <a href="/board/detail/${data.boardsData[i].bId}">
                <div class="freeList">
                <div class="board title">${data.boardsData[i].title}</div>
                <div class="board content">${data.boardsData[i].content}</div>
                <div class="like">
                <img src="../../static/svg/heart.svg" alt="좋아요" width="5px" class="svg"/>
                <p>${data.boardsData[i].likeCount}</p>
                <img src="../../static/svg/message.svg" alt="답변개수" width="5px" class="svg"/>
                <p>${data.commentsCount[i]}</p>
                </div>
                </div>
        </a> 
                </div>
                <hr>
                `,
    ];
  }
};

//=== 3. 좋아요 선택한 글 ===
const liked = (data, contentDiv) => {
  contentDiv.innerHTML = "";
  contentDiv.style.display = "block";

  if (
    data.likeQuestionData.length === 0 &&
    data.likeAnswerData.length === 0 &&
    data.likeBoardData.length === 0
  ) {
    emptyData("좋아요 누른 글이 없습니다.");
    return;
  }

  if (data.likeQuestionData || data.likeBoardData || data.likeAnswerData) {
    if (data.likeQuestionData) {
      for (let i = 0; i < data.likeQuestionData.length; i++) {
        contentDiv.innerHTML += [
          `
      <div class="answer">
      <a href ="/question/${data.likeQuestionData[i].qId}">
        <div class="qnaList">
        <div class="likeQ title">${data.likeQuestionData[i].title}</div>
        <div class="likeQ content">${data.likeQuestionData[i].content}</div>
        <div class="like">
        <img src="../../static/svg/heart.svg" alt="좋아요" width="5px" class="svg"/>
        <p>${data.likeQuestionData[i].likeCount}</p>
        <img src="../../static/img/question-and-answer.png" alt="답변개수" width="5px" class="svg"/>
        <p>${data.likeQuestionAnswerCount[i]}</p>
        </div>
        </div>
        </a> 
        </div>
        <hr>
        `,
        ];
      }
    }

    if (data.likeAnswerData) {
      for (let i = 0; i < data.likeAnswerData.length; i++) {
        contentDiv.innerHTML += [
          `
                <div class="answer">
                <a href="/question/${data.likeAnswerData[i].qId}">
                <div class="freeList">
                <div class="likeA title">${data.likeAnswerData[i].title}</div>
                <div class="likeA content">${data.likeAnswerData[i].content}</div>
                <div class="like">
                <img src="../../static/svg/heart.svg" alt="좋아요" width="5px" class="svg"/>
                <p>${data.likeAnswerData[i].likeCount}</p>
                <img src="../../static/svg/message.svg" alt="답변개수" width="5px" class="svg"/>
                <p>${data.likeAnswerCommentCount[i]}</p>
                </div>
                </div>
                </a> 
                </div>
                <hr>
                `,
        ];
      }
    }

    if (data.likeBoardData.length > 0) {
      for (let i = 0; i < data.likeBoardData.length; i++) {
        contentDiv.innerHTML += [
          `
          <div class="freeBoards">
          <a href="/board/detail/${data.likeBoardData[i].bId}">
                <div class="freeList">
                <div class="likeB title">${data.likeBoardData[i].title}</di>
                <div class="likeB content">${data.likeBoardData[i].content}</div>
                <div class="like">
                <img src="../../static/svg/heart.svg" alt="좋아요" width="5px" class="svg"/>
                <p>${data.likeBoardData[i].likeCount}</p>
                <img src="../../static/svg/message.svg" alt="답변개수" width="5px" class="svg"/>
                <p>${data.likeBoardCommentCount[i]}</p>
                </div>
                </div>
                </a> 
                </div>
                <hr>
                `,
        ];
      }
    }
  }
};

//=== 4. 댓글 단 글 (전체 qna랑 free 둘다 가져옴) ===
const commented = (data, contentDiv) => {
  contentDiv.innerHTML = "";
  contentDiv.style.display = "block";

  if (data.commentData.length === 0) {
    emptyData("작성한 댓글이 없습니다.");
    return;
  }

  if (data.commentData.length > 0) {
    for (let i = 0; i < data.commentData.length; i++) {
      if (data.commentData[i].aId) {
        contentDiv.innerHTML += [
          `
                    <div class="answer">
                    <a href="/question/${data.commentData[i].qId}">
                    <div class="commentedList">
                    <div class="comment content">${data.commentData[i].content}</div>
                    </div>
                    </div>
                    <hr>
                    `,
        ];
      }

      if (data.commentData[i].bId) {
        contentDiv.innerHTML += [
          `
                  <div class="answer">
                  <a href="/board/detail/${data.commentData[i].bId}">
                  <div class="commentedList">
                  <div class="comment content">${data.commentData[i].content}</div>
                  </div>
                  </div>
                  <hr>
                  `,
        ];
      }
    }
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
          element.style.display = "";
        }
      } else {
        for (let element of sesacElements) {
          element.style.display = "none";
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

function userProfileImgUpload() {
  const formData = new FormData();
  const file = document.getElementById("fileInput");

  formData.append("userImgFile", file.files[0]);

  axios({
    method: "post",
    url: "/upload/image/user",
    data: formData,
    header: {
      "Content-Type": "multipart/form-data",
    },
  })
    .then((res) => {
      location.href = location.href;
    })
    .catch((err) => {
      if (err.response.status) {
        alert("err.response.data.error");
      } else {
        alert("지원하지 않는 파일 형식입니다.");
      }
    });
}

function goTohome() {
  window.location.href = "/";
}

function userLogout() {
  axios({
    method: "post",
    url: "/logout",
  })
    .then((response) => {
      window.location.href = "/";
    })
    .catch((error) => {
      window.location.href = "/404";
    });
}
