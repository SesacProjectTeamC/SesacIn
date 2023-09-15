function change(type) {
  const content = document.getElementById("content");
  const options = document.querySelectorAll(".option");
  const answeredButton = document.querySelector(".answered");

  // Reset content area first
  content.innerHTML = "";

  if (type === "qna") {
    showOptions(options);
    // 이 부분은 수정해야 합니다. 아래와 같이 변경합니다.
    displayPosts("liked");
  } else if (type === "free") {
    showOptions(options);
    answeredButton.classList.add("hidden");
    displayPosts("writed");
  } else {
    fetchData(type);
  }
}

function showOptions(options) {
  options.forEach((option) => option.classList.remove("hidden"));
}

function fetchData(type) {
  let url = `/data/${type}`;

  axios
    .get(url)
    .then((response) => {
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
      `<h2>${type + type.slice(1)} 게시판</h2>`,
    ];
    data.forEach((item) => {
      divContent += freeboardcard(item, item.cDate); // 예제로 cDate를 item에서 가져왔습니다.
    });
    content.innerHTML = divContent;
  } else {
    console.error("데이터 형식이 배열이 아닙니다:", data);
  }
}

function displayPosts(category) {
  const content = document.getElementById("content");
  let posts = [];

  // 이 부분은 AJAX 요청을 사용하여 데이터를 서버에서 불러온 후 처리해야 합니다.
  // 아래는 간단한 예시입니다.
  fetchData(category);
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
