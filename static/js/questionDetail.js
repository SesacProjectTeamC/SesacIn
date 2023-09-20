function addComment(qId, aId, userData) {
  const content = document.querySelector(`#commentArea${aId}`).value;
  if (content.length < 10) {
    alert('10자 이상 입력바랍니다');
  } else {
    console.log(content);

    axios({
      method: 'post',
      url: `/question/${qId}/${aId}/comment/create`,
      data: {
        content: content,
      },
    })
      .then((response) => {
        // 성공했을때 처리.
        // response.status에 의해서 판단한다.
        console.log(response.data.commentData);
        const container = document.querySelector(`#commentC${aId}`);
        console.log(container);
        container.innerHTML += commentCard(
          response.data.commentData,
          '2023-01-01',
          userData
        );

        // commentsContainer.appendChild(commentDiv);
      })
      .catch((error) => {
        // 실패했을때 처리
        // response.status에 의해서 판단되어 catch 문에서 실행된다.

        // 에러 객체 전체
        console.log(error);
      });
  }
}

const commentCard = (commentData, cDate, userData) => {
  return [
    '<div class="commentContainer" style="padding: 0px">',
    '<div class="input-group commentUser">',
    '<div class="userC">',
    '<img alt="프로필" width="24px" height="24px" style="border-radius: 999px" class="profileImg"',
    `src="${
      userData.userImgPath
        ? '/' + userData.userImgPath
        : '/static/svg/person.svg'
    }"/>`,
    `${userData.uName}</div>`,
    '<div style="font-size: 14px; color: lightgray">',
    `${cDate}`,
    '</div>',
    '</div>',
    `<div id="comment${commentData.cId}" style="margin-left: 15px; font-size: 14px; margin-bottom: 12px">`,
    `${commentData.content}</div>`,
    `<div id="fixCommentC${commentData.cId}" style="display: flex; justify-content: flex-end; color: darkgray; margin-bottom: 7px;">`,
    `<div style="cursor: pointer; margin-right: 10px; font-size: 14px" onclick="fixComment('${commentData.cId}')">수정</div>`,
    `<div style="cursor: pointer; font-size: 14px" onclick="openModal('정말 삭제하시겠어요?', 'deleteComment('${commentData.cId}')');">삭제</div>`,
    '</div>',
    '</div>',
  ].join('');
};

const fixComment = (cId, bId) => {
  document.querySelector(`#fixCommentC${cId}`).style.display = 'none';
  const commentContent = document.querySelector(`#comment${cId}`);
  const beforeC = commentContent.innerHTML;
  commentContent.innerHTML = `<textarea autofocus id="fixC" class="form-control aria-label="With textarea" style="height: 80px"">${beforeC.trim()}</textarea>`;
  commentContent.innerHTML += [
    '<div style="display: flex; justify-content: flex-end; color: darkgray; margin-top: 10px">',
    `<div class="cancelBtn" onclick="fixCancel('${beforeC.trim()}', '${cId}');">취소</div>`,
    `<div style="cursor: pointer" onclick="fixFinish('${cId}', '${bId}');">완료</div>`,
    '</div>',
  ].join('');
};

const fixCancel = (content, cId) => {
  const commentContent = document.querySelector(`#comment${cId}`);
  commentContent.innerHTML = content;
  document.querySelector(`#fixCommentC${cId}`).style.display = 'flex';
};

const fixFinish = (cId, bId) => {
  const commentContent = document.querySelector('#fixC').value;
  console.log(commentContent);
  axios({
    method: 'patch',
    url: `/board/comment/edit/${cId}`,
    data: {
      content: commentContent,
    },
  })
    .then((response) => {
      document.location.href = `/board/detail/${bId}`;
    })
    .catch((error) => {
      console.log(error);
    });
};

function deleteComment(cId, bId) {
  // 댓글 삭제 요청을 서버로 보내고, 성공하면 화면에서 삭제
  axios({
    method: 'delete',
    url: `/board/comment/delete/${cId}`,
  })
    .then((response) => {
      console.log(response.data);
      document.location.href = `/board/detail/${bId}`;
      // refreshComments(); // 댓글 목록 업데이트
    })
    .catch((error) => {
      console.error(error.message);
      console.error(error.response.data.msg);
    });
}

const deletePost = (bId) => {
  axios({
    method: 'delete',
    url: `/board/delete/${bId}`,
  })
    .then((response) => {
      document.location.href = `/`;
      // refreshComments(); // 댓글 목록 업데이트
    })
    .catch((error) => {
      console.error(error.message);
      console.error(error.response.data.msg);
    });
};

const openModal = (msg, func) => {
  const confirmBtn = document.querySelector('#deletebtn');
  document.querySelector('#cautionText').innerHTML = msg;
  confirmBtn.setAttribute('onClick', func);
  $('#myModal').modal('show');
};

const closeModal = () => {
  $('#myModal').modal('close');
};

const toggleAnswerContainer = () => {
  const myDiv = document.querySelector('.answerContainer');
  const myCancelBtn = document.querySelector('.answerCancelBtn');
  myDiv.classList.toggle('act');
  myCancelBtn.classList.toggle('dblock');
  setTimeout(() => {
    const target = document.querySelector('.btnContainer'); // 요소의 id 값이 target이라 가정
    const clientRect = target.getBoundingClientRect(); // DomRect 구하기 (각종 좌표값이 들어있는 객체)
    const relativeTop = clientRect.top; // Viewport의 시작지점을 기준으로한 상대좌표 Y 값.
    console.log(clientRect);
    // window.scrollTo(0, relativeTop);
  }, 250);
};

const postAnswer = (qId) => {
  if (document.querySelector('.answerContainer').classList.contains('act')) {
    const content = document.querySelector('.answerArea').value;
    if (content.length < 10) {
      alert('10자이상 작성해주세요');
    } else {
      axios({
        method: 'POST',
        url: `/question/${qId}/answer/create`,
        data: { title: '답변입니다', content: content },
      }).then((res) => {
        if (res) {
          document.location.href = `/question/${qId}`;
        }
      });
    }
  } else {
    toggleAnswerContainer();
  }
};

const toggleComment = (component, aId) => {
  component.classList.toggle('commentActive');
  document.querySelector(`#commentC${aId}`).classList.toggle('answerCommentC');
  document
    .querySelector(`#commentC${aId}`)
    .classList.toggle('answerCommentCShow');
};
