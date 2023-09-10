const changeType = (component, type) => {
  const active = document.querySelector(".activeM");
  active.classList.remove("activeM");
  component.classList.add("activeM");
};

const showBoardList = async () => {
  console.log("showBoardList 함수");
  // GET 메소드 이용하여 자유게시판 전체 리스트 가져오시면 됩니다.
  // try {
  //   const res = await axios({
  //     method: "get",
  //     url: "/",
  //   });
  //   console.log("response : " + res.data);
  // } catch (err) {
  //   console.log("Error!", err);
  // }
};

const moveToCreateQuestion = () => {
  window.location.href = "/question/create";
};

const moveToEditQuestion = (qId) => {
  window.location.href = `/question/${qId}/edit`;
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

const createDone = () => {
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

const createCancel = () => {
  console.log("취소");

  // window.location.href = "/question/:qId";
};

const editDone = (qId) => {
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
    // window.location.href = "/question/:qId";
  });
};

const editCancel = () => {
  console.log("취소");

  // window.location.href = "/question/:qId";
};
