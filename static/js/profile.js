const { likeQuestion } = require("../../controller/Cquestion");

function change(type) {
  const content = document.getElementById("content");

  //처음에 초기화
  content.innerHTML = "";

  fetchData(type);
}

function change(buttonType) {
  const contentDiv = document.getElementById('content');

  // 서버에서 데이터 가져오기
  axios.post('/users/profile')
      .then(response => {
          const data = response.data;

          switch (buttonType) {
              case 'likedQuestion':
                  let likedQuestionsHtml = '';
                  for (let question of data.likeQuestionData) {
                      likedQuestionsHtml += `
                          <div class="question">
                              <h3>${question.title}</h3>
                              <p>질문 유형: ${question.qType}</p>
                              <p>${question.content}</p>
                              <p>조회수: ${question.viewCount}</p>
                              <p>좋아요 수: ${question.likeCount}</p>
                              <p>생성일: ${question.createdAt}</p>
                              <p>수정일: ${question.updatedAt}</p>
                          </div>
                      `;
                  }
                  contentDiv.innerHTML = likedQuestionsHtml;
                  break;

              case 'likedAnswer':
                  let likedAnswersHtml = '';
                  for (let answer of data.likeAnswerData) {
                      likedAnswersHtml += `
                          <div class="answer">
                              <h3>${answer.title}</h3>
                              <p>${answer.content}</p>
                              <p>좋아요 수: ${answer.likeCount}</p>
                              <p>생성일: ${answer.createdAt}</p>
                              <p>수정일: ${answer.updatedAt}</p>
                          </div>
                      `;
                  }
                  contentDiv.innerHTML = likedAnswersHtml;
                  break;

              case 'postedQuestion':
                  let postedQuestionsHtml = '';
                  for (let post of data.postData) {
                      postedQuestionsHtml += `
                          <div class="postedQuestion">
                              <h3>${post.title}</h3>
                              <p>질문 유형: ${post.qType}</p>
                              <p>${post.content}</p>
                              <p>조회수: ${post.viewCount}</p>
                              <p>좋아요 수: ${post.likeCount}</p>
                              <p>생성일: ${post.createdAt}</p>
                              <p>수정일: ${post.updatedAt}</p>
                          </div>
                      `;
                  }
                  contentDiv.innerHTML = postedQuestionsHtml;
                  break;

              case 'postedAnswer':
                  let postedAnswersHtml = '';
                  for (let answer of data.answerData) {
                      postedAnswersHtml += `
                          <div class="postedAnswer">
                              <h3>${answer.title}</h3>
                              <p>${answer.content}</p>
                              <p>좋아요 수: ${answer.likeCount}</p>
                              <p>생성일: ${answer.createdAt}</p>
                              <p>수정일: ${answer.updatedAt}</p>
                          </div>
                      `;
                  }
                  contentDiv.innerHTML = postedAnswersHtml;
                  break;

              case 'commented':
                  let commentHtml = '';
                  for (let comment of data.commentData) {
                      commentHtml += `
                          <div class="comment">
                              <h3>댓글 ID: ${comment.cId}</h3>
                              <p>질문 ID: ${comment.qId}</p>
                              <p>답변 ID: ${comment.aId}</p>
                              <p>사용자 ID: ${comment.uId}</p>
                              <p>${comment.content}</p>
                          </div>
                      `;
                  }
                  contentDiv.innerHTML = commentHtml;
                  break;

              default:
                  contentDiv.innerHTML = '선택된 내용이 없습니다.';
          }
      })
      .catch(error => {
          console.error('Error fetching data:', error);
          contentDiv.innerHTML = '데이터를 가져오는데 오류가 발생했습니다.';
      });
}


// 이벤트 리스너들
document.querySelector(".liked").addEventListener("click", () => {
  displayPosts("liked");
});

document.querySelector(".writed").addEventListener("click", () => {
  displayPosts("writed");
});

document.querySelector(".answered").addEventListener("click", () => {
  displayPosts("answered");
});

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
