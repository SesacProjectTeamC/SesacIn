let editor;

ClassicEditor.create(document.querySelector("#editor"), {
  placeholder: "내용을 입력하세요",
})
  .then((newEditor) => {
    editor = newEditor;
  })
  .catch((error) => {
    console.error(error);
  });

const temp = () => {
  const data = editor.getData();
  console.log(data);
};

const temp2 = () => {
  editor.setData("<p>Some text.</p>");
};

const changeType = (t) => {
  const dpLabel = document.querySelector("#dpLabel");
  dpLabel.innerHTML = t;
};

const postBoard = (t) => {
  const title = document.querySelector("#title");
  const content = editor.getData();
  if (title.value === "" || !title.value) {
    appendAlert("제목을 입력해 주세요");
  } else if (content === "" || !content) {
    appendAlert("내용을 입력해 주세요");
  } else {
    if (t === "자유") {
      axios({
        method: "POST",
        url: "/board/create",
        data: { title: title.value, content: content },
      }).then((res) => {
        if (res) {
          console.log(res.data.bId);
          document.location.href = `/board/detail/${res.data.bId}`;
        }
      });
    } else {
      const dpLabel = document.querySelector("#dpLabel").innerHTML.trim();
      console.log({ title: title.value, content: content, qType: dpLabel });
      axios({
        method: "POST",
        url: "/question/create",
        data: { title: title.value, content: content, qType: dpLabel },
      }).then((res) => {
        if (res) {
          console.log(res.data);
          document.location.href = `/question/${res.data.result.qId}`;
        }
      });
    }
  }
};

const alertPlaceholder = document.querySelector("#alertC");
const appendAlert = (message) => {
  alertPlaceholder.innerHTML = "";
  const wrapper = document.createElement("div");
  wrapper.innerHTML = [
    `<div style="display: none" id="myAlert" class="alert alert-danger alert-dismissible fade show" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    "</div>",
  ].join("");

  alertPlaceholder.append(wrapper);
  console.log(alertPlaceholder);
  window.scrollTo(0, 0);
  $("#myAlert").fadeIn();
};
