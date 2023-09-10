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
  window.location.href = `/question/${qId}/answer/${aId}/edit`;
};

const moveToCreateComment = (qId) => {
  window.location.href = `/question/${qId}/comment`;
};

const moveToEditComment = (qId, cId) => {
  window.location.href = `/question/${qId}/comment/${cId}/edit`;
};

const deleteQuestion = (qId) => {
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

//=== Comment ===
const createCommentDone = (qId) => {
  const content = document.querySelector("#content");

  axios({
    method: "POST",
    url: `/question/${qId}/comment`,
    data: { content: content.value },
  }).then((res) => {
    if (res) {
      alert("댓글이 등록되었습니다 !");
      document.location.href = `/question/${qId}`;
    }
  });
};

const createCommentCancel = (qId) => {
  alert("취소되었습니다.");
  window.location.href = `/question/${qId}`;
};

const editCommentDone = (qId, cId) => {
  const content = document.querySelector("#content");

  axios({
    method: "PATCH",
    url: `/question/${qId}/comment/${cId}/edit`,
    data: {
      content: content.value,
    },
  }).then((res) => {
    if (res.data) {
      alert("댓글이 수정되었습니다 !");
      document.location.href = `/question/${qId}`;
    }
  });
};

const editCommentCancel = (qId) => {
  alert("취소되었습니다.");
  window.location.href = `/question/${qId}`;
};

const deleteComment = (qId, cId) => {
  if (!confirm("삭제하시겠습니까?")) return;

  axios({
    method: "DELETE",
    url: `/question/${qId}/comment/${cId}/delete`,
  }).then((res) => {
    if (res.data.result) {
      alert("삭제되었습니다");
    }
    window.location.href = `/question/${qId}`;
  });
};
