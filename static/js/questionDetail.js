const bLikeHandler = (qId) => {
  axios({
    method: 'PATCH',
    url: `/question/${qId}`,
  })
    .then((res) => {
      if (res) {
        const cnt = document.querySelector('.likeImg');
        const curImg = cnt.children[0].getAttribute('src');
        cnt.children[1].innerHTML =
          curImg === '/static/svg/heart-fill.svg'
            ? Number(cnt.children[1].innerHTML) - 1
            : Number(cnt.children[1].innerHTML) + 1;
        cnt.children[0].setAttribute(
          'src',
          curImg === '/static/svg/heart-fill.svg'
            ? '/static/svg/heart.svg'
            : '/static/svg/heart-fill.svg'
        );
      }
    })
    .catch((err) => {
      console.log(err.response.status);
      if (err.response.status === 401) {
        openModal(err.response.data);
      } else {
        openModal('서버오류 발생');
      }
    });
};

function addComment(qId, aId, userName, img) {
  const content = document.querySelector(`#commentArea${aId}`).value;
  if (content.length < 10) {
    alert('10자 이상 입력바랍니다');
  } else {
    axios({
      method: 'post',
      url: `/question/${qId}/${aId}/comment/create`,
      data: {
        content: content,
      },
    })
      .then((response) => {
        const container = document.querySelector(`#commentC${aId}`);
        container.innerHTML += commentCard(
          response.data.commentData,
          response.data.commentCreateAt,
          userName,
          img,
          aId,
          qId
        );
        const count = document.querySelector(`.commentCount${aId}`);

        const newCount =
          '댓글 ' +
          String(Number(count.innerHTML.replace('댓글', '').trim()) + 1);
        count.innerHTML = newCount;
      })
      .catch((err) => {
        openModal(err.response.status);
        //openModal('서버오류 발생');
      });
  }
}

const commentCard = (commentData, cDate, userName, img, aId, qId) => {
  return [
    `<div class="commentContainer${commentData.cId}" style="padding: 0px">`,
    '<div class="input-group commentUser">',
    '<div class="userC">',
    '<img alt="프로필" width="24px" height="24px" style="border-radius: 999px" class="profileImg"',
    `src="${img ? '/' + img : '/static/svg/person.svg'}"/>`,
    `${userName}</div>`,
    '<div style="font-size: 14px; color: lightgray">',
    `${cDate}`,
    '</div>',
    '</div>',
    `<div id="comment${commentData.cId}" style="margin-left: 15px; font-size: 14px; margin-bottom: 12px">`,
    `${commentData.content}</div>`,
    `<div id="fixCommentC${commentData.cId}" style="display: flex; justify-content: flex-end; color: darkgray; margin-bottom: 7px;">`,
    `<div style="cursor: pointer; margin-right: 10px; font-size: 14px" onclick="fixComment('${qId}','${commentData.cId}','${aId}')">수정</div>`,
    `<div style="cursor: pointer; font-size: 14px" onclick="openModal('정말 삭제하시겠어요?', 'deleteComment(${qId},${commentData.cId},${aId})');">삭제</div>`,
    '</div>',
    '</div>',
  ].join('');
};

const likeComment = (qId, aId) => {
  axios({
    method: 'patch',
    url: `/question/${qId}/like/${aId}`,
  })
    .then((response) => {
      const like = document.querySelector(`.aLike${aId}`);
      const clikeC = document.querySelector(`#cLikeC${aId}`);
      if (like.getAttribute('src') === '/static/svg/heart.svg') {
        like.setAttribute('src', '/static/svg/heart-fill.svg');
        clikeC.innerHTML = Number(clikeC.innerHTML.trim()) + 1;
      } else {
        like.setAttribute('src', '/static/svg/heart.svg');
        clikeC.innerHTML = Number(clikeC.innerHTML.trim()) - 1;
      }
      const likeC = document.querySelector(`.likeC${aId}`);
      likeC.classList.toggle('likeActive');
    })
    .catch((err) => {
      if (err.response.status === 401) {
        openModal(err.response.data);
      } else {
        openModal('서버오류 발생');
      }
    });
};

const fixComment = (qId, cId, aId) => {
  document.querySelector(`#fixCommentC${cId}`).style.display = 'none';
  const commentContent = document.querySelector(`#comment${cId}`);
  const beforeC = commentContent.innerHTML;
  commentContent.innerHTML = `<textarea autofocus id="fixC" class="form-control aria-label="With textarea" style="height: 80px"">${beforeC.trim()}</textarea>`;
  commentContent.innerHTML += [
    '<div style="display: flex; justify-content: flex-end; color: darkgray; margin-top: 10px">',
    `<div class="cancelBtn" onclick="fixCancel('${beforeC.trim()}', '${cId}');">취소</div>`,
    `<div style="cursor: pointer" onclick="fixFinish('${qId}', '${cId}', '${aId}');">완료</div>`,
    '</div>',
  ].join('');
};

