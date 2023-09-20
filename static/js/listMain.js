let savedPage = 1;

const getPageData = (page) => {
  const formattedPage =
    page === "next" ? savedPage + 1 : page === "prev" ? savedPage - 1 : page;
  savedPage = Number(formattedPage);
  const findType = document.querySelector("#listType").innerHTML.trim();
  axios({
    method: "GET",
    url:
      findType === "🌱 Sesac 자유게시판"
        ? `/board/list/${formattedPage}&20&createdAt&desc`
        : `/question/list/${formattedPage}&20&createdAt&desc`,
  }).then((res) => {
    console.log(res.data);
    changeList(res, findType);
    changePagination(res, formattedPage, findType);
    window.scrollTo(0, 0);
  });
};

const changeList = (res, findType) => {
  const arrayData =
    findType === "🌱 Sesac 자유게시판"
      ? res.data.boardData
      : res.data.questionData;
  const container = document.querySelector(".listC");
  container.innerHTML = "";
  for (let i = 0; i < arrayData.length; i++) {
    let include;
    if (findType === "🌱 Sesac 자유게시판") {
      include = freeboardlist(
        i + 1 + (savedPage - 1) * 20, // [세화]
        arrayData[i],
        res.data.boardCreateAt[i],
        // res.data.boardUserName[i]
      );
    } else {
      include = qnalist(
        i + 1 + (savedPage - 1) * 20, // [세화]
        arrayData[i],
        res.data.questionCreateAt[i],
        res.data.questionData[i].uName, // [태균]
        // res.data.questionUserName[i]
      );
    }
    container.innerHTML += include;
  }
};

const changePagination = (res, page, findType) => {
  const container = document.querySelector(".pagination");
  container.innerHTML = "";
  container.innerHTML = pagination(Number(page), res.data.pageCount);
};

const pagination = (page, pageCount) => {
  let result = "";
  const prev = [
    `<li id="prev" class="page-item ${page === 1 ? "disabled" : ""}">`,
    `<a class="page-link" tabindex="-1" onclick="getPageData('prev')"><</a>`,
    "</li>",
  ].join("");

  const next = [
    `<li id="next" class="page-item ${
      page === pageCount ? "disabled" : ""
    }" style="cursor: ${page === pageCount ? "" : "pointer"}">`,
    `<a class="page-link" onclick="getPageData('next')">></a>`,
    "</li>",
  ].join("");

  let content = "";
  const startNum = Number(String(Math.ceil(page / 10) - 1) + "1");
  const endNum = pageCount - startNum > 10 ? startNum + 9 : pageCount;
  for (let i = startNum; i <= endNum; i++) {
    const result = [
      `<li class="page-item ${i === page ? "active" : ""}">`,
      `<a class="page-link" onclick="getPageData('${i}')" >${i}</a>`,
      "</li>",
    ].join("");
    content += result;
  }

  result += prev;
  result += content;
  result += next;
  return result;
};

const freeboardlist = (count, data, cDate) => {
  const result = [
    `<tr  onclick="moveToDetailBoard('${data.bId}')" style="cursor: pointer">`,
    `<th>${count}</th>`,
    `<td style="text-align: start">${data.title}</td>`,
    `<td>${data.uName}</td>`, // [태균]
    `<td>${data.likeCount}</td>`,
    // `<td>${data.commentCount}</td>`, // [태균]
    `<td>${cDate}</td>`,
    "</tr>",
  ].join("");
  return result;
};

const qnalist = (count, data, cDate) => {
  const result = [
    `<tr  onclick="moveToDetailQuestion('${data.qId}')" style="cursor: pointer">`,
    `<th>${count}</th>`,
    `<td style="text-align: start">${data.title}</td>`,
    `<td>${data.uName}</td>`, // [태균]
    `<td>${data.likeCount}</td>`,
    // `<td>${data.answerCount}</td>`, // [태균]
    `<td>${cDate}</td>`,
    "</tr>",
  ].join("");
  return result;
};

const moveToDetailBoard = (bId) => {
  axios({
    method: "PATCH",
    url: `/board/detail/view/${bId}`,
  })
    .then((res) => {
      if (res) {
        document.location.href = `/board/detail/${bId}`;
      }
    })
    .catch((err) => console.log(err));
};

const moveToDetailQuestion = (qId) => {
  axios({
    method: "PATCH",
    url: `/question/${qId}/view`,
  })
    .then((res) => {
      if (res) {
        document.location.href = `/question/${qId}`;
      }
    })
    .catch((err) => console.log(err));
};
