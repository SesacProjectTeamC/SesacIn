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