const fixAnswer = (qId, aId) => {
  document.querySelector(`#fixAnswerC${aId}`).style.display = 'none';
  const answerContent = document.querySelector(`#answer${aId}`);
  const beforeA = answerContent.innerHTML;
  answerContent.innerHTML = `<textarea autofocus id="fixA" class="form-control aria-label="With textarea" style="height: 140px"">${beforeA.trim()}</textarea>`;
  answerContent.innerHTML += [
    '<div style="display: flex; justify-content: flex-end; color: darkgray; margin-top: 10px">',
    `<div class="cancelBtn" onclick="fixAnswerCancel('${beforeA.trim()}', '${aId}');">취소</div>`,
    `<div style="cursor: pointer" onclick="fixAnswerFinish('${qId}', '${aId}');">완료</div>`,
    '</div>',
  ].join('');
};

const fixCancel = (content, cId) => {
  const commentContent = document.querySelector(`#comment${cId}`);
  commentContent.innerHTML = content;
  document.querySelector(`#fixCommentC${cId}`).style.display = 'flex';
};

const fixAnswerCancel = (content, aId) => {
  const commentContent = document.querySelector(`#answer${aId}`);
  commentContent.innerHTML = content;
  document.querySelector(`#fixAnswerC${aId}`).style.display = 'flex';
};

const fixFinish = (qId, cId, aId) => {
  const commentContent = document.querySelector('#fixC').value;

  axios({
    method: 'patch',
    url: `/question/${qId}/${aId}/comment/${cId}/edit`,
    data: {
      content: commentContent,
    },
  })
    .then((response) => {
      const content = document.querySelector(`#comment${cId}`);
      content.innerHTML = commentContent;
      document.querySelector(`#fixCommentC${cId}`).style.display = 'flex';
    })
    .catch((err) => {
      if (err.response.status === 501) {
        // openModal(err.response.data.msg);
        openModal('내용을 입력해주세요! 혹은 내용을 변경해주세요!');
      } else {
        openModal('서버오류 발생');
      }
    });
};

const fixAnswerFinish = (qId, aId) => {
  const answerContent = document.querySelector('#fixA').value;
  axios({
    method: 'patch',
    url: `/question/${qId}/answer/${aId}/edit`,
    data: {
      content: answerContent,
    },
  })
    .then((response) => {
      const content = document.querySelector(`#answer${aId}`);
      content.innerHTML = answerContent;
      document.querySelector(`#fixAnswerC${aId}`).style.display = 'flex';
    })
    .catch((err) => {
      if (err.response.status === 501) {
        // openModal(err.response.data.msg);
        openModal('내용을 입력해주세요! 혹은 내용을 변경해주세요!');
      } else {
        openModal('서버오류 발생');
      }
    });
};

function deleteComment(qId, cId, aId) {
  // 댓글 삭제 요청을 서버로 보내고, 성공하면 화면에서 삭제
  axios({
    method: 'delete',
    url: `/question/${qId}/${aId}/comment/${cId}/delete`,
  })
    .then((response) => {
      const content = document.querySelector(`#comment${cId}`);
      let myDiv = document.querySelector(`.commentContainer${cId}`);
      let parent = myDiv.parentElement; // 부모 객체 알아내기
      parent.removeChild(myDiv);

      const count = document.querySelector(`.commentCount${aId}`);

      const newCount =
        '댓글 ' +
        String(Number(count.innerHTML.replace('댓글', '').trim()) - 1);
      count.innerHTML = newCount;
    })
    .catch((error) => {
      console.error(error.message);
      console.error(error.response.data.msg);
    });
}

function deleteAnswer(qId, aId) {
  // 댓글 삭제 요청을 서버로 보내고, 성공하면 화면에서 삭제
  axios({
    method: 'delete',
    url: `/question/${qId}/answer/${aId}/delete`,
  })
    .then((response) => {
      document.location.href = `/question/${qId}`;
    })
    .catch((error) => {
      console.error(error.message);
      console.error(error.response.data.msg);
    });
}

const deletePost = (qId) => {
  axios({
    method: 'delete',
    url: `/question/${qId}/delete`,
  })
    .then((response) => {
      document.location.href = `/`;
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
      })
        .then((res) => {
          if (res) {
            document.location.href = `/question/${qId}`;
          }
        })
        .catch((err) => {
          if (err.response.status === 401) {
            openModal(err.response.data);
          } else {
            openModal('서버오류 발생');
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
