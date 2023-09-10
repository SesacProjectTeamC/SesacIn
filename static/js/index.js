const changeType = (component, type) => {
  const active = document.querySelector(".activeM");
  active.classList.remove("activeM");
  component.classList.add("activeM");
};

const moveToCreateQuestion = () => {
  window.location.href = "/question/create";
};

const moveToEditQuestion = (qId) => {
  window.location.href = `/question/${qId}/edit`;
};

const moveToCreateAnswer = (qId) => {
  window.location.href = `/question/${qId}/answer`;
};

const moveToEditAnswer = (qId, aId) => {
  console.log(qId, aId);
  window.location.href = `/question/${qId}/answer/${aId}/edit`;
};

const deleteQuestion = (qId) => {
  console.log(qId);

  if (!confirm("삭제하시겠습니까?")) return;

  axios({
    method: "DELETE",
    url: `/question/${qId}/delete`,
  }).then((res) => {
    if (res.data.result) {
      alert("삭제되었습니다");
      document.location.href = "/";
    }
  });
};

const createQuestionDone = () => {
  const title = document.querySelector("#title");
  const content = document.querySelector("#content");
  const type = "front";

  axios({
    method: "POST",
    url: "/question/create",
    data: { title: title.value, content: content.value, qType: type },
  }).then((res) => {
    if (res) {
      alert("작성 완료되었습니다 !");
      console.log(res.data.result.qId);
      document.location.href = `/question/${res.data.result.qId}`;
    }
  });
};

const createQuestionCancel = (qId) => {
  alert("취소되었습니다.");
  window.location.href = `/question/${qId}`;
};

const editQuestionDone = (qId) => {
  const title = document.querySelector("#title");
  const content = document.querySelector("#content");

  axios({
    method: "PATCH",
    url: `/question/${qId}/edit`,
    data: {
      title: title.value,
      content: content.value,
    },
  }).then((res) => {
    if (res.data) {
      alert("수정 완료되었습니다.");
      document.location.href = `/question/${qId}`;
    }
  });
};

const editQuestionCancel = (qId) => {
  window.location.href = `/question/${qId}`;
};

//=== Answer ===
const createAnswerDone = (qId) => {
  const title = document.querySelector("#title");
  const content = document.querySelector("#content");

  axios({
    method: "POST",
    url: `/question/${qId}/answer`,
    data: { title: title.value, content: content.value },
  }).then((res) => {
    if (res) {
      alert("답변이 등록되었습니다 !");
      document.location.href = `/question/${qId}`;
    }
  });
};

const createAnswerCancel = (qId) => {
  alert("취소되었습니다.");
  window.location.href = `/question/${qId}`;
};

const editAnswerDone = (qId, aId) => {
  const title = document.querySelector("#title");
  const content = document.querySelector("#content");

  axios({
    method: "PATCH",
    url: `/question/${qId}/answer/${aId}/edit`,
    data: {
      title: title.value,
      content: content.value,
    },
  }).then((res) => {
    console.log(res);
    if (res.data) {
      alert("답변이 수정되었습니다 !");
      document.location.href = `/question/${qId}`;
    }
  });
};

const editAnswerCancel = (qId) => {
  alert("취소되었습니다.");
  window.location.href = `/question/${qId}`;
};

const deleteAnswer = (qId, aId) => {
  if (!confirm("삭제하시겠습니까?")) return;

  axios({
    method: "DELETE",
    url: `/question/${qId}/answer/${aId}/delete`,
  }).then((res) => {
    if (res.data.result) {
      alert("삭제되었습니다");
    }
    window.location.href = `/question/${qId}`;
  });
};
