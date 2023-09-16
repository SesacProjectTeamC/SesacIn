
function change(buttonType) {
  console.log(buttonType)
  const contentDiv = document.getElementById('content');
  
  // 서버에서 데이터 가져오기
  console.log(data);
  axios({
    method:'GET',
    url: '/users/profile',
    data:data,
  }).then(response => {
    const data = response.data;
    console.log("Button clicked with type:", buttonType);
    switch (buttonType) {
      case 'liked':
        let likedQuestionsHtml = '';
        for (let question of data.likeQuestionData) {
          likedQuestionsHtml += [`
          <div class="question">
          <h3>${question.title}</h3>
          <p>질문 유형: ${question.qType}</p>
          <p>${question.content}</p>
          </div>
          `].join('');
        }
        contentDiv.innerHTML = likedQuestionsHtml;
        break;
        
        case 'commented':
          let likedAnswersHtml = '';
          for (let answer of data.likeAnswerData) {
            likedAnswersHtml += [`
            <div class="answer">
            <h3>${answer.title}</h3>
            <p>${answer.content}</p>
            </div>
            `].join('');
          }
          contentDiv.innerHTML = likedAnswersHtml;
          break;
          
          case 'qna':
            let postedQuestionsHtml = '';
            for (let post of data.postData) {
              postedQuestionsHtml += [`
              <div class="postedQuestion">
              <h3>${post.title}</h3>
              <p>질문 유형: ${post.qType}</p>
              <p>${post.content}</p>
              </div>
              `].join('');
            }
            contentDiv.innerHTML = postedQuestionsHtml;
            break;
            
            case 'answered':
              let postedAnswersHtml = '';
              for (let answer of data.answerData) {
                postedAnswersHtml += [`
                <div class="postedAnswer">
                <h3>${answer.title}</h3>
                <p>${answer.content}</p>
                </div>
                `].join('');
              }
              contentDiv.innerHTML = postedAnswersHtml;
              break;
              
              case 'commented':
                let commentHtml = '';
                for (let comment of data.commentData) {
                  commentHtml += [`
                  <div class="comment">
                  <p>${comment.content}</p>
                  </div>
                  `].join('');
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
            
            document.querySelector(".qna").addEventListener("click", () => {
              change("likedQuestion");
              console.log('ㅇㄹㅇㄹ');
            });
            document.querySelector(".free").addEventListener("click", () => {
              change("likedQuestion");
              console.log('ㅇㄹㅇㄹ');

            });
          
            document.querySelector(".liked").addEventListener("click", () => {
              change("likedQuestion");
              console.log('ㅇㄹㅇㄹ');

            });
            
            document.querySelector(".writed").addEventListener("click", () => {
              change("postedQuestion");
              console.log('ㅇㄹㅇㄹ');

            });
            
            document.querySelector(".answered").addEventListener("click", () => {
              change("postedAnswer");
              console.log('ㅇㄹㅇㄹ');

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
