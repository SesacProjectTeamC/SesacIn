const { likeQuestion } = require("../../controller/Cquestion");

function change(type) {
  const content = document.getElementById("content");

  //처음에 초기화
  content.innerHTML = "";

  fetchData(type);
}

function fetchData(type) {
  let url = `/data/${type}`;

  axios
    .get(url)
    .then((response) => {
      //div태그로 렌더
      renderContent(type, response.data);
    })
    .catch((error) => {
      console.error("데이터를 불러오는 중 에러가 발생했습니다:", error);
    });
}

function renderContent(type, data) {
  const content = document.getElementById("content");
  if (Array.isArray(data)) {
    let divContent = [
      //여기서 보여줄 거 : 제목, 내용 한줄
      `<h2> ${type.likeQuestionData} </h2>`,
    ];
    data.forEach((item) => {
      divContent += change(item, item.type); 
    });
    console.log(divContent);
    content.innerHTML = divContent;
  } else {
    console.error("데이터 형식이 배열이 아닙니다:", data);
  }
}

function qnaPost (type, data){
  const content = document.getElementById("content");
  let posts = [];

  let divContent = [
    `<h2> ${type.likeQuestionData} </h2>`,
  ];
  data.forEach((item) => {
    divContent += change(item, item.type); // 예제로 cDate를 item에서 가져왔습니다.
  });
  divContent.push(posts);
  console.log(posts);
  content.innerHTML = divContent;
}else {
  console.error("데이터 형식이 배열이 아닙니다:", data);
}

function freeboardPost(type, data){

  let divContent = [
    `<h2> ${type.likeQuestionData} </h2>`,
    `<h2> ${type.answerData.slice(5)} </h2>`,

  ];

}
function likePost(type,data) {
  const content = document.getElementById("content");
  let posts = [];
  console.log(likeQuestion.likeQuestionData[0]);

  axios({
    method: 'POST',
    url: '/question/create',
    data: { title: title.value, content: content.value, qType: type },
  }).then((res) => {
    console.log('sdsd');
  });
}

function commentedPost(type, data){
  const content = document.getElementById("content");
  let posts = [];

}

function answeredPost(type, data){
  const content = document.getElementById("content");
  let posts = [];

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
